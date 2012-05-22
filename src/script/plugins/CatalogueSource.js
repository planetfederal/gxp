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
 *  class = CatalogueSource
 */

/** api: (extends)
 *  plugins/WMSSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: CatalogueSource(config)
 *
 *    Plugin for creating WMS layers lazily. The difference with the WMSSource
 *    is that the url is configured on the layer not on the source. This means
 *    that this source can create WMS layers for any url. This is particularly
 *    useful when working against a Catalogue Service, such as a OGC:CS-W.
 */
gxp.plugins.CatalogueSource = Ext.extend(gxp.plugins.WMSSource, {

    /** api: ptype = gxp_cataloguesource */
    ptype: "gxp_cataloguesource",

    /** api: config[type]
     *  ``Integer`` Type of search back-end to use.
     *  One of gxp.plugins.CatalogueSource.CSW or
     *  gxp.plugins.CatalogueSource.GEONODE. Defaults to CSW.
     */
    type: null,

    /** api: config[url]
     *  ``String`` CS-W service URL for this source
     */
    url: null,

    /** api: config[title]
     *  ``String`` Optional title for this source.
     */
    title: null,

    /** private: property[lazy]
     *  ``Boolean`` This source always operates lazy so without GetCapabilities
     */
    lazy: true,

    /** private: method[constructor]
     */
    constructor: function(config) {
        if (!config.type) {
            config.type = gxp.plugins.CatalogueSource.CSW;
        }
        gxp.plugins.CatalogueSource.superclass.constructor.apply(this, arguments);
    },

    /** api: method[createStore]
     *  Create the store that will be used for the CS-W searches.
     */
    createStore: function() {
        if (this.type === gxp.plugins.CatalogueSource.CSW) {
            this.store = new Ext.data.Store({
                proxy: new GeoExt.data.ProtocolProxy({
                    setParamsAsOptions: true,
                    protocol: new OpenLayers.Protocol.CSW({
                        url: this.url
                    })
                }),
                reader: new GeoExt.data.CSWRecordsReader({
                    fields: ['title', 'abstract', 'URI', 'bounds', 'projection', 'references']
                })
            });
        } else if (this.type === gxp.plugins.CatalogueSource.GEONODE) {
            this.store = new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({
                    url: this.url, 
                    method: 'GET'
                }),
                baseParams: {
                    type: 'layer'
                },
                reader: new Ext.data.JsonReader({
                    root: 'results'
                }, [
                    {name: "title", convert: function(v) {
                        return [v];
                    }},
                    {name: "abstract", mapping: "description"},
                    {name: "bounds", mapping: "bbox", convert: function(v) {
                        return {
                            left: v.minx,
                            right: v.maxx,
                            bottom: v.miny,
                            top: v.maxy
                        };
                    }},
                    {name: "URI", mapping: "download_links", convert: function(v) {
                        var result = [];
                        for (var i=0,ii=v.length;i<ii;++i) {
                            result.push(v[i][3]);
                        }
                        return result;
                    }}
                ])
            });
        }
        this.fireEvent("ready", this);
    },

    /** api: method[describeLayer]
     *  :arg rec: ``GeoExt.data.LayerRecord`` the layer to issue a WMS
     *      DescribeLayer request for
     *  :arg callback: ``Function`` Callback function. Will be called with
     *      an ``Ext.data.Record`` from a ``GeoExt.data.DescribeLayerStore``
     *      as first argument, or false if the WMS does not support
     *      DescribeLayer.
     *  :arg scope: ``Object`` Optional scope for the callback.
     *
     *  Get a DescribeLayer response from this source's WMS.
     */
    describeLayer: function(rec, callback, scope) {
        // it makes no sense to keep a describeLayerStore since
        // everything is lazy and layers can come from different WMSs.
        var recordType = Ext.data.Record.create(
            [
                {name: "owsType", type: "string"},
                {name: "owsURL", type: "string"},
                {name: "typeName", type: "string"}
            ]
        );
        var record = new recordType({
            owsType: "WFS",
            owsURL: rec.get('url'),
            typeName: rec.get('name')
        });
        callback.call(scope, record);
    },

    /** private: method[destroy]
     */
    destroy: function() {
        this.store && this.store.destroy();
        this.store = null;
        gxp.plugins.CatalogueSource.superclass.destroy.apply(this, arguments);
    },

    /** api: method[getPagingParamNames]
     *  :return: ``Object`` with keys start and limit.
     *
     *  Get the names of the parameters to use for paging.
     */
    getPagingParamNames: function() {
        var result;
        switch (this.type) {
            case gxp.plugins.CatalogueSource.CSW:
                result = {
                    start: 'startPosition',
                    limit: 'maxRecords'
                };
                break;
            case gxp.plugins.CatalogueSource.GEONODE:
                result = {
                    start: 'startIndex',
                    limit: 'limit'
                };
                break;
            default:
                break;
        }
        return result;
    }

});

gxp.plugins.CatalogueSource.CSW = 0;
gxp.plugins.CatalogueSource.GEONODE = 1;

Ext.preg(gxp.plugins.CatalogueSource.prototype.ptype, gxp.plugins.CatalogueSource);
