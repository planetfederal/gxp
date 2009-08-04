/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.data
 *  class = WFSProtocolProxy
 *  base_link = `Ext.data.DataProxy <http://extjs.com/deploy/dev/docs/?class=Ext.data.DataProxy>`_
 */
Ext.namespace("gxp.data");

gxp.data.WFSProtocolProxy = Ext.extend(GeoExt.data.ProtocolProxy, {
    
    /** api: method[setFilter]
     *  :arg filter: ``OpenLayers.Filter`` Filter to be set on the WFS protocol.
     *  Does not trigger anything on the protocol (for now).
     */
    setFilter: function(filter) {
        this.protocol.filter = filter;
        // TODO: The protocol could use a setFilter method.
        this.protocol.options.filter = filter;
    },
    
    /** api: constructor
     *  .. class:: WFSProtocolProxy
     *      A data proxy for use with ``OpenLayers.Protocol.WFS`` objects.
     *      
     *      This is mainly to extend Ext 3.0 functionality to the
     *      GeoExt.data.ProtocolProxy.  This could be simplified by having
     *      the ProtocolProxy support writers (implement doRequest).
     */
    constructor: function(config) {

        Ext.applyIf(config, {

            /** api: config[version]
             *  ``String``
             *  WFS version.  Default is "1.1.0".
             */
            version: "1.1.0"

            /** api: config[maxFeatures]
             *  ``Number``
             *  Optional limit for number of features requested in a read.  No
             *  limit set by default.
             */

        });
        
        // create the protocol if none provided
        if(!this.protocol) {
            config.protocol = new OpenLayers.Protocol.WFS({
                version: config.version,
                srsName: config.srsName,
                url: config.url,
                featureType: config.featureType,
                featureNS :  config.featureNS,
                geometryName: config.geometryName,
                schema: config.schema,
                filter: config.filter,
                maxFeatures: config.maxFeatures
            });
        }

        gxp.data.WFSProtocolProxy.superclass.constructor.apply(this, arguments);
    },


    /** private: method[doRequest]
     *  :arg action: ``String`` The crud action type (create, read, update,
     *      destroy)
     *  :arg records: ``Array(Ext.data.Record)`` If action is load, records will
     *      be null
     *  :arg params: ``Object`` An object containing properties which are to be
     *      used as request parameters.
     *  :arg reader: ``Ext.data.DataReader`` The Reader object which converts
     *      the data object into a block of ``Ext.data.Record`` objects.
     *  :arg callback: ``Function``  A function to be called after the request.
     *      The callback is passed the following arguments: records, options,
     *      success.
     *  :arg scope: ``Object`` The scope in which to call the callback.
     *  :arg arg: ``Object`` An optional argument which is passed to the
     *      callback as its second parameter.
     */
    doRequest: function(action, records, params, reader, callback, scope, arg) {
        
        // remove the xaction param tagged on because we're using a single url
        // for all actions
        delete params.xaction;
        
        if (action === Ext.data.Api.actions.read) {
            this.load(params, reader, callback, scope, arg);
        } else {
            if(!(records instanceof Array)) {
                records = [records];
            }
            // get features from records
            var features = new Array(records.length);
            Ext.each(records, function(r, i) {
                features[i] = r.get("feature");
            }, this);

            
            var o = {
                action: action,
                records: records,
                callback: callback,
                scope: scope
            };

            this.protocol.commit(features, {
                callback: function(response) {
                    this.onProtocolCommit(response, o);
                },
                scope: this
            });
        }
        
    },
    
    
    /** private: method[onCommit]
     *  Callback for the protocol.commit method.  Called with an additional
     *  object containing references to arguments to the doRequest method.
     */
    onProtocolCommit: function(response, o) {        
        if(response.success()) {
            var features = response.reqFeatures;
            // deal with inserts, updates, and deletes
            var state, feature;
            var destroys = [];
            var insertIds = response.insertIds || [];
            var j = 0;
            for(var i=0, len=features.length; i<len; ++i) {
                feature = features[i];
                state = feature.state;
                /**
                 * TODO: Determine why state is null here.
                 */
                if(state) {
                    if(state == OpenLayers.State.DELETE) {
                        destroys.push(feature);
                    } else if(state == OpenLayers.State.INSERT) {
                        feature.fid = insertIds[j];
                        ++j;
                    }
                    feature.state = null;
                }
            }
            
            var feature;
            for(var i=0, len=destroys.length; i<len; ++i) {
                feature = destroys[i];
                feature.layer && feature.layer.destroyFeatures([feature]);
            }
            
            /**
             * TODO: Update the FeatureStore to work with callbacks from 3.0.
             * 
             * The callback here is the result of store.createCallback.  The
             * signature should be what is expected by the anonymous function
             * created in store.createCallback: (data, response, success).
             *
             * If the server returns data that is different than what we've
             * got, we need to implement extractValues on the FeatureReader.
             */
            var data = new Array(o.records.length);
            Ext.each(o.records, function(r, i) {
                data[i] = r.data;
            });
            o.callback.call(o.scope, data, response.priv, true);
        } else {
            // TODO: determine from response if exception was "response" or "remote"
            this.fireEvent("exception", this, "response", o.action, o, response);
            o.callback.call(o.scope, [], response.priv, false);
        }
        
    }

});