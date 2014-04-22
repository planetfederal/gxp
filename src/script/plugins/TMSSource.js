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
        // JvdB: Added abstract, was returned but not in record def+data.
        if(typeof recordType !== "function") {
            recordType = GeoExt.data.LayerRecord.create(
                recordType || meta.fields || [
                    {name: "name", type: "string"},
                    {name: "title", type: "string"},
                    {name: "abstract", type: "string"},
                    {name: "tileMapUrl", type: "string"},
                    {name: "group", type: "string"}
                ]);
        }
        gxp.data.TMSCapabilitiesReader.superclass.constructor.call(
            this, meta, recordType);
    },
    read: function(request) {
        var data = request.responseXML;
        if(!data || !data.documentElement) {
            data = request.responseText;
        }
        return this.readRecords(data);
    },
    readRecords: function(data) {
        var records = [], i, ii, url, proj;
        if (typeof data === "string" || data.nodeType) {
            data = this.meta.format.read(data);
            this.raw = data;
            // JvdB: Closure compiler chokes over 'abstract' (reserved keyword)
            var abstrct = data['abstract'];

            // a single tileMap, someone supplied a url to a TileMap
            if (!data.tileMaps) {
                if (data.tileSets) {
                    proj = new OpenLayers.Projection(data.srs);
                    if (this.meta.mapProjection.equals(proj)) {
                        var serverResolutions = [];
                        for (i=0, ii=data.tileSets.length; i<ii; ++i) {
                            serverResolutions.push(data.tileSets[i].unitsPerPixel);
                        }
                        url = this.meta.baseUrl;
                        var layerName = url.substring(
                            url.indexOf(this.meta.version) + this.meta.version.length + 1,
                            url.lastIndexOf('/'));
                        records.push(new this.recordType({
                            layer: new OpenLayers.Layer.TMS(
                                data.title,
                                data.tileMapService.replace("/" + this.meta.version, ""), {
                                    serverResolutions: serverResolutions,
                                    type: data.tileFormat.extension,
                                    layername: layerName,
                                    isBaseLayer: this.meta.isBaseLayer
                                }
                            ),
                            title: data.title,
                            name: data.title,
                            "abstract": abstrct,
                            tileMapUrl: this.meta.baseUrl,
                            scalePreviewImage: true,
                            group: this.meta.group
                        }));
                    }
                }
            } else {
                for (i=0, ii=data.tileMaps.length; i<ii; ++i) {
                    var tileMap = data.tileMaps[i];
                    proj = new OpenLayers.Projection(tileMap.srs);
                    if (this.meta.mapProjection.equals(proj)) {
                        url = tileMap.href;
                        var layername = url.substring(url.indexOf(this.meta.version + '/') + 6);
                        records.push(new this.recordType({
                            layer: new OpenLayers.Layer.TMS(
                                tileMap.title,
                                (this.meta.baseUrl.indexOf(this.meta.version) !== -1) ? this.meta.baseUrl.replace(this.meta.version + '/', '') : this.meta.baseUrl, {
                                    layername: layername,
                                    isBaseLayer: this.meta.isBaseLayer
                                }
                            ),
                            title: tileMap.title,
                            name: tileMap.title,
                            "abstract": abstrct,
                            tileMapUrl: url,
                            scalePreviewImage: true,
                            group: this.meta.group
                        }));
                    }
                }
            }
        }
        if (records.length == 0) {
            this.error = "No compatible layers found. Mismatched coordinate system.";
        }
        return {
            totalRecords: records.length,
            success: true,
            records: records
        };
    }
});

/** api: (define)
 *  module = gxp.plugins
 *  class = TMSSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */

/** api: constructor
 *  .. class:: TMSSource(config)
 *
 *    Plugin for using TMS layers with :class:`gxp.Viewer` instances. The
 *    plugin issues a Capabilities request to create a store of the TMS's
 *    tile maps. It is currently not supported to use this source type directly
 *    in the viewer config, it is only used to add a TMS service dynamically
 *    through the AddLayers plugin.
 */
gxp.plugins.TMSSource = Ext.extend(gxp.plugins.LayerSource, {

    /** api: ptype = gxp_tmssource */
    ptype: "gxp_tmssource",

    /** api: config[url]
     *  ``String`` TMS service URL for this source
     */

    /** api: config[version]
     *  ``String`` TMS version to use, defaults to 1.0.0
     */
    version: "1.0.0",

    /** api: config[defaultGroup]
     *  ``String``  layer group name if no "group" property present in initial config.
     */
    defaultGroup: "background",

    /** private: method[constructor]
     */
    constructor: function(config) {
        config.group = config.group ? config.group : this.defaultGroup;
        config.isBaseLayer = config.isBaseLayer === undefined ? true : config.isBaseLayer;
        gxp.plugins.TMSSource.superclass.constructor.apply(this, arguments);
        this.format = new OpenLayers.Format.TMSCapabilities();
        if (this.url.slice(-1) !== '/') {
            this.url = this.url + '/';
        }
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
                    this.title = this.store.reader.raw.title;
                    if (this.store.reader.error) {
                        this.fireEvent("failure", this, this.store.reader.error);
                        return;
                    }

                    this.fireEvent("ready", this);
                },
                exception: function() {
                    var msg = "Trouble creating TMS layer store from response.";
                    var details = "Unable to handle response.";
                    this.fireEvent("failure", this, msg, details);
                },
                scope: this
            },
            proxy: new Ext.data.HttpProxy({
                url: this.url.indexOf(this.version) === -1 ? this.url + this.version : this.url,
                disableCaching: false,
                method: "GET"
            }),
            reader: new gxp.data.TMSCapabilitiesReader({
                baseUrl: this.url,
                version: this.version,
                group: this.initialConfig.group,
                isBaseLayer: this.initialConfig.isBaseLayer,
                mapProjection: this.getMapProjection()
            })
        });
    },

    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord`` or null when the source is lazy.
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config, callback, scope) {
        var index = this.store.findExact("name", config.name);
        if (index > -1) {
            var record = this.store.getAt(index);
            var layer = record.getLayer();
            if (layer.serverResolutions !== null) {
                return record;
            } else {
                Ext.Ajax.request({
                    url: record.get('tileMapUrl'),
                    success: function(response) {
                        var serverResolutions = [];
                        var info = this.format.read(response.responseText);
                        for (var i=0, ii=info.tileSets.length; i<ii; ++i) {
                            serverResolutions.push(info.tileSets[i].unitsPerPixel);
                        }
                        layer.addOptions({
                            serverResolutions: serverResolutions,
                            type: info.tileFormat.extension
                        });
                        this.target.createLayerRecord({
                            source: this.id,
                            name: config.name,
                            scalePreviewImage: true
                        }, callback, scope);
                    },
                    scope: this
                });
            }
        }
    },

    /** api: method[getPreviewImageURL]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :arg width: :Number:image width
     *  :arg height: :Number:image height
     *  :returns: ``String``
     *
     *  Create a preview image URL or encoded image for given record.
     */
    getPreviewImageURL: function (record, width, height) {
        var layerURL = record.data.tileMapUrl;
        var tile = '/0/0/0.png';

        var url = layerURL + tile;
        return url;
    }

});

Ext.preg(gxp.plugins.TMSSource.prototype.ptype, gxp.plugins.TMSSource);
