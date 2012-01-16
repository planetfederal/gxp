/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/LayerSource.js
 * @requires plugins/WMSSource.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = CatalogueSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
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
gxp.plugins.CatalogueSource = Ext.extend(gxp.plugins.LayerSource, {

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
        this.store.destroy();
        this.store = null;
        gxp.plugins.CatalogueSource.superclass.destroy.apply(this, arguments);
    },


    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        return gxp.plugins.WMSSource.prototype.createLazyLayerRecord(config);
    }

});

Ext.preg(gxp.plugins.CatalogueSource.prototype.ptype, gxp.plugins.CatalogueSource);
