/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

/**
 * @include data/WFSProtocolProxy.js
 */

/** api: (define)
 *  module = gxp.data
 *  class = WFSFeatureStore
 *  base_link = `Ext.data.Store <http://extjs.com/deploy/dev/docs/?class=Ext.data.Store>`_
 */
Ext.namespace("gxp.data");

gxp.data.WFSFeatureStore = Ext.extend(GeoExt.data.FeatureStore, {
    
    /** api: config[maxFeatures]
     *  ``Number``
     *  Optional limit for number of features requested in a read.  No limit
     *  set by default.
     */
    
    /** private */
    constructor: function(config) {
        if(!config.proxy) {
            config.proxy = new gxp.data.WFSProtocolProxy({
                srsName: config.srsName,
                url: config.url,
                featureType: config.featureType,
                featureNS:  config.featureNS,
                geometryName: config.geometryName,
                schema: config.schema,
                filter: config.ogcFilter,
                maxFeatures: config.maxFeatures
            });
        }
        if(!config.writer) {
            // a writer is not used, but is required by store.save
            config.writer = new Ext.data.DataWriter({
                write: Ext.emptyFn
            });
        }
        gxp.data.WFSFeatureStore.superclass.constructor.apply(this, arguments);
        
        /**
         * TODO: Determine what needs to be done to the feature reader to
         * properly fit the 3.0 DataReader inteface.
         *
         * For now, we implement a simple extractValues method that doesn't
         * change the record data.  I think the assumption here is that the
         * server might return something that we don't already have.
         * Certainly important for feature id, but that is handled elsewhere.
         */
        this.reader.extractValues = function(data, items, length) {
            return data;
        };
        
        /**
         * TODO: Determine how the reader.meta.idProperty should be set.
         * For now, setting this to fid forces all records to have their
         * id set to feature.fid in reader.realize.
         */
        this.reader.meta.idProperty = "fid";
        
        
    }
    
});
