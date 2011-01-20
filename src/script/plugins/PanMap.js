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
 *  class = PanMap
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: PanMap(config)
 *
 *    Provides one action for panning the map.
 */
gxp.plugins.PanMap = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_panmap */
    ptype: "gxp_panmap",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for pan menu item (i18n).
     */
    menuText: "Pan Map",

    /** api: config[tooltip]
     *  ``String``
     *  Text for pan action tooltip (i18n).
     */
    tooltip: "Pan Map",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.PanMap.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        var actions = [new GeoExt.Action({
            tooltip: this.tooltip,
            menuText: this.menuText,
            iconCls: "gxp-icon-pan",
            enableToggle: true,
            pressed: true,
            allowDepress: false,
            control: new OpenLayers.Control.Navigation({zoomWheelEnabled: false}),
            map: this.target.mapPanel.map,
            toggleGroup: this.toggleGroup})];
        return gxp.plugins.PanMap.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.PanMap.prototype.ptype, gxp.plugins.PanMap);
