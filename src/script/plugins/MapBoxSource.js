/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/LayerSource.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = MapBoxSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: MapBoxSource(config)
 *
 *    Plugin for using MapBox layers with :class:`gxp.Viewer` instances.
 *    Freely available for commercial and non-commercial use according to the
 *    MapBox terms of service: http://mapbox.com/tos
 *
 *    Available layer names:
 *     * blue-marble-topo-bathy-jan
 *     * blue-marble-topo-bathy-jul
 *     * blue-marble-topo-jan
 *     * blue-marble-topo-jul
 *     * control-room
 *     * geography-class
 *     * natural-earth-hypso
 *     * natural-earth-hypso-bathy
 *     * natural-earth-1
 *     * natural-earth-2
 *     * world-dark
 *     * world-light
 *     * world-print
 *
 */
/** api: example
 *  The configuration in the ``sources`` property of the :class:`gxp.Viewer` is
 *  straightforward:
 *
 *  .. code-block:: javascript
 *
 *    mapbox: {
 *        ptype: "gxp_mapboxsource"
 *    }
 *
 *  A typical configuration for a layer from this source (in the ``layers``
 *  array of the viewer's ``map`` config option would look like this:
 *
 *  .. code-block:: javascript
 *
 *    {
 *        source: "mapbox",
 *        name: "blue-marble-topo-bathy-jan"
 *    }
 *
 */
gxp.plugins.MapBoxSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gxp_mapboxsource */
    ptype: "gxp_mapboxsource",

    /** api: property[store]
     *  ``GeoExt.data.LayerStore``. Will contain records with name field values
     *  matching MapBox layer names.
     */
    
    /** api: config[title]
     *  ``String``
     *  A descriptive title for this layer source (i18n).
     */
    title: "MapBox Layers",
    
    /** i18n **/
    blueMarbleTopoBathyJanTitle: "Blue Marble Topography & Bathymetry (January)",
    blueMarbleTopoBathyJulTitle: "Blue Marble Topography & Bathymetry (July)",
    blueMarbleTopoJanTitle: "Blue Marble Topography (January)",
    blueMarbleTopoJulTitle: "Blue Marble Topography (July)",
    controlRoomTitle: "Control Room",
    geographyClassTitle: "Geography Class",
    naturalEarthHypsoTitle: "Natural Earth Hypsometric",
    naturalEarthHypsoBathyTitle: "Natural Earth Hypsometric & Bathymetry",
    naturalEarth1Title: "Natural Earth I",
    naturalEarth2Title: "Natural Earth II",
    worldDarkTitle: "World Dark",
    worldLightTitle: "World Light",
    worldPrintTitle: "World Print",

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
            maxResolution: 156543.03390625,
            numZoomLevels: 19,
            units: "m",
            buffer: 1
        };
        
        var names = [
             "blue-marble-topo-bathy-jan",
             "blue-marble-topo-bathy-jul",
             "blue-marble-topo-jan",
             "blue-marble-topo-jul",
             "control-room",
             "geography-class",
             "natural-earth-hypso",
             "natural-earth-hypso-bathy",
             "natural-earth-1",
             "natural-earth-2",
             "world-dark",
             "world-light",
             "world-print"
        ];
        
        var len = names.length;
        var layers = new Array(len);
        var name;
        for (var i=0; i<len; ++i) {
            name = names[i];
            layers[i] = new OpenLayers.Layer.TMS(
                this[OpenLayers.String.camelize(name) + "Title"],
                [
                    "http://a.tiles.mapbox.com/mapbox/",
                    "http://b.tiles.mapbox.com/mapbox/",
                    "http://c.tiles.mapbox.com/mapbox/",
                    "http://d.tiles.mapbox.com/mapbox/"
                ],
                OpenLayers.Util.applyDefaults({
                    attribution: /^world/.match(name) ?
                        "<a href='http://mapbox.com'>MapBox</a> | Some Data &copy; OSM CC-BY-SA | <a href='http://mapbox.com/tos'>Terms of Service</a>" :
                        "<a href='http://mapbox.com'>MapBox</a> | <a href='http://mapbox.com/tos'>Terms of Service</a>",
                    type: "png",
                    tileOrigin: new OpenLayers.LonLat(-128 * 156543.0339, -128 * 156543.0339),
                    layername: name
                }, options)
            );
        }
        
        this.store = new GeoExt.data.LayerStore({
            layers: layers,
            fields: [
                {name: "source", type: "string"},
                {name: "name", type: "string", mapping: "layername"},
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
            var layer = record.getLayer().clone();
 
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
                layer.visibility = config.visibility;
            }
            
            record.set("selected", config.selected || false);
            record.set("source", config.source);
            record.set("name", config.name);
            if ("group" in config) {
                record.set("group", config.group);
            }

            record.data.layer = layer;
            record.commit();
        }
        return record;
    }

});

Ext.preg(gxp.plugins.MapBoxSource.prototype.ptype, gxp.plugins.MapBoxSource);
