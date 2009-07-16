/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

/**
 * @include data/AttributesReader.js
 */

/** api: (define)
 *  module = gxp.data
 *  class = WMSCapabilitiesStore
 *  base_link = `Ext.data.DataStore <http://extjs.com/deploy/dev/docs/?class=Ext.data.DataStore>`_
 */
Ext.namespace("gxp.data");

/**
 * Class: gxp.data.AttributesStore
 * Small helper class to make creating stores for remotely-loaded attributes
 *     data easier. AttributesStore is pre-configured with a built-in
 *     {Ext.data.HttpProxy} and {gxp.data.AttributesReader}.  The HttpProxy
 *     is configured to allow caching (disableCaching: false) and uses GET.
 *     If you require some other proxy/reader combination then you'll have to
 *     configure this with your own proxy or create a basic Ext.data.Store
 *     and configure as needed.
 *
 * Extends: Ext.data.Store
 */

/**
 * Constructor: gxp.data.AttributesStore
 * Create a new attributes store object.
 *
 * Parameters:
 * config - {Object} Store configuration.
 *
 * Configuration options:
 * format - {OpenLayers.Format} A parser for transforming the XHR response into
 *     an array of objects representing attributes.  Defaults to an
 *     {OpenLayers.Format.WFSDescribeFeatureType} parser.
 * fields - {Array | Function} Either an Array of field definition objects as
 *     passed to Ext.data.Record.create, or a Record constructor created using
 *     Ext.data.Record.create.  Defaults to ["name", "type"]. 
 */
gxp.data.AttributesStore = function(c) {
    gxp.data.AttributesStore.superclass.constructor.call(
        this,
        Ext.apply(c, {
            proxy: c.proxy || (!c.data ?
                new Ext.data.HttpProxy({url: c.url, disableCaching: false, method: "GET"}) :
                undefined
            ),
            reader: new gxp.data.AttributesReader(
                c, c.fields || ["name", "type"]
            )
        })
    );
};
Ext.extend(gxp.data.AttributesStore, Ext.data.Store);