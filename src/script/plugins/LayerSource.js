Ext.namespace("gxp.plugins");

gxp.plugins.LayerSource = Ext.extend(Ext.util.Observable, {
    
    /** private: property[target]
     *  ``Object``
     *  The object that this plugin is plugged into.
     */
     
    /** api: config[id]
     *  ``String``
     *  Identifier for this source.
     */
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;
        Ext.apply(this, config);
        
        this.addEvents(
            /** api: event[ready]
             *  Fires when the layer source is ready for action.
             */
             "ready"
        );
        gxp.plugins.LayerSource.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     *
     *  Calls :method:`createStore` with a callback that fires the 'ready' event.
     */
    init: function(target) {
        this.target = target;
        var callback = function() {
            this.fireEvent("ready", this);
        }
        this.createStore(callback.createDelegate(this));
    },
    
    /** api: method[createStore]
     *  :arg config: ``Object``
     *
     *  Creates a store of layer records.
     */
    createStore: function(callback) {
        callback();
    },

    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
    }

    
});
