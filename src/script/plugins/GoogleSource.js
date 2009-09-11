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
     *  :arg scriptLoading: ``Boolean`` True if we are loading the script
     *      already.
     *
     *  Create a store of layers.  Calls the provided callback when the 
     *  store has loaded.
     */
    createStore: function(callback, scriptLoading) {
        if(!window.G_NORMAL_MAP) {
            if(scriptLoading !== true) {
                if(!this.initialConfig.apiKey &&
                                window.location.hostname !== "localhost") {
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
                } else {
                    this.loadScript();
                }
            }
            window.setTimeout(this.createStore.createDelegate(this, [callback, true]), 50);
            return;
        }

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
            if(config.visibility) {
                layer.visibility = config.visibility
            }
            
            record.set("group", config.group);
            record.commit();
        };
        return record;
    },
    
    loadScript: function() {
        // The initial google script uses document.write to add additional
        // scripts. When we load the google script after the document is
        // loaded, the document will be overwritten. So we have to replace
        // document.write temporarily with a function that loads our script
        // into the DOM instead.
        var _write = document.write;
        document.write = function(html){
            if(html.substring(1, 7) == "script") {
                gxp.util.loadScript(/src=\"(.[^\"]*)\"/.exec(html)[1]);
            } else {
                _write(html);
            }
        }
        gxp.util.loadScript(
            "http://maps.google.com/maps?file=api&amp;v=2&amp;key=" +
            this.initialConfig.apiKey, function() {
                // restore the original document.write function right after
                // the initial google script is loaded.
                document.write = _write;
            }, null, {charset: "UTF-8"}
        );
    }    
});

/** api: ptype = gx-wmssource */
Ext.preg("gx-googlesource", gxp.plugins.GoogleSource);
