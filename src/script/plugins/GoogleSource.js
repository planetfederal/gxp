/**
 * @require plugins/LayerSource.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.GoogleSource = Ext.extend(gxp.plugins.LayerSource, {
    
    //i18n
    apiKeyPrompt: "Please enter the Google API key for ",

    /** config: property[apiKey]
     *  ``String`` The API key required for adding the Google Maps script
     */
    
    /** api: property[store]
     *  ``GeoExt.data.LayerStore``
     */
    
    constructor: function(config) {
        this.config = config;
        gxp.plugins.GoogleSource.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[createStore]
     *  :arg callback: ``Function``  Called when the store is loaded.
     *
     *  Create a store of layers.  Calls the provided callback when the 
     *  store has loaded.
     */
    createStore: function(callback) {        
        if (gxp.plugins.GoogleSource.monitor.ready) {
            this.syncCreateStore(callback);
        } else {
            gxp.plugins.GoogleSource.monitor.on({
                ready: function() {
                    this.syncCreateStore(callback);
                },
                scope: this
            });
            if (!gxp.plugins.GoogleSource.monitor.loading) {
                this.loadScript(callback);
            }
        }
    },
    
    /** private: method[syncCreateStore]
     *  :arg callback: ``Function`` Called when the store is loaded.
     *
     *  Creates a store of layers.  This requires that the API script has already
     *  loaded.
     */
    syncCreateStore: function(callback) {
        var mapTypes = [G_NORMAL_MAP, G_SATELLITE_MAP, G_HYBRID_MAP, G_PHYSICAL_MAP];
        var len = mapTypes.length;
        var layers = new Array(len);
        var mapType;
        for(var i=0; i<len; ++i) {
            mapType = mapTypes[i];
            layers[i] = new OpenLayers.Layer.Google(
                "Google " + mapType.getName(), {
                    type: mapType,
                    sphericalMercator: true,
                    maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
                    restrictedExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34)
                }
            )
        }
        this.store = new GeoExt.data.LayerStore({
            layers: layers,
            fields: [
                {name: "source", type: "string"},
                {name: "name", type: "string"},
                {name: "abstract", type: "string"},
                {name: "group", type: "string"}
            ]
        });
        this.store.each(function(l) {
            l.set("group", "background");
            l.set("abstract", l.get("layer").type.getAlt());
        });
        callback();
    },
    
    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        var record;
        var cmp = function(l) {
            return l.get("layer").type == window[config.name];
        };
        // only return layer if app does not have it already
        if(this.target.mapPanel.layers.findBy(cmp) == -1) {
            record = this.store.getAt(this.store.findBy(cmp));
            var layer = record.get("layer");
            // set layer title from config
            if (config.title) {
                /**
                 * Because the layer title data is duplicated, we have
                 * to set it in both places.  After records have been
                 * added to the store, the store handles this
                 * synchronization.
                 */
                layer.setName(config.title);
                record.set("title", config.title);
            }
            // set visibility from config
            if ("visibility" in config) {
                layer.visibility = config.visibility
            }
            
            record.set("source", config.source);
            record.set("name", config.name);
            record.set("group", config.group);
            record.commit();
        };
        return record;
    },
    
    loadScript: function() {

        if(!this.initialConfig.apiKey && window.location.hostname !== "localhost") {
            Ext.Msg.prompt("Google API Key",
                this.apiKeyPrompt + window.location.hostname +
                    " <sup><a target='_blank' href='http://code.google.com/apis/maps/'>?</a></sup>",
                function(btn, key) {
                    if(btn === "ok") {
                        this.initialConfig.apiKey = key;
                        this.loadScript(callback);
                    } else {
                        return false;
                    }
                }, this
            );
            return;
        }
        
        var params = {
            key: this.initialConfig.apiKey,
            autoload: Ext.encode({
                modules: [{
                    name: "maps",
                    version: "2.X",
                    nocss: "true",
                    callback: "gxp.plugins.GoogleSource.monitor.onScriptLoad"
                }]
            })
        };
        
        var script = document.createElement("script");
        script.src = "http://www.google.com/jsapi?" + Ext.urlEncode(params);
        document.getElementsByTagName("head")[0].appendChild(script);

    }    
});

/**
 * Create a monitor singleton that all plugin instances can use.
 */
gxp.plugins.GoogleSource.monitor = new (Ext.extend(Ext.util.Observable, {

    /** private: property[ready]
     *  ``Boolean``
     *  This plugin type is ready to use.
     */
    ready: !!window.G_NORMAL_MAP,

    /** private: property[loading]
     *  ``Boolean``
     *  The resources for this plugin type are loading.
     */
    loading: false,
    
    constructor: function() {
        this.addEvents(
            /** private: event[ready]
             *  Fires when this plugin type is ready.
             */
             "ready"
        );
    },
    
    /** private: method[onScriptLoad]
     *  Called when all resources required by this plugin type have loaded.
     */
    onScriptLoad: function() {
        // the google loader calls this in the window scope
        var monitor = gxp.plugins.GoogleSource.monitor;
        if (!monitor.ready) {
            monitor.ready = true;
            monitor.loading = false;
            monitor.fireEvent("ready");
        }
    }

}))();

/** api: ptype = gx-wmssource */
Ext.preg("gx-googlesource", gxp.plugins.GoogleSource);
