/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
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
        var caps = this.store.reader.raw.capability;
        var tileSets = (caps && caps.vendorSpecific && caps.vendorSpecific) ? 
            caps.vendorSpecific.tileSets : null;
        if (tileSets !== null) {
            for (var i=0, len=tileSets.length; i<len; i++) {
                var tileSet = tileSets[i];
                var layer = record.get("layer");
                var srs = null; 
                for (var key in tileSet.srs) {
                    srs = key;
                }
                if (tileSet.layers === layer.params.LAYERS && 
                    srs === this.getMapProjection().getCode()) {
                        var bbox = tileSet.bbox[srs].bbox;
                        layer.addOptions({resolutions: tileSet.resolutions,
                            tileSize: new OpenLayers.Size(tileSet.width, tileSet.height),
                            tileOrigin: new OpenLayers.LonLat(bbox[0], bbox[1])});
                        layer.params.TILED = true;
                        break;
                }
            }
        }
        return record;
    }
    
});

Ext.preg(gxp.plugins.WMSCSource.prototype.ptype, gxp.plugins.WMSCSource);
