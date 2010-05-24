/**
 * @require plugins/LayerSource.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.WMSSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gx-wmssource */
    ptype: "gx-wmssource",

    /** api: property[store]
     *  ``GeoExt.data.LayerStore``
     */
    
    /** api: method[createStore]
     *  :arg callback: ``Function``  Called when the store is loaded.
     *
     *  Create a store of layers.  Calls the provided callback when the 
     *  store has loaded.
     */
    createStore: function(callback) {
        var parts = this.url.split("?");
        var params = Ext.apply(parts[1] && Ext.urlDecode(parts[1]) || {}, {
            SERVICE: "WMS",
            REQUEST: "GetCapabilities"
        });
        var url = Ext.urlAppend(parts[0], Ext.urlEncode(params));
        
        this.store = new GeoExt.data.WMSCapabilitiesStore({
            url: url,
            autoLoad: true,
            listeners: {load: callback}
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
                OpenLayers.Bounds.fromArray(record.get("llbbox")).transform(new OpenLayers.Projection("EPSG:4326"), projection);

            layer = new OpenLayers.Layer.WMS(
                config.title || layer.name, 
                layer.url, 
                {
                    layers: layer.params["LAYERS"],
                    format: ("format" in config) ? config.format : layer.params["FORMAT"],
                    transparent: ("transparent" in config) ? config.transparent : true
                }, {
                    attribution: layer.attribution,
                    maxExtent: maxExtent,
                    visibility: ("visibility" in config) ? config.visibility : true,
                    opacity: ("opacity" in config) ? config.opacity : 1
                }
            );

            // data for the new record
            var data = Ext.applyIf({
                title: layer.name,
                group: config.group,
                source: this.id,
                layer: layer
            }, original.data);
            
            // add a field for the source id and group
            var fields = [{
                name: "source", type: "string"
            }, {
                name: "group", type: "string"
            }];
            original.fields.each(function(field) {
                fields.push(field);
            });

            var Record = GeoExt.data.LayerRecord.create(fields);
            record = new Record(data, layer.id);

        }
        return record;
    },
    
    getConfigForRecord: function(record) {
        var layer = record.get("layer");
        return {
            name: record.get("name"),
            title: record.get("title"),
            visibility: layer.getVisibility(),
            format: layer.params.FORMAT,
            opacity: layer.opacity || undefined,
            group: record.get("group"),
            source: this.id
        };
    }
    
});

Ext.preg(gxp.plugins.WMSSource.prototype.ptype, gxp.plugins.WMSSource);
