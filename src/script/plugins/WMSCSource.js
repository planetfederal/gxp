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

    /** api: config[requiredProperties]
     *  ``Array(String)`` List of config properties that are required for each
     *  layer from this source to allow lazy loading. Default is
     *  ``["title", "bbox"]``. When the source loads layers from a WMS-C that
     *  does not use subsets of the default Web Mercator grid, not provide
     *  tiles for all default Web Mercator resolutions, and not use a tileSize
     *  of 256x256 pixels, ``tileOrigin``, ``resolutions`` and ``tileSize``
     *  should be included in this list.
     */

    /** private: method[constructor]
     */
    constructor: function(config) {
        config.baseParams = {
            SERVICE: "WMS",
            REQUEST: "GetCapabilities",
            TILED: true
        };
        if (!config.format) {
            this.format = new OpenLayers.Format.WMSCapabilities({
                keepData: true,
                profile: "WMSC"
            });
        }
        gxp.plugins.WMSCSource.superclass.constructor.apply(this, arguments); 
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
        var tileSets = (caps && caps.vendorSpecific) ? 
            caps.vendorSpecific.tileSets : null;
        var layer = record.get("layer");
        if (tileSets !== null) {
            var mapProjection = this.getProjection(record) || this.getMapProjection();
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
                        break;
                    }
                }
            }
        } else {
            // lazy loading
            var tileSize = record.get("tileSize"),
                tileOrigin = record.get("tileOrigin");
            layer.addOptions({
                resolutions: record.get("resolutions"),
                tileSize: tileSize ? new OpenLayers.Size(tileSize[0], tileSize[1]) : undefined,
                tileOrigin: tileOrigin ? OpenLayers.LonLat.fromArray(tileOrigin) : undefined
            });
            if (!tileOrigin) {
                // If tileOrigin was not set, our best bet is to use the map's
                // maxExtent, because GWC's tiling scheme always aligns to the
                // default Web Mercator grid. We don't do this with addOptions
                // because we persist the config from layer.options in
                // getConfigForRecord, and we don't want to persist a guessed
                // configuration.
                layer.tileOrigin = OpenLayers.LonLat.fromArray(this.target.map.maxExtent);
            }
        }
        // unless explicitly configured otherwise, use cached version
        layer.params.TILED = (config.cached !== false) && true;
        return record;
    },

    /** api: method[getConfigForRecord]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :returns: ``Object``
     *
     *  Create a config object that can be used to recreate the given record.
     */
    getConfigForRecord: function(record) {
        var layer = record.getLayer(),
            tileSize = layer.tileSize,
            tileOrigin = layer.options.tileOrigin;
        return Ext.applyIf(
            gxp.plugins.WMSCSource.superclass.getConfigForRecord.apply(this, arguments), {
                // the "tiled" property is already used to indicate singleTile
                // the "cached" property will indicate whether to send the TILED param
                cached: !!layer.params.TILED,
                tileSize: [tileSize.w, tileSize.h],
                tileOrigin: tileOrigin ? [tileOrigin.lon, tileOrigin.lat] : undefined,
                resolutions: layer.options.resolutions
            }
        );
    }
    
});

Ext.preg(gxp.plugins.WMSCSource.prototype.ptype, gxp.plugins.WMSCSource);
