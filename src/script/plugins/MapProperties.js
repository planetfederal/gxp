/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = MapProperties
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: MapProperties(config)
 *
 *    Plugin for showing the properties of the map.
 */
gxp.plugins.MapProperties = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_mapproperties */
    ptype: "gxp_mapproperties",

    /** api: config[menuText]
     *  ``String``
     *  Text for map properties menu item (i18n).
     */
    menuText: "Map Properties",

    /** api: config[toolTip]
     *  ``String``
     *  Text for map properties action tooltip (i18n).
     */
    toolTip: "Map Properties",

    addActions: function() {
        return gxp.plugins.MapProperties.superclass.addActions.apply(this, [{
            menuText: this.menuText,
            iconCls: "gxp-icon-mapproperties",
            tooltip: this.toolTip,
            handler: function() {
                this.removeOutput();
                this.addOutput();
            },
            scope: this
        }]);
    },

    addOutput: function() {
        return gxp.plugins.MapProperties.superclass.addOutput.call(this, {
            xtype: 'form',
            border: false,
            bodyStyle: "padding: 10px",
            items: [{
                xtype: 'checkbox',
                fieldLabel: "Wrap dateline",
                value: this.target.mapPanel.map.baseLayer.wrapDateLine,
                listeners: {
                    "check": function(cb, value) {
                        this.target.mapPanel.map.baseLayer.wrapDateLine = value;
                    },
                    scope: this
                }
            }]
        });
    }

});

Ext.preg(gxp.plugins.MapProperties.prototype.ptype, gxp.plugins.MapProperties);
