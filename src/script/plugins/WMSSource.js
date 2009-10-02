/**
 * @require plugins/LayerSource.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.WMSSource = Ext.extend(gxp.plugins.LayerSource, {

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
            /**
             * If the same layer is added twice, it will get replaced
             * unless we give each record a unique id.  In addition, we
             * need to clone the layer so that the map doesn't assume
             * the layer has already been added.  Finally, we can't
             * simply set the record layer to the cloned layer because
             * record.set compares String(value) to determine equality.
             * 
             * TODO: suggest record.clone
             */
            Ext.data.Record.AUTO_ID++;
            record = this.store.getAt(index).copy(Ext.data.Record.AUTO_ID);

            var layer = record.get("layer");
            /**
             * TODO: The WMSCapabilitiesReader should allow for creation
             * of layers in different SRS.
             */
            var projConfig = this.target.mapPanel.map.projection;
            var projection = this.target.mapPanel.map.getProjectionObject() ||
                (projConfig && new OpenLayers.Projection(projConfig)) ||
                new OpenLayers.Projection("EPSG:4326");
            layer = new OpenLayers.Layer.WMS(
                layer.name, layer.url, {
                    layers: layer.params["LAYERS"],
                    transparent: ("transparent" in config) ? config.transparent : true
                },
                {
                    attribution: layer.attribution,
                    maxExtent: OpenLayers.Bounds.fromArray(
                        record.get("llbbox")
                    ).transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        projection
                    ),
                    visibility: ("visibility" in config) ? config.visibility : true
                }
            );
            
            // set layer title from config
            if (config.title) {
                /**
                 * Because the layer title data is duplicated, we have
                 * to set it in both places.  After records have been
                 * added to the store, the store handles this
                 * synchronization.
                 */
                layer.setName(config.title);
                record.set("title", config.title);
            }
            
            /**
             * TODO: record field values must be serializable, push this to the record
             */
            record.data.layer = layer;

            record.set("group", config.group);
            record.commit();
        }
        return record;
    }
    
});

/** api: ptype = gx-wmssource */
Ext.preg("gx-wmssource", gxp.plugins.WMSSource);
