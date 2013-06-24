/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/LayerSource.js
 * @requires OpenLayers/Layer/TMS.js
 * @requires OpenLayers/Format/TMSCapabilities.js
 */

Ext.ns('gxp.data', 'gxp.plugins');

gxp.data.TMSCapabilitiesReader = Ext.extend(Ext.data.DataReader, {
    constructor: function(meta, recordType) {
        meta = meta || {};
        if (!meta.format) {
            meta.format = new OpenLayers.Format.TMSCapabilities();
        }
        gxp.data.TMSCapabilitiesReader.superclass.constructor.call(
            this, meta, recordType
        );
    },
    read: function(request) {
        var data = request.responseXML;
        if(!data || !data.documentElement) {
            data = request.responseText;
        }
        return this.readRecords(data);
    },
    readRecords: function(data) {
        var records = [];
        if (typeof data === "string" || data.nodeType) {
            data = this.meta.format.read(data);
            for (var i=0, ii=data.tileMaps.length; i<ii; ++i) {
                var tileMap = data.tileMaps[i];
                // TODO compare with map projection, and use equals function on projection object
                if (tileMap.srs === "EPSG:900913" || tileMap.srs === "OSGEO:41001") {
                    var url = tileMap.href;
                    // TODO do not hard code TMS version ideally
                    var layername = url.substring(url.indexOf('1.0.0/')+6);
                    // TODO ideally type should be taken by resolving the tileMap.href
                    records.push(new GeoExt.data.LayerRecord({
                        // TODO zoomOffset, use serverResolutions from second request
                        layer: new OpenLayers.Layer.TMS(tileMap.title, this.meta.baseUrl, {zoomOffset: -1, layername: layername, type: 'png'}),
                        title: tileMap.title,
                        name: tileMap.title
                    }));
                }
            }
        }
        return {
            totalRecords: records.length,
            success: true,
            records: records
        };
    }
});

gxp.plugins.TMSSource = Ext.extend(gxp.plugins.LayerSource, {

    /** api: ptype = gxp_tmssource */
    ptype: "gxp_tmssource",

    /** api: config[url]
     *  ``String`` TMS service URL for this source
     */

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.TMSSource.superclass.constructor.apply(this, arguments);
        this.format = new OpenLayers.Format.TMSCapabilities();
    },

    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {
        var format = this.format;
        this.store = new Ext.data.Store({
            autoLoad: true,
            listeners: {
                load: function() {
                    this.fireEvent("ready", this);
                },
                scope: this
            },
            // TODO handle check for /
            proxy: new Ext.data.HttpProxy({url: this.url + this.version, disableCaching: false, method: "GET"}),
            reader: new gxp.data.TMSCapabilitiesReader({baseUrl: this.url})
        });
    },

    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord`` or null when the source is lazy.
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        var index = this.store.findExact("name", config.name);
        if (index > -1) {
            return this.store.getAt(index);
        }
    }

});

Ext.preg(gxp.plugins.TMSSource.prototype.ptype, gxp.plugins.TMSSource);
