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
 *  class = LayerProperties
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: LayerProperties(config)
 *
 *    Plugin for showing the properties of a selected layer from the map.
 */
gxp.plugins.LayerProperties = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_layerproperties */
    ptype: "gxp_layerproperties",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for layer properties menu item (i18n).
     */
    menuText: "Layer Properties",

    /** api: config[toolTip]
     *  ``String``
     *  Text for layer properties action tooltip (i18n).
     */
    toolTip: "Layer Properties",
    
    /** api: method[addActions]
     */
    addActions: function() {
        var selectedLayer;
        var layerProperties;
        var actions = gxp.plugins.LayerProperties.superclass.addActions.apply(this, [{
            menuText: this.menuText,
            iconCls: "gxp-icon-layerproperties",
            disabled: true,
            tooltip: this.toolTip,
            handler: function() {
                var record = selectedLayer;
                if (record) {
                    var type = record.get("properties");
                    if (type) {
                        if (layerProperties && layerProperties.ownerCt) {
                            layerProperties.ownerCt instanceof Ext.Window ?
                                layerProperties.ownerCt.close() :
                                layerProperties.ownerCt.remove(layerProperties);
                                layerProperties.destroy();
                        }
                        var config = this.initialConfig.outputConfig || {};
                        this.outputConfig = Ext.apply({
                            title: this.menuText + ": " + record.get("title"),
                            width: 265,
                            autoHeight: !config.height,
                            layout: config.height ? "fit" : undefined,
                            items: [{
                                xtype: type,
                                autoHeight: !config.height,
                                layerRecord: record,
                                source: this.target.getSource(record),
                                defaults: {
                                    autoHeight: !config.height,
                                    style: "padding: 10px"
                                }
                            }]
                        }, config);
                        layerProperties = this.addOutput();
                    }
                }
            },
            scope: this
        }]);
        var layerPropertiesAction = actions[0];

        this.target.on("layerselectionchange", function(record) {
            selectedLayer = record;
            layerPropertiesAction.setDisabled(
                !record || !record.get("properties")
            );
        }, this);
        return actions;
    }
        
});

Ext.preg(gxp.plugins.LayerProperties.prototype.ptype, gxp.plugins.LayerProperties);
