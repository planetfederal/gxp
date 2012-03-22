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

    /** api: method[createStore]
     *  Create the store that will be used for the CS-W searches.
     */
    createStore: function() {
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
    }

});

Ext.preg(gxp.plugins.CatalogueSource.prototype.ptype, gxp.plugins.CatalogueSource);
