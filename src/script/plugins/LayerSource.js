Ext.namespace("gxp.plugins");

gxp.plugins.LayerSource = Ext.extend(Ext.util.Observable, {
    
    /** private: property[target]
     *  ``Object``
     *  The object that this plugin is plugged into.
     */
     
    /** api: property[title]
     *  ``String``
     *  A descriptive title for this layer source.
     */
    title: "",
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;
        Ext.apply(this, config);
        
        this.addEvents(
            /** api: event[ready]
             *  Fires when the layer source is ready for action.
             */
            "ready",
            /** api: event[failure]
             *  Fires if the layer source fails to load.
             */
            "failure"
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
        var fallback = function(msg, details) {
            this.fireEvent("failure", msg, details);
        }
        // TODO: have subclasses fire these events
        this.createStore(callback.createDelegate(this), fallback.createDelegate(this));
    },
    
    /** api: method[createStore]
     *  :arg callback: ``Function`` Called when store is loaded.
     *  :arg fallback: ``Function`` Called if store loading or creation fails.
     *
     *  Creates a store of layer records.
     */
    createStore: function(callback, fallback) {
        callback();
    },

    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
    },

    /** api: method[getConfigForRecord]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :returns: ``Object``
     *
     *  Create a config object that can be used to recreate the given record.
     */
    getConfigForRecord: function(record) {
        var layer = record.get("layer");
        return {
            source: record.get("source"),
            name: record.get("name"),
            title: record.get("title"),
            visibility: layer.getVisibility(),
            opacity: layer.opacity || undefined,
            group: record.get("group")
        };
    }
    

    
});
