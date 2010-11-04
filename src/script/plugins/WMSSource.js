/**
 * @require plugins/LayerSource.js
 */

/**
 * The WMSCapabilities and WFSDescribeFEature formats parse the document and
 * pass the raw data to the WMSCapabilitiesReader/AttributeReader.  There,
 * records are created from layer data.  The rest of the data is lossed.  It
 * makes sense to store this raw data somewhere - either on the OpenLayers
 * format or the GeoExt reader.  Until there is a better solution, we'll
 * override the reader's readRecords method  here so that we can have access to
 * the raw data later.
 * 
 * The purpose of all of this is to get the service title, feature type and
 * namespace later.
 * TODO: push this to OpenLayers or GeoExt
 */
(function() {
    function keepRaw(data) {
        if (typeof data === "string" || data.nodeType) {
            data = this.meta.format.read(data);
        }
        // here is the new part
        this.raw = data;
    };
    Ext.intercept(GeoExt.data.WMSCapabilitiesReader.prototype, "readRecords", keepRaw);
    Ext.intercept(GeoExt.data.AttributeReader.prototype, "readRecords", keepRaw);
})();

Ext.namespace("gxp.plugins");

gxp.plugins.WMSSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gx_wmssource */
    ptype: "gx_wmssource",
    
    /** private: property[describeLayerStore]
     *  ``GeoExt.data.WMSDescribeLayerStore`` additional store of layer
     *  descriptions. Will only be available when the source is configured
     *  with ``describeLayers`` set to true.
     */
    describeLayerStore: null,
    
    schemaCache: null,
    
    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {
        this.store = new GeoExt.data.WMSCapabilitiesStore({
            url: this.url,
            baseParams: {
                SERVICE: "WMS",
                REQUEST: "GetCapabilities"
            },
            autoLoad: true,
            listeners: {
                load: function() {
                    // The load event is fired even if a bogus capabilities doc 
                    // is read (http://trac.geoext.org/ticket/295).
                    // Until this changes, we duck type a bad capabilities 
                    // object and fire failure if found.
                    if (!this.store.reader.raw || !this.store.reader.raw.service) {
                        this.fireEvent("failure", this, "Invalid capabilities document.");
                    } else {
                        if (!this.title) {
                            this.title = this.store.reader.raw.service.title;                        
                        }
                        this.fireEvent("ready", this);
                    }
                },
                exception: function(proxy, type, action, options, response, arg) {
                    delete this.store;
                    var msg;
                    if (type === "response") {
                        msg = arg || "Invalid response from server.";
                    } else {
                        msg = "Trouble creating layer store from response.";
                    }
                    // TODO: decide on signature for failure listeners
                    this.fireEvent("failure", this, msg, Array.prototype.concat(arguments));
                },
                scope: this
            }
        });        
    },
    
    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        var record;
        var index = this.store.findExact("name", config.name);
        if (index > -1) {
            var original = this.store.getAt(index);

            var layer = original.get("layer");

            /**
             * TODO: The WMSCapabilitiesReader should allow for creation
             * of layers in different SRS.
             */
            var projConfig = this.target.mapPanel.map.projection;
            var projection = this.target.mapPanel.map.getProjectionObject() ||
                (projConfig && new OpenLayers.Projection(projConfig)) ||
                new OpenLayers.Projection("EPSG:4326");
            
            // If the layer is not available in the map projection, find a
            // compatible projection that equals the map projection. This helps
            // us in dealing with the different EPSG codes for web mercator.
            var availableSRS = original.get("srs"), compatibleProjection;
            if (!availableSRS[projection.getCode()]) {
                var p, srs;
                for (srs in availableSRS) {
                    if ((p=new OpenLayers.Projection(srs)).equals(projection)) {
                        compatibleProjection = p;
                        break;
                    }
                }
            }

            var nativeExtent = original.get("bbox")[projection.getCode()]
            var maxExtent = 
                (nativeExtent && OpenLayers.Bounds.fromArray(nativeExtent.bbox)) || 
                OpenLayers.Bounds.fromArray(original.get("llbbox")).transform(new OpenLayers.Projection("EPSG:4326"), projection);
            
            // make sure maxExtent is valid (transform does not succeed for all llbbox)
            if (!(1 / maxExtent.getHeight() > 0) || !(1 / maxExtent.getWidth() > 0)) {
                // maxExtent has infinite or non-numeric width or height
                // in this case, the map maxExtent must be specified in the config
                maxExtent = undefined;
            }
            
            // use all params from original
            var params = Ext.applyIf({
                STYLES: config.styles,
                FORMAT: config.format,
                TRANSPARENT: config.transparent
            }, layer.params);

            layer = new OpenLayers.Layer.WMS(
                config.title || layer.name, 
                layer.url, 
                params, {
                    attribution: layer.attribution,
                    maxExtent: maxExtent,
                    restrictedExtent: maxExtent,
                    singleTile: ("tiled" in config) ? !config.tiled : false,
                    ratio: config.ratio || 1,
                    visibility: ("visibility" in config) ? config.visibility : true,
                    opacity: ("opacity" in config) ? config.opacity : 1,
                    buffer: ("buffer" in config) ? config.buffer : 1,
                    projection: compatibleProjection
                }
            );

            // data for the new record
            var data = Ext.applyIf({
                title: layer.name,
                group: config.group,
                source: config.source,
                properties: "gx_wmslayerpanel",
                fixed: config.fixed,
                selected: "selected" in config ? config.selected : false,
                layer: layer
            }, original.data);
            
            // add additional fields
            var fields = [
                {name: "source", type: "string"}, 
                {name: "group", type: "string"},
                {name: "properties", type: "string"},
                {name: "fixed", type: "boolean"},
                {name: "selected", type: "boolean"}
            ];
            original.fields.each(function(field) {
                fields.push(field);
            });

            var Record = GeoExt.data.LayerRecord.create(fields);
            record = new Record(data, layer.id);

        }
        
        return record;
    },
    
    /** private: method[initDescribeLayerStore]
     *  creates a WMSDescribeLayer store for layer descriptions of all layers
     *  created from this source.
     */
    initDescribeLayerStore: function() {
        var req = this.store.reader.raw.capability.request.describelayer;
        if (req) {
            this.describeLayerStore = new GeoExt.data.WMSDescribeLayerStore({
                url: req.href,
                baseParams: {
                    // TODO: version negotiation?
                    VERSION: "1.1.1",
                    REQUEST: "DescribeLayer"
                }
            });
        }
    },
    
    /** api: method[describeLayer]
     *  :param rec: ``GeoExt.data.LayerRecord`` the layer to issue a WMS
     *      DescribeLayer request for
     *  :param callback: ``Function`` Callback function. Will be called with
     *      an ``Ext.data.Record`` containing the result as first argument, or
     *      false if the WMS does not support DescribeLayer.
     *  :param scope: ``Object`` Optional scope for the callback.
     */
    describeLayer: function(rec, callback, scope) {
        !this.describeLayerStore && this.initDescribeLayerStore();
        if (!this.describeLayerStore) {
            callback.call(scope, false);
            return;
        }
        if (!arguments.callee.describedLayers) {
            arguments.callee.describedLayers = {};
        }
        var layerName = rec.getLayer().params.LAYERS;
        var cb = function() {
            var recs = Ext.isArray(arguments[1]) ? arguments[1] : arguments[0];
            var rec;
            for (var i=recs.length-1; i>=0; i--) {
                rec = recs[i];
                if (rec.get("layerName") == layerName) {
                    callback.call(scope, rec);
                    break;
                }
            }
        };
        var describedLayers = arguments.callee.describedLayers;
        var index;
        if (!describedLayers[layerName]) {
            describedLayers[layerName] = true;
            this.describeLayerStore.load({
                params: {LAYERS: layerName},
                add: true,
                callback: cb
            });
        } else if ((index = this.describeLayerStore.findExact("layerName", layerName)) == -1) {
            this.describeLayerStore.on("load", cb, this, {single: true});
        } else {
            callback.call(scope, this.describeLayerStore.getAt(index));
        }
    },
    
    /** api: method[getSchema]
     *  :param rec: ``GeoExt.data.LayerRecord`` the WMS layer to issue a WFS
     *      DescribeFeatureType request for
     *  :param callback: ``Function`` Callback function. Will be called with
     *      a ``GeoExt.data.AttributeStore`` containing the result as first
     *      argument, or false if the WMS does not support DescribeLayer or the
     *      layer is not associated with a WFS feature type.
     *  :param scope: ``Object`` Optional scope for the callback.
     */
    getSchema: function(rec, callback, scope) {
        if (!this.schemaCache) {
            this.schemaCache = {};
        }
        this.describeLayer(rec, function(r) {
            if (r.get("owsType") == "WFS") {
                var typeName = r.get("typeName");
                var schema = this.schemaCache[typeName];
                if (schema) {
                    if (schema.getCount() == 0) {
                        schema.on("load", function() {
                            callback.call(scope, schema);
                        }, this, {single: true});
                    } else {
                        callback.call(scope, schema);
                    }
                } else {
                    schema = new GeoExt.data.AttributeStore({
                        url: r.get("owsURL"),
                        baseParams: {
                            SERVICE: "WFS",
                            VERSION: "1.1.1",
                            REQUEST: "DescribeFeatureType",
                            TYPENAME: typeName
                        },
                        autoLoad: true,
                        listeners: {
                            "load": function() {
                                callback.call(scope, schema);
                            },
                            scope: this
                        }
                    });
                    this.schemaCache[typeName] = schema;
                }
            } else {
                callback.call(scope, false);
            }
        }, this);
   },
    
    /** api: method[getConfigForRecord]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :returns: ``Object``
     *
     *  Create a config object that can be used to recreate the given record.
     */
    getConfigForRecord: function(record) {
        var config = gxp.plugins.WMSSource.superclass.getConfigForRecord.apply(this, arguments);
        var layer = record.get("layer");
        var params = layer.params;
        return Ext.apply(config, {
            format: params.FORMAT,
            styles: params.STYLES,
            transparent: params.TRANSPARENT
        });
    }
    
});

Ext.preg(gxp.plugins.WMSSource.prototype.ptype, gxp.plugins.WMSSource);
