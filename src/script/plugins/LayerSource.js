Ext.namespace("gxp.plugins");

gxp.plugins.LayerSource = Ext.extend(Ext.util.Observable, {
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = Ext.apply({}, config);
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
     *  :arg app: :class:`gxp.Viewer`
     *
     *  Calls :method:`createStore` with a callback that fires the 'ready' event.
     */
    init: function(app) {
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
    }
    
});
