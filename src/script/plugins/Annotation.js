/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires menu/AnnotationMenu.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = Annotation
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Annotation(config)
 *
 *    Plugin for creating annotations.
 */
gxp.plugins.Annotation = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_annotation */
    ptype: "gxp_annotation",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for menu item (i18n).
     */
    menuText: "Notes",

    /** private: property[layer]
     *  ``String`` featureType to use for saving the annotations.
     */
    layer: null,

    /** api: config[createLayerUrl]
     *  ``String`` Endpoint to use for layer creation.
     */
    createLayerUrl: "/data/create_layer",

    /** api: config[params]
     *  ``Object`` Parameters to send to the layer creation endpoint.
     */
    params: null,

    /** api: method[addActions]
     */
    addActions: function() {
        var actions = gxp.plugins.Annotation.superclass.addActions.apply(this, [{
            text: this.menuText,
            iconCls: "gxp-icon-note",
            menu: new gxp.menu.AnnotationMenu({plugin: this})
        }]);
        return actions;
    },

    /** api: method[createLayer]
     *  Creates a layer using the layer creation endpoint.
     */
    createLayer: function() {
        if (this.layer === null) {
            Ext.Ajax.request({
                method: "POST",
                url: this.createLayerUrl,
                params: this.params,
                success: function() { /* TODO once endpoint works */ },
                scope: this
            });
        }
    }
        
});

Ext.preg(gxp.plugins.Annotation.prototype.ptype, gxp.plugins.Annotation);
