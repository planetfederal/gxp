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

gxp.data.WFSProtocolProxy = function(config) {
    gxp.data.WFSProtocolProxy.superclass.constructor.call(this);
    Ext.apply(this, config);
    if(!this.protocol) {
        this.protocol = new OpenLayers.Protocol.WFS({
            version: this.version,
            srsName: this.srsName,
            url: this.url,
            featureType: this.featureType,
            featureNS :  this.featureNS,
            geometryName: this.geometryName,
            schema: this.schema,
            filter: this.filter
        });
    }
};

/** api: constructor
 *  .. class:: WFSProtocolProxy
 *      A data proxy for use with ``OpenLayers.Protocol.WFS`` objects.
 *      
 *      This is mainly to extend Ext 3.0 functionality to the
 *      GeoExt.data.ProtocolProxy and the class should probably be removed
 *      when GeoExt supports data writers.
 */
Ext.extend(gxp.data.WFSProtocolProxy, GeoExt.data.ProtocolProxy, {

    /** api: config[version]
     *  ``String`` WFS version.  Default is "1.1.0".
     */
    version: "1.1.0",

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
                scope: scope,
            };

            this.protocol.commit(features, {
                callback: this.commitResponse.createDelegate(this, [o], 0),
                scope: this
            });
        }
        
    },
    
    commitResponse: function(o, response) {
        
        if(response.success()) {
            if(o.callback) {
                o.callback.call(
                    o.scope
                ); // TODO: determine what args are needed here
            }
        } else {
            // TODO: determine from response if exception was "response" or "remote"
            this.fireEvent("exception", this, "response", o.action, o, response);
            o.callback.call(
                o.request.scope
            ); // TODO: determine what args are needed here
        }
        
    }
    


});