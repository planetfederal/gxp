/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GoogleEarth
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GoogleEarth(config)
 *
 *    Provides an action for switching between normal map view and 
 *    Google Earth view.
 */
/** api: example
 *  This tool can only be used if ``portalItems`` of :class:`gxp.Viewer` is set up 
 *  in the following way (or similar, the requirement is to have a panel with a card
 *  layout which has 2 items: the map and the Google Earth panel):
 *
 *  .. code-block:: javascript
 *      portalItems: [{
 *          region: "center",
 *          layout: "border",
 *          border: false,
 *           items: [{
 *               xtype: "panel", 
 *               id: "panel", 
 *               tbar: [], 
 *               layout: "card", 
 *               region: "center", 
 *               activeItem: 0, 
 *               items: [
 *               "map", {
 *                   xtype: 'gxp_googleearthpanel', 
 *                   mapPanel: "map"
 *               }
 *           ]
 *      } 
 *
 * Then make sure the tools go into the tbar of the panel, instead of the
 * "map.tbar" which is the default, an example is:
 *
 *  .. code-block:: javascript
 *    tools: [
 *        {
 *            actionTarget: "panel.tbar",
 *            ptype: "gxp_googleearth",
 *            apiKey: 'ABQIAAAAeDjUod8ItM9dBg5_lz0esxTnme5EwnLVtEDGnh-lFVzRJhbdQhQBX5VH8Rb3adNACjSR5kaCLQuBmw'
 *        }
 *    ] 
 */
gxp.plugins.GoogleEarth = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_googleearth */
    ptype: "gxp_googleearth",

    /** config: config[timeout]
     *  ``Number``
     *  The time (in milliseconds) to wait before giving up on the Google API
     *  script loading.  This layer source will not be availble if the script
     *  does not load within the given timeout.  Default is 7000 (seven seconds).
     */
    timeout: 7000,

    /** config: property[apiKey]
     *  ``String`` The API key required for adding the Google Maps script
     */

    //i18n
    apiKeyPrompt: "Please enter the Google API key for ",
    menuText: "3D Viewer",
    tooltip: "Switch to 3D Viewer",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.GoogleEarth.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        var actions = [{
            menuText: this.menuText,
            disabled: true,
            enableToggle: true,
            iconCls: "gxp-icon-googleearth",
            tooltip: this.tooltip,
            toggleHandler: function(button, state) {
                var layout = (this.target.mapPanel.ownerCt && this.target.mapPanel.ownerCt.getLayout());
                if (layout && layout instanceof Ext.layout.CardLayout) {
                    if (state === true) {
                        layout.setActiveItem(1);
                        button.enable();
                    } else {
                        layout.setActiveItem(0);
                    }
                }
            },
            scope: this
        }];
        var result = gxp.plugins.GoogleEarth.superclass.addActions.apply(this, [actions]);

        // get API key before loading
        this.getAPIKey(function(key) {
            this.initialConfig.apiKey = key;
            gxp.plugins.GoogleEarth.loader.onLoad({
                apiKey: this.initialConfig.apiKey,
                callback: function() {
                    this.actions[0].enable();
                },
                // TODO: add errback
                scope: this
            });
        });

        return result;
    },
    
    /** private: method[keyAPIKey]
     *  :arg callback: ``Function`` To be called with API key.
     */
    getAPIKey: function(callback) {
        
        var self = this;
        if (this.initialConfig.apiKey) {
            window.setTimeout(function() {
                callback.call(self, self.initialConfig.apiKey);
            }, 0);
        } else {
            Ext.Msg.prompt("Google API Key",
                this.apiKeyPrompt + window.location.hostname +
                    " <sup><a target='_blank' href='http://code.google.com/apis/earth/'>?</a></sup>",
                function(btn, key) {
                    if (btn === "ok") {
                        callback.call(this, key);
                    }
                }, this
            );
        }
        
    }

});


/**
 * Create a loader singleton that all plugin instances can use.
 */
gxp.plugins.GoogleEarth.loader = new (Ext.extend(Ext.util.Observable, {

    /** private: property[ready]
     *  ``Boolean``
     *  This plugin type is ready to use.
     */
    ready: !!(window.google && window.google.earth),

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
             "ready",

             /** private: event[failure]
              *  Fires when script loading fails.
              */
              "failure"
        );
        return Ext.util.Observable.prototype.constructor.apply(this, arguments);
    },
    
    /** private: method[onScriptLoad]
     *  Called when all resources required by this plugin type have loaded.
     */
    onScriptLoad: function() {
        // the google loader calls this in the window scope
        var monitor = gxp.plugins.GoogleEarth.loader;
        if (!monitor.ready) {
            monitor.ready = true;
            monitor.loading = false;
            monitor.fireEvent("ready");
        }
    },
    
    /** api: method[gxp.plugins.GoogleEarth.loader.onLoad]
     *  :arg options: ``Object``
     *
     *  Options:
     *
     *  * apiKey - ``String`` API key for Google Earth plugin.
     *  * callback - ``Function`` Called when script loads.
     *  * errback - ``Function`` Called if loading fails.
     *  * timeout - ``Number`` Time to wait before deciding that loading failed
     *      (in milliseconds).
     *  * scope - ``Object`` The ``this`` object for callbacks.
     */
    onLoad: function(options) {
        if (this.ready) {
            // call this in the next turn for consistent return before callback
            window.setTimeout(function() {
                options.callback.call(options.scope);                
            }, 0);
        } else if (!this.loading) {
            this.loadScript(options);
        } else {
            this.on({
                ready: options.callback,
                failure: options.errback || Ext.emptyFn,
                scope: options.scope
            });
        }
    },

    /** private: method[onScriptLoad]
     *  Called when all resources required by this plugin type have loaded.
     */
    loadScript: function(options) {
        
        // remove any previous loader to ensure that the key is applied
        if (window.google) {
            delete google.loader;
        }

        var params = {
            key: options.apiKey,
            autoload: Ext.encode({
                modules: [{
                    name: "earth",
                    version: "1",
                    callback: "gxp.plugins.GoogleEarth.loader.onScriptLoad"
                }]
            })
        };
        
        var script = document.createElement("script");
        script.src = "http://www.google.com/jsapi?" + Ext.urlEncode(params);

        // cancel loading if monitor is not ready within timeout
        var errback = options.errback || Ext.emptyFn;
        var timeout = options.timeout || gxp.plugins.GoogleSource.prototype.timeout;
        window.setTimeout((function() {
            if (!gxp.plugins.GoogleEarth.loader.ready) {
                this.loading = false;
                this.ready = false;
                document.getElementsByTagName("head")[0].removeChild(script);
                errback.call(options.scope);
                this.fireEvent("failure");
                this.purgeListeners();
            }
        }).createDelegate(this), timeout);
        
        // register callback for ready
        this.on({
            ready: options.callback,
            scope: options.scope
        });

        this.loading = true;
        document.getElementsByTagName("head")[0].appendChild(script);

    }

}))();

Ext.preg(gxp.plugins.GoogleEarth.prototype.ptype, gxp.plugins.GoogleEarth);
