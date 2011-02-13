/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/WMSStylesDialog.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = Styler
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Styler(config)
 *
 *    Plugin providing a styles editing dialog for geoserver layers.
 */
gxp.plugins.Styler = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_styler */
    ptype: "gxp_styler",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for layer properties menu item (i18n).
     */
    menuText: "Edit Styles",

    /** api: config[tooltip]
     *  ``String``
     *  Text for layer properties action tooltip (i18n).
     */
    tooltip: "Manage layer styles",
    
    /** api: config[sameOriginStyling]
     *  ``Boolean``
     *  Only allow editing of styles for layers whose sources have a URL that
     *  matches the origin of this applicaiton.  It is strongly discouraged to 
     *  do styling through commonly used proxies as all authorization headers
     *  and cookies are shared with all remote sources.  Default is ``true``.
     */
    sameOriginStyling: true,
    
    constructor: function(config) {
        gxp.plugins.Styler.superclass.constructor.apply(this, arguments);
        
        if (!this.outputConfig) {
            this.outputConfig = {
                autoHeight: true,
                width: 265
            };
        }
        Ext.applyIf(this.outputConfig, {
            closeAction: "close"
        });
    },
    
    /** api: method[addActions]
     */
    addActions: function() {
        var layerProperties;
        var actions = gxp.plugins.Styler.superclass.addActions.apply(this, [{
            menuText: this.menuText,
            iconCls: "gxp-icon-palette",
            disabled: true,
            tooltip: this.tooltip,
            handler: function() {
                this.addOutput();
            },
            scope: this
        }]);

        this.target.on("layerselectionchange", function(record) {
            this.target.getSource(record).describeLayer(record, function(rec) {
                if (rec && rec.get("owsType") == "WFS") {
                    var editableStyles = false;
                    if (record && record.get("styles")) {
                        var source = this.target.layerSources[record.get("source")];
                        var url = source.url.split(
                            "?").shift().replace(/\/(wms|ows)\/?$/, "/rest");
                        if (this.sameOriginStyling) {
                            // this could be made more robust
                            // for now, only style for sources with relative url
                            editableStyles = url.charAt(0) === "/";
                        } else {
                            editableStyles = true;
                        }
                    }
                    if (editableStyles) {
                        Ext.Ajax.request({
                            method: "PUT",
                            url: url + "/styles",
                            callback: function(options, success, response) {
                                // we expect a 405 error code here if we are dealing
                                // with GeoServer and have write access.
                                actions[0].setDisabled(response.status != 405);                        
                            }
                        });
                    } else {
                        actions[0].disable();
                    }
                }
            }, this);
        }, this);
        
        return actions;
    },
    
    addOutput: function(config) {
        config = config || {};
        var record = this.target.selectedLayer;

        var origCfg = this.initialConfig.outputConfig || {};
        this.outputConfig.title = origCfg.title ||
            this.menuText + ": " + record.get("title");

        Ext.apply(config, gxp.WMSStylesDialog.createGeoServerStylerConfig(record));
        Ext.applyIf(config, {style: "padding: 10px"});
        
        var output = gxp.plugins.Styler.superclass.addOutput.call(this, config);
        output.stylesStore.on("load", function() {
            this.outputTarget || output.ownerCt.ownerCt.center();
        });
    }
        
});

Ext.preg(gxp.plugins.Styler.prototype.ptype, gxp.plugins.Styler);