/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @require plugins/LayerTree.js
 * @require GeoExt/plugins/TreeNodeComponent.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = LayerManager
 */

/** api: (extends)
 *  plugins/LayerTree.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: LayerManager(config)
 *
 *    Plugin for adding a tree of layers with their legend to a
 *    :class:`gxp.Viewer`. Also provides a context menu on layer nodes.
 */   
gxp.plugins.LayerManager = Ext.extend(gxp.plugins.LayerTree, {
    
    /** api: ptype = gxp_layermanager */
    ptype: "gxp_layermanager",

    /** api: config[baseNodeText]
     *  ``String``
     *  Text for baselayer node of layer tree (i18n).
     */
    baseNodeText: "Base Maps",
    
    /** api: config[groups]
     *  ``Object`` The groups to show in the layer tree. Keys are group names,
     *  and values are either group titles or an object with ``title`` and
     *  ``exclusive`` properties. ``exclusive`` means that nodes will have
     *  radio buttons instead of checkboxes, so only one layer of the group can
     *  be active at a time. Optional, the default is
     *
     *  .. code-block:: javascript
     *
     *      groups: {
     *          "default": "Overlays", // title can be overridden with overlayNodeText
     *          "background": {
     *              title: "Base Maps", // can be overridden with baseNodeText
     *              exclusive: true
     *          }
     *      }
     */
    
    /** private: method[createOutputConfig] */
    createOutputConfig: function() {
        var tree = gxp.plugins.LayerManager.superclass.createOutputConfig.apply(this, arguments);
        Ext.applyIf(tree, Ext.apply({
            cls: "gxp-layermanager-tree",
            lines: false,
            useArrows: true,
            plugins: [{
                ptype: "gx_treenodecomponent"
            }]
        }, this.treeConfig));
        
        return tree;        
    },
    
    /** private: method[configureLayerNode] */
    configureLayerNode: function(loader, attr) {
        gxp.plugins.LayerManager.superclass.configureLayerNode.apply(this, arguments);
        // add a WMS legend to each node created
        if (attr.layer instanceof OpenLayers.Layer.WMS) {
            attr.expanded = true;
            attr.allowDrop = false;
            attr.children = [{
                nodeType: "node",
                cls: "legendnode",
                uiProvider: Ext.extend(
                    Ext.tree.TreeNodeUI,
                    new GeoExt.tree.TreeNodeUIEventMixin()
                ),
                component: {
                    xtype: "gx_wmslegend",
                    // TODO these baseParams were only tested with GeoServer,
                    // so maybe they should be configurable.
                    baseParams: {
                        format: "image/png",
                        legend_options: "fontAntiAliasing:true;fontSize:11;fontName:Arial"
                    },
                    layerRecord: this.target.mapPanel.layers.getByLayer(attr.layer),
                    showTitle: false,
                    // custom class for css positioning
                    // see tree-legend.html
                    cls: "legend"
                },
                listeners: {
                    beforeclick: function() {
                        this.parentNode.select();
                        return false;
                    }
                }
            }];
        }
    }
    
});

Ext.preg(gxp.plugins.LayerManager.prototype.ptype, gxp.plugins.LayerManager);
