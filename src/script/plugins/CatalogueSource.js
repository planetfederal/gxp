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

    /** api: method[createStore]
     */
    createStore: function() {
        this.store = new Ext.data.Store({
            proxy: new GeoExt.data.ProtocolProxy({
                protocol: new OpenLayers.Protocol.CSW({
                    url: this.url
                })
            }),
            reader: new GeoExt.data.CSWRecordsReader({
               fields: ['title', 'subject', 'URI', 'bounds', 'projection']
            })
        });
        this.fireEvent("ready", this);
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
