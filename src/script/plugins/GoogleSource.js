/**
 * @require plugins/LayerSource.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.GoogleSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gx_googlesource */
    ptype: "gx_googlesource",
    
    //i18n
    apiKeyPrompt: "Please enter the Google API key for ",
    
    /** config: property[timeout]
     *  ``Number``
     *  The time (in milliseconds) to wait before giving up on the Google Maps
     *  script loading.  This layer source will not be availble if the script
     *  does not load within the given timeout.  Default is 7000 (seven seconds).
     */
    timeout: 7000,

    /** config: property[apiKey]
     *  ``String`` The API key required for adding the Google Maps script
     */
    
    /** api: property[store]
     *  ``GeoExt.data.LayerStore``
     */
    
    /** api: property[title]
     *  ``String``
     *  A descriptive title for this layer source.  Default is "Google Layers".
     */
    title: "Google Layers",

    constructor: function(config) {
        this.config = config;
        gxp.plugins.GoogleSource.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {        
        if (gxp.plugins.GoogleSource.monitor.ready) {
            this.syncCreateStore();
        } else {
            gxp.plugins.GoogleSource.monitor.on({
                ready: function() {
                    this.syncCreateStore();
                },
                scope: this
            });
            if (!gxp.plugins.GoogleSource.monitor.loading) {
                this.loadScript();
            }
        }
    },
    
    /** private: method[syncCreateStore]
     *
     *  Creates a store of layers.  This requires that the API script has already
     *  loaded.  Fires the "ready" event when the store is loaded.
     */
    syncCreateStore: function() {
        var mapTypeNames = ["G_NORMAL_MAP", "G_SATELLITE_MAP", "G_HYBRID_MAP", "G_PHYSICAL_MAP"];
        var len = mapTypeNames.length;
        var layers = new Array(len);
        var name, mapType;
        for(var i=0; i<len; ++i) {
            name = mapTypeNames[i];
            mapType = window[name];
            layers[i] = new OpenLayers.Layer.Google(
                "Google " + mapType.getName(), {
                    type: mapType,
                    typeName: name,
                    sphericalMercator: true,
                    maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
                    restrictedExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
                    projection: this.projection
                }
            )
        }
        this.store = new GeoExt.data.LayerStore({
            layers: layers,
            fields: [
                {name: "source", type: "string"},
                {name: "name", type: "string", mapping: "typeName"},
                {name: "abstract", type: "string"},
                {name: "group", type: "string", defaultValue: "background"},
                {name: "fixed", type: "boolean", defaultValue: true}
            ]
        });
        this.store.each(function(l) {
            l.set("abstract", l.get("layer").type.getAlt());
        });
        this.fireEvent("ready", this);
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
            return l.get("name") === config.name;
        };
        // only return layer if app does not have it already
        if(this.target.mapPanel.layers.findBy(cmp) == -1) {
            // records can be in only one store
            record = this.store.getAt(this.store.findBy(cmp)).clone();
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
            if ("group" in config) {
                record.set("group", config.group);
            }
            record.commit();
        };
        return record;
    },
    
    loadScript: function() {

        if(!this.initialConfig.apiKey && window.location.hostname !== "localhost") {
            var prompt = function() {
                Ext.Msg.prompt("Google API Key",
                    this.apiKeyPrompt + window.location.hostname +
                        " <sup><a target='_blank' href='http://code.google.com/apis/maps/'>?</a></sup>",
                    function(btn, key) {
                        if(btn === "ok") {
                            this.initialConfig.apiKey = key;
                            this.loadScript();
                        } else {
                            return false;
                        }
                    }, this
                );
            }
            if (Ext.isReady) {
                prompt.call(this);
            } else {
                Ext.onReady(prompt, this);
            }
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

        // cancel loading if monitor is not ready within timeout
        window.setTimeout(
            (function() {
                if (!gxp.plugins.GoogleSource.monitor.ready) {
                    this.abortScriptLoad(script);
                }
            }).createDelegate(this), 
            this.timeout
        );
        
        document.getElementsByTagName("head")[0].appendChild(script);

    },
    
    /** private: method[abortScriptLoad]
     *  :arg script: ``HTMLScriptElement``
     *
     *  Aborts the Google Maps script loading by removing the script from the 
     *  document.  Fires the "failure" event.  Called if the script does not 
     *  load within the timeout.
     */
    abortScriptLoad: function(script) {
        document.getElementsByTagName("head")[0].removeChild(script);
        delete this.store;
        this.fireEvent(
            "failure", 
            this,
            "The Google Maps script failed to load within the provided timeout (" + (this.timeout / 1000) + " s)."
        );
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

Ext.preg(gxp.plugins.GoogleSource.prototype.ptype, gxp.plugins.GoogleSource);
