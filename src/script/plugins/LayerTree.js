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
 *  class = LayerTree
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: LayerTree(config)
 *
 *    Plugin for adding a tree of layers to a :class:`gxp.Viewer`
 */   
gxp.plugins.LayerTree = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_layertree */
    ptype: "gxp_layertree",

    /** api: config[rootNodeText]
     *  ``String``
     *  Text for root node of layer tree (i18n).
     */
    rootNodeText: "Layers",

    /** api: config[overlayNodeText]
     *  ``String``
     *  Text for overlay node of layer tree (i18n).
     */
    overlayNodeText: "Overlays",

    /** api: config[baseNodeText]
     *  ``String``
     *  Text for baselayer node of layer tree (i18n).
     */
    baseNodeText: "Base Layers",
    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {

        var target = this.target, me = this;
        var addListeners = function(node, record) {
            if (record) {
                target.on("layerselectionchange", function(rec) {
                    if (!me.selectionChanging && rec === record) {
                        node.select();
                    }
                });
                if (record === target.selectedLayer) {
                    node.on("rendernode", function() {
                        node.select();
                    });
                }
            }
        };
        
        // create our own layer node UI class, using the TreeNodeUIEventMixin
        var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI,
            new GeoExt.tree.TreeNodeUIEventMixin());
        
        var treeRoot = new Ext.tree.TreeNode({
            text: this.rootNodeText,
            expanded: true,
            isTarget: false,
            allowDrop: false
        });
        treeRoot.appendChild(new GeoExt.tree.LayerContainer({
            text: this.overlayText,
            iconCls: "gx-folder",
            expanded: true,
            loader: new GeoExt.tree.LayerLoader({
                store: this.target.mapPanel.layers,
                filter: function(record) {
                    return !record.get("group") &&
                        record.getLayer().displayInLayerSwitcher == true;
                },
                createNode: function(attr) {
                    attr.uiProvider = LayerNodeUI;
                    var layer = attr.layer;
                    var store = attr.layerStore;
                    if (layer && store) {
                        var record = store.getAt(store.findBy(function(r) {
                            return r.getLayer() === layer;
                        }));
                        if (record && !record.get("queryable")) {
                            attr.iconCls = "gx-tree-rasterlayer-icon";
                        }
                    }
                    var node = GeoExt.tree.LayerLoader.prototype.createNode.apply(this, [attr]);
                    addListeners(node, record);
                    return node;
                }
            }),
            singleClickExpand: true,
            allowDrag: false,
            listeners: {
                append: function(tree, node) {
                    node.expand();
                }
            }
        }));
        
        treeRoot.appendChild(new GeoExt.tree.LayerContainer({
            text: this.baseNodeText,
            iconCls: "gx-folder",
            expanded: true,
            group: "background",
            loader: new GeoExt.tree.LayerLoader({
                baseAttrs: {checkedGroup: "background"},
                store: this.target.mapPanel.layers,
                filter: function(record) {
                    return record.get("group") === "background" &&
                        record.getLayer().displayInLayerSwitcher == true;
                },
                createNode: function(attr) {
                    attr.uiProvider = LayerNodeUI;
                    var layer = attr.layer;
                    var store = attr.layerStore;
                    if (layer && store) {
                        var record = store.getAt(store.findBy(function(r) {
                            return r.getLayer() === layer;
                        }));
                        if (record) {
                            if (!record.get("queryable")) {
                                attr.iconCls = "gx-tree-rasterlayer-icon";
                            }
                            if (record.get("fixed")) {
                                attr.allowDrag = false;
                            }
                        }
                    }
                    var node = GeoExt.tree.LayerLoader.prototype.createNode.apply(this, arguments);
                    addListeners(node, record);
                    return node;
                }
            }),
            singleClickExpand: true,
            allowDrag: false,
            listeners: {
                append: function(tree, node) {
                    node.expand();
                }
            }
        }));
        
        config = Ext.apply({
            xtype: "treepanel",
            root: treeRoot,
            rootVisible: false,
            border: false,
            enableDD: true,
            selModel: new Ext.tree.DefaultSelectionModel({
                listeners: {
                    beforeselect: function(selModel, node) {
                        var changed = true;
                        var layer = node && node.layer;
                        if (layer) {
                            var store = node.layerStore;
                            var record = store.getAt(store.findBy(function(r) {
                                return r.getLayer() === layer;
                            }));
                            this.selectionChanging = true;
                            changed = this.target.selectLayer(record);
                            this.selectionChanging = false;
                        }
                        return changed;
                    },
                    scope: this
                }
            }),
            listeners: {
                contextmenu: function(node, e) {
                    if(node && node.layer) {
                        node.select();
                        var c = node.getOwnerTree().contextMenu;
                        c.contextNode = node;
                        c.items.getCount() > 0 && c.showAt(e.getXY());
                    }
                },
                beforemovenode: function(tree, node, oldParent, newParent, i) {
                    // change the group when moving to a new container
                    if(oldParent !== newParent) {
                        var store = newParent.loader.store;
                        var index = store.findBy(function(r) {
                            return r.getLayer() === node.layer;
                        });
                        var record = store.getAt(index);
                        record.set("group", newParent.attributes.group);
                    }
                },                
                scope: this
            },
            contextMenu: new Ext.menu.Menu({
                items: []
            })
        }, config || {});
        
        var layerTree = gxp.plugins.LayerTree.superclass.addOutput.call(this, config);
        
        return layerTree;
    }
        
});

Ext.preg(gxp.plugins.LayerTree.prototype.ptype, gxp.plugins.LayerTree);
