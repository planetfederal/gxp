/**
 * @require plugins/LayerSource.js
 */

/**
 * The WMSCapabilities format parses the document and passes the raw data to
 * the WMSCapabilitiesReader.  There, records are created from layer data.
 * The rest of the data is lossed.  It makes sense to store this raw data
 * somewhere - either on the OpenLayers format or the GeoExt reader.  Until
 * there is a better solution, we'll override the reader's readRecords method
 * here so that we can have access to the raw data later.
 * 
 * The purpose of all of this is to get the service title later.
 * TODO: push this to OpenLayers or GeoExt
 */
(function() {
    var proto = GeoExt.data.WMSCapabilitiesReader.prototype;
    var original = proto.readRecords;
    proto.readRecords = function(data) {
        if (typeof data === "string" || data.nodeType) {
            data = this.meta.format.read(data);
        }
        // here is the new part
        this.raw = data;
        // continue with the original
        return original.call(this, data);
    };
})();

Ext.namespace("gxp.plugins");

gxp.plugins.WMSSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gx_wmssource */
    ptype: "gx_wmssource",
    
    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {
        var parts = this.url.split("?");
        var params = Ext.apply(parts[1] && Ext.urlDecode(parts[1]) || {}, {
            SERVICE: "WMS",
            REQUEST: "GetCapabilities"
        });
        var url = Ext.urlAppend(parts[0], Ext.urlEncode(params));
        
        this.store = new GeoExt.data.WMSCapabilitiesStore({
            url: url,
            autoLoad: true,
            listeners: {
                load: function() {
                    if (!this.title) {
                        this.title = this.store.reader.raw.service.title;                        
                    }
                    this.fireEvent("ready", this);
                },
                exception: function(proxy, type, action, options, response, arg) {
                    delete this.store;
                    var msg;
                    if (type === "response") {
                        msg = "Invalid response from server: Status " + response.status; 
                    } else {
                        msg = "Trouble creating layer store from response.";
                    }
                    // TODO: decide on signature for failure listeners
                    this.fireEvent("failure", this, msg, Array.slice(arguments));
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

            layer = new OpenLayers.Layer.WMS(
                config.title || layer.name, 
                layer.url, 
                {
                    layers: layer.params["LAYERS"],
                    styles: (("styles" in config) ? config.styles : layer.params["STYLES"]) || undefined,
                    format: (("format" in config) ? config.format : layer.params["FORMAT"]) || undefined,
                    transparent: ("transparent" in config) ? config.transparent : true
                }, {
                    attribution: layer.attribution,
                    maxExtent: maxExtent,
                    restrictedExtent: maxExtent,
                    singleTile: ("tiled" in config) ? !config.tiled : false,
                    ratio: config.ratio || 1,
                    visibility: ("visibility" in config) ? config.visibility : true,
                    opacity: ("opacity" in config) ? config.opacity : 1,
                    buffer: ("buffer" in config) ? config.buffer : 1
                }
            );

            // data for the new record
            var data = Ext.applyIf({
                title: layer.name,
                group: config.group,
                source: config.source,
                properties: "gx_wmslayerpanel",
                fixed: config.fixed,
                layer: layer
            }, original.data);
            
            // add additional fields
            var fields = [
                {name: "source", type: "string"}, 
                {name: "group", type: "string"},
                {name: "properties", type: "string"},
                {name: "fixed", type: "boolean"}
            ];
            original.fields.each(function(field) {
                fields.push(field);
            });

            var Record = GeoExt.data.LayerRecord.create(fields);
            record = new Record(data, layer.id);

        }
        return record;
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
        return Ext.apply(config, {
            format: layer.params.FORMAT,
            styles: layer.params.STYLES
        });
    }
    
});

Ext.preg(gxp.plugins.WMSSource.prototype.ptype, gxp.plugins.WMSSource);
