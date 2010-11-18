/**
 * @requires plugins/LayerSource.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.OSMSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gx_osmsource */
    ptype: "gx_osmsource",

    /** api: property[store]
     *  ``GeoExt.data.LayerStore``
     */
    
    /** api: property[title]
     *  ``String``
     *  A descriptive title for this layer source.  Default is "Google Layers".
     */
    title: "OpenStreetMap Layers",

    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {
        
        var options = {
            projection: "EPSG:900913",
            maxExtent: new OpenLayers.Bounds(
                -128 * 156543.0339, -128 * 156543.0339,
                128 * 156543.0339, 128 * 156543.0339
            ),
            maxResolution: 156543.0339,
            numZoomLevels: 19,
            units: "m",
            buffer: 1
        };
        
        var layers = [
            new OpenLayers.Layer.OSM(
                "OpenStreetMap",
                [
                    "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
                    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
                ],
                OpenLayers.Util.applyDefaults({                
                    attribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
                    type: "mapnik"
                }, options)
            ),
            new OpenLayers.Layer.OSM(
                "Tiles@home",
                [
                    "http://a.tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png",
                    "http://b.tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png",
                    "http://c.tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png"
                ],
                OpenLayers.Util.applyDefaults({                
                    attribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
                    type: "osmarender"
                }, options)
            )
        ];
        
        this.store = new GeoExt.data.LayerStore({
            layers: layers,
            fields: [
                {name: "source", type: "string"},
                {name: "name", type: "string", mapping: "type"},
                {name: "abstract", type: "string", mapping: "attribution"},
                {name: "group", type: "string", defaultValue: "background"},
                {name: "fixed", type: "boolean", defaultValue: true},
                {name: "selected", type: "boolean"}
            ]
        });
        this.store.each(function(l) {
            l.set("group", "background");
        });
        this.fireEvent("ready", this);

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

            record = this.store.getAt(index).copy(Ext.data.Record.id({}));
            var layer = record.get("layer").clone();
 
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

            // set visibility from config
            if ("visibility" in config) {
                layer.visibility = config.visibility
            }
            
            record.set("selected", config.selected || false);
            record.set("source", config.source);
            record.set("name", config.name);
            if ("group" in config) {
                record.set("group", config.group);
            }

            record.data.layer = layer;
            record.commit();
        };
        return record;
    }

});

Ext.preg(gxp.plugins.OSMSource.prototype.ptype, gxp.plugins.OSMSource);
