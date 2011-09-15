/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/WMSSource.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WMSCSource
 */

/** api: (extends)
 *  plugins/WMSSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WMSCSource(config)
 *
 *    Plugin for using WMS-C layers with :class:`gxp.Viewer` instances. The
 *    plugin issues a GetCapabilities request to create a store of the WMS's
 *    layers. If tilesets are available, it will use them.
 */   
/** api: example
 *  Configuration in the  :class:`gxp.Viewer`:
 *
 *  .. code-block:: javascript
 *
 *    defaultSourceType: "gxp_wmscsource",
 *    sources: {
 *        "opengeo": {
 *            url: "http://suite.opengeo.org/geoserver/wms"
 *        }
 *    }
 *
 *  A typical configuration for a layer from this source (in the ``layers``
 *  array of the viewer's ``map`` config option would look like this:
 *
 *  .. code-block:: javascript
 *
 *    {
 *        source: "opengeo",
 *        name: "world",
 *        group: "background"
 *    }
 *
 */
gxp.plugins.WMSCSource = Ext.extend(gxp.plugins.WMSSource, {
    
    /** api: ptype = gxp_wmscsource */
    ptype: "gxp_wmscsource",
    
    /** api: config[version]
     *  ``String``
     *  Only WMS 1.1.1 is supported at the moment.
     */
    version: "1.1.1",

    /** private: method[constructor]
     */
    constructor: function(config) {
        config.baseParams = {
            SERVICE: "WMS",
            REQUEST: "GetCapabilities",
            TILED: true
        };
        gxp.plugins.WMSCSource.superclass.constructor.apply(this, arguments); 
        this.format = new OpenLayers.Format.WMSCapabilities({profile: 'WMSC'});
    },
    
    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        var record = gxp.plugins.WMSCSource.superclass.createLayerRecord.apply(this, arguments);
        if (!record) {
            return;
        }
        var caps;
        if (this.store.reader.raw) {
            caps = this.store.reader.raw.capability;
        }
        var tileSets = (caps && caps.vendorSpecific && caps.vendorSpecific) ? 
            caps.vendorSpecific.tileSets : null;
        var layer = record.get("layer");
        if (tileSets !== null) {
            var mapProjection = this.getMapProjection();
            // look for tileset with same name and equivalent projection
            for (var i=0, len=tileSets.length; i<len; i++) {
                var tileSet = tileSets[i];
                if (tileSet.layers === layer.params.LAYERS) {
                    var tileProjection;
                    for (var srs in tileSet.srs) {
                        tileProjection = new OpenLayers.Projection(srs);
                        break;
                    }
                    if (mapProjection.equals(tileProjection)) {
                        var bbox = tileSet.bbox[srs].bbox;
                        layer.projection = tileProjection;
                        layer.addOptions({
                            resolutions: tileSet.resolutions,
                            tileSize: new OpenLayers.Size(tileSet.width, tileSet.height),
                            tileOrigin: new OpenLayers.LonLat(bbox[0], bbox[1])
                        });
                        // unless explicitly configured otherwise, use cached version
                        layer.params.TILED = (config.cached !== false) && true;
                        break;
                    }
                }
            }
        } else if (this.forceLazy === true && config.cached === true) {
            // if lazy loading is forced, and the cached version is explicitly
            // requested, set TILED to true and assume that the tiling scheme
            // for the layer works with the map bounds and resolutions.
            layer.params.TILED = true;
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
        var config = gxp.plugins.WMSCSource.superclass.getConfigForRecord.apply(this, arguments);
        // the "tiled" property is already used to indicate singleTile
        // the "cached" property will indicate whether to send the TILED param
        return Ext.apply(config, {
            cached: !!record.getLayer().params.TILED
        });
    }
    
});

Ext.preg(gxp.plugins.WMSCSource.prototype.ptype, gxp.plugins.WMSCSource);
