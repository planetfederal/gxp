/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/LayerSource.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = StamenSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: StamenSource(config)
 *
 *    Plugin for using Stamen layers with :class:`gxp.Viewer` instances.
 *
 *    Available layer names are "toner", "toner-lines", "toner-labels"
 *    "terrain" and "watercolor".
 */
/** api: example
 *  The configuration in the ``sources`` property of the :class:`gxp.Viewer` is
 *  straightforward:
 *
 *  .. code-block:: javascript
 *
 *    "stamen": {
 *        ptype: "gxp_stamensource"
 *    }
 *
 *  A typical configuration for a layer from this source (in the ``layers``
 *  array of the viewer's ``map`` config option would look like this:
 *
 *  .. code-block:: javascript
 *
 *    {
 *        source: "stamen",
 *        name: "watercolor"
 *    }
 *
 */
gxp.plugins.StamenSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gxp_stamensource */
    ptype: "gxp_stamensource",

    /** api: property[store]
     *  ``GeoExt.data.LayerStore``. Will contain records with "osm" and
     *  "naip" as name field values.
     */
    
    /** api: config[title]
     *  ``String``
     *  A descriptive title for this layer source (i18n).
     */
    title: "Stamen Layers",

    /** api: config[osmAttribution]
     *  ``String``
     *  Attribution string for OSM generated layer (i18n).
     */
    attribution: "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.",

    /** api: config[watercolorTitle]
     *  ``String``
     *  Title for Watercolor layer (i18n).
     */
    watercolorTitle: "Stamen Watercolor",

    /** api: config[tonerTitle]
     *  ``String``
     *  Title for Toner layer (i18n).
     */
    tonerTitle: "Stamen Toner",


    /** api: config[tonerLinesTitle]
     *  ``String``
     *  Title for Toner Lines layer (i18n).
     */
    tonerLinesTitle: "Stamen Toner Lines",

    /** api: config[tonerLabelsTitle]
     *  ``String``
     *  Title for Toner Labels layer (i18n).
     */
    tonerLabelsTitle: "Stamen Toner Labels",

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
            numZoomLevels: 20,
            units: "m",
            buffer: 1,
            transitionEffect: "resize",
            tileOptions: {crossOriginKeyword: null}
        };
        watercolorOptions = options;
        watercolorOptions.numZoomlevels = 16;

        var layers = [
            new OpenLayers.Layer.OSM(
                this.watercolorTitle,
                [
                    "http://tile.stamen.com/watercolor/${z}/${x}/${y}.jpg",
                    "http://a.tile.stamen.com/watercolor/${z}/${x}/${y}.jpg",
                    "http://b.tile.stamen.com/watercolor/${z}/${x}/${y}.jpg",
                    "http://c.tile.stamen.com/watercolor/${z}/${x}/${y}.jpg",
                    "http://d.tile.stamen.com/watercolor/${z}/${x}/${y}.jpg"
                ],
                OpenLayers.Util.applyDefaults({                
                    attribution: this.attribution,
                    type: "watercolor"
                }, watercolorOptions)
            ),
            new OpenLayers.Layer.OSM(
                this.tonerTitle,
                [
                    "http://tile.stamen.com/toner/${z}/${x}/${y}.jpg",
                    "http://a.tile.stamen.com/toner/${z}/${x}/${y}.jpg",
                    "http://b.tile.stamen.com/toner/${z}/${x}/${y}.jpg",
                    "http://c.tile.stamen.com/toner/${z}/${x}/${y}.jpg",
                    "http://d.tile.stamen.com/toner/${z}/${x}/${y}.jpg"
                ],
                OpenLayers.Util.applyDefaults({
                    attribution: this.attribution,
                    type: "toner"
                }, options)
             ),
            new OpenLayers.Layer.OSM(
                this.tonerLinesTitle,
                [
                    "http://tile.stamen.com/toner-lines/${z}/${x}/${y}.jpg",
                    "http://a.tile.stamen.com/toner-lines/${z}/${x}/${y}.jpg",
                    "http://b.tile.stamen.com/toner-lines/${z}/${x}/${y}.jpg",
                    "http://c.tile.stamen.com/toner-lines/${z}/${x}/${y}.jpg",
                    "http://d.tile.stamen.com/toner-lines/${z}/${x}/${y}.jpg"
                ],
                OpenLayers.Util.applyDefaults({
                    attribution: this.attribution,
                    type: "toner-lines"
                }, options)
 
            ),
            new OpenLayers.Layer.OSM(
                this.tonerLabelsTitle,
                [
                    "http://tile.stamen.com/toner-labels/${z}/${x}/${y}.jpg",
                    "http://a.tile.stamen.com/toner-labels/${z}/${x}/${y}.jpg",
                    "http://b.tile.stamen.com/toner-labels/${z}/${x}/${y}.jpg",
                    "http://c.tile.stamen.com/toner-labels/${z}/${x}/${y}.jpg",
                    "http://d.tile.stamen.com/toner-labels/${z}/${x}/${y}.jpg"
                ],
                OpenLayers.Util.applyDefaults({
                    attribution: this.attribution,
                    type: "toner-labels"
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

Ext.preg(gxp.plugins.StamenSource.prototype.ptype, gxp.plugins.StamenSource);
