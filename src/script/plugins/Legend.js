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
 *  class = Legend
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Legend(config)
 *
 *    Provides an action to display a legend in a new window.
 */
gxp.plugins.Legend = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_legend */
    ptype: "gxp_legend",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for legend menu item (i18n).
     */
    menuText: "Show Legend",

    /** api: config[tooltip]
     *  ``String``
     *  Text for legend action tooltip (i18n).
     */
    tooltip: "Show Legend",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Legend.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        var actions = [{
            menuText: this.menuText,
            iconCls: "gxp-icon-legend",
            tooltip: this.tooltip,
            handler: function() {
                this.addOutput({
                    autoScroll: true, 
                    width: 300, 
                    height: 400,
                    title: this.menuText, 
                    items: [{
                        xtype: 'gx_legendpanel',
                        ascending: false,
                        border: false,
                        layerStore: this.target.mapPanel.layers
                    }]
                });
            },
            scope: this
        }];
        return gxp.plugins.Legend.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.Legend.prototype.ptype, gxp.plugins.Legend);
