Ext.namespace("gxp.plugins");

gxp.plugins.LayerSource = function() {};

gxp.plugins.LayerSource.prototype = {
    
    /** api: property[type]
     *  ``String``
     *  An identifying string for this service type.  Must be provided by 
     *  subclasses.
     */
    
    /** api: method[init]
     *  :arg app: :class:`gxp.Viewer`
     *
     *  Registers the service type with the application.
     */
    init: function(app) {
        return this;
    },
    
    /** api: method[createStore]
     *  :arg config: ``Object``
     *
     *  Creates a store of layer records.
     */
    createStore: function(config) {
    }
    
};
