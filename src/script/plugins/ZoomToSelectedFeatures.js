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
 *  class = ZoomToSelectedFeatures
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ZoomToSelectedFeatures(config)
 *
 *    Plugin for zooming to the extent of selected features
 */
gxp.plugins.ZoomToSelectedFeatures = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_zoomtoselectedfeatures */
    ptype: "gxp_zoomtoselectedfeatures",
    
    /** api: config[zoomMenuText]
     *  ``String``
     *  Text for zoom menu item (i18n).
     */
    zoomMenuText: "Zoom to selected features",

    /** api: config[zoomActionTip]
     *  ``String``
     *  Text for zoom action tooltip (i18n).
     */
    zoomActionTip: "Zoom to selected features",
    
    /** api: config[featureManager]
     *  ``String`` id of the :class:`gxp.plugins.FeatureManager` to look for
     *  selected features
     */
    
    /** api: method[addActions]
     */
    addActions: function() {
        var layer = this.target.tools[this.featureManager].featureLayer;
        
        var actions = gxp.plugins.ZoomToSelectedFeatures.superclass.addActions.apply(this, [{
            menuText: this.zoomMenuText,
            disabled: true,
            tooltip: this.zoomActionTip,
            iconCls: "gxp-icon-zoom-to",
            disabled: true,
            handler: function(btn) {
                var bounds, geom, extent, features = layer.selectedFeatures;
                for (var i=features.length-1; i>=0; --i) {
                    geom = features[i].geometry;
                    if (geom) {
                        extent = geom.getBounds();
                        if (bounds) {
                            bounds.extend(extent);
                        } else {
                            bounds = extent.clone();
                        }
                    }
                };
                if(bounds) {
                    this.target.mapPanel.map.zoomToExtent(bounds);
                }
            },
            scope: this                
        }]);

        layer.events.on({
            "featureselected": function() {
                actions[0].isDisabled() && actions[0].enable();
            },
            "featureunselected": function(evt) {
                layer.features.length == 0 && actions[0].disable();
            }
        });
        
        return actions;
    }
        
});

Ext.preg(gxp.plugins.ZoomToSelectedFeatures.prototype.ptype, gxp.plugins.ZoomToSelectedFeatures);
