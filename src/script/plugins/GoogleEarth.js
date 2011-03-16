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
 *    Google Earth view. This assumes that the map panel has been set
 *    up with a card layout.
 */
gxp.plugins.GoogleEarth = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_googleearth */
    ptype: "gxp_googleearth",

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
        this.loadScript();
    },

    loadScript: function() {

        if(!this.initialConfig.apiKey && window.location.hostname !== "localhost") {
            Ext.Msg.prompt("Google API Key",
                this.apiKeyPrompt + window.location.hostname +
                    " <sup><a target='_blank' href='http://code.google.com/apis/earth/'>?</a></sup>",
                function(btn, key) {
                    if(btn === "ok") {
                        this.initialConfig.apiKey = key;
                        this.loadScript();
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
                    name: "earth",
                    version: "1",
                    callback: "gxp.plugins.GoogleEarth.monitor.onScriptLoad"
                }]
            })
        };
        
        var script = document.createElement("script");
        script.src = "http://www.google.com/jsapi?" + Ext.urlEncode(params);
        document.getElementsByTagName("head")[0].appendChild(script);

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
        if (gxp.plugins.GoogleEarth.monitor.ready) {
            this.actions[0].enable();
        } else {
            gxp.plugins.GoogleEarth.monitor.on({
                ready: function() {
                    this.actions[0].enable();
                },
                scope: this
            });
            if (!gxp.plugins.GoogleEarth.monitor.loading) {
                this.loadScript();
            }
        }
        return result;
    }
        
});

/**
 * Create a monitor singleton that all plugin instances can use.
 */
gxp.plugins.GoogleEarth.monitor = new (Ext.extend(Ext.util.Observable, {

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
             "ready"
        );
    },
    
    /** private: method[onScriptLoad]
     *  Called when all resources required by this plugin type have loaded.
     */
    onScriptLoad: function() {
        // the google loader calls this in the window scope
        var monitor = gxp.plugins.GoogleEarth.monitor;
        if (!monitor.ready) {
            monitor.ready = true;
            monitor.loading = false;
            monitor.fireEvent("ready");
        }
    }

}))();

Ext.preg(gxp.plugins.GoogleEarth.prototype.ptype, gxp.plugins.GoogleEarth);
