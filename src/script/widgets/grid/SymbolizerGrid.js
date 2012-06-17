/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires widgets/tree/SymbolizerLoader.js
 * @requires GeoExt/widgets/FeatureRenderer.js
 */

/** api: (define)
 *  module = gxp.grid
 *  class = SymbolizerGrid
 */
Ext.namespace("gxp.grid");

/** api: constructor
 *  .. class:: SymbolizerGrid(config)
 *
 *      Create a new grid displaying the symbolizers of a style and its subtypes.
 */
gxp.grid.SymbolizerGrid = Ext.ux && Ext.ux.tree && Ext.ux.tree.TreeGrid && Ext.extend(Ext.ux.tree.TreeGrid, {

    /** api: config[symbolizers]
     *  ``Array`` Array of OpenLayers symbolizer objects which will be
     *  displayed by the grid.
     */
    symbolizers: null,

    /** api: config[swatchSize]
     *  ``Array`` Width and height of the swatches / feature renderers. 
     *  Defaults to 21 pixels.
     */
    swatchSize: [21, 21],

    /** api: config[symbolType]
     *  ``String`` Main symbol type to use, e.g. Point or Polygon.
     */
    symbolType: null,

    /** private overrides */
    enableDD: true,
    enableHdMenu: false,
    enableSort: false,
    useArrows: false,
    columnResize: false,
    cls: "gxp-symbolgrid",

    /** i18n */
    typeTitle: "Symbolizer Type",
    previewTitle: "Preview",

    /** api: method[initComponent]
     *  Initializes the SymbolizerGrid.
     */
    initComponent: function() {
        this.dropConfig = Ext.apply(this.dropConfig || {}, {
            isValidDropPoint : function(n, pt, dd, e, data){
                return (pt !== 'append') && (n.node.parentNode === data.node.parentNode);
            }
        });
        this.on('checkchange', this.onCheckChange, this);
        this.on('movenode', this.onMoveNode, this);
        this.loader = new gxp.tree.SymbolizerLoader({
            symbolizers: this.symbolizers,
            symbolType: this.symbolType,
            listeners: {
                'nodeadded': function(loader, node) {
                    this.createSwatches(node);
                },
                scope: this
            }
        });
        this.columns = [{
            header: this.typeTitle,
            dataIndex: 'text',
            width: 200
        }, {
            header: this.previewTitle,
            width: 100,
            dataIndex: 'preview'
        }];
        this.addEvents(
            /**
             * Event: change
             * Fires when the filter changes.
             *
             * Listener arguments:
             * grid - {gxp.grid.SymbolizerGrid} This symbolizer grid.  Call
             *     ``getSymbolizers`` to get the updated state.
             */
            "change"
        );
        gxp.grid.SymbolizerGrid.superclass.initComponent.call(this);
    },

    /** api: method[getSymbolizers]
     *  :returns: ``Array`` Array of symbolizers.
     *
     *  Get the current state of the symbolizers array. Symbolizers who don't
     *  have any visible children will be filtered out.
     */
    getSymbolizers: function() {
        var symbolizers = {};
        var keys = [];
        this.root.eachChild(function(n){
            var type = n.attributes.type,
                i, ii, j,
                result = [];
            keys.push(type);
            n.eachChild(function(c) {
                if (c.getUI().isChecked() === true) {
                    var subType = c.attributes.type;
                    var emptyFound = false, obj;
                    for (i=0, ii=result.length; i<ii; ++i) {
                        obj = result[i];
                        if (obj[subType] === undefined) {
                            obj[subType] = c.attributes.symbolizer;
                            emptyFound = true;
                            break;
                        }
                    }
                    if (emptyFound === false) {
                        obj = {};
                        obj[subType] = c.attributes.symbolizer;
                        result.push(obj);
                    }
                }
            });
            symbolizers[type] = result;
        });
        var result = [];
        for (i=keys.length-1; i>=0; --i) {
            var key = keys[i];
            if (symbolizers[key].length > 0) {
                for (j=symbolizers[key].length-1; j>=0; --j) {
                    var s;
                    if (key === "Point") {
                        // every subType should create its own symbolizer
                        var tmp = [];
                        for (s in symbolizers[key][j]) {
                            tmp.push(new OpenLayers.Symbolizer[key](symbolizers[key][j][s]));
                        }
                        result = result.concat(tmp.reverse());
                    } else {
                        var config = {};
                        for (s in symbolizers[key][j]) {
                            if (s !== "Label") {
                                config[s.toLowerCase()] = true;
                            }
                            config = Ext.applyIf(config, symbolizers[key][j][s]);
                        }
                        result.push(new OpenLayers.Symbolizer[key](config));
                    }
                }
            }
        }
        return result;
    },

    /** private: method[beforeDestroy]
     *  Clean up.
     */
    beforeDestroy : function(){
        this.root.cascade(function(node) {
            if (node.attributes.featureRenderer) {
                node.attributes.featureRenderer.destroy();
                node.attributes.featureRenderer = null;
            }
        });
        gxp.grid.SymbolizerGrid.superclass.onDestroy.call(this);
    },

    /** api: method[updateSwatch]
     *  :arg node: ``Ext.data.Node``
     *  :arg newSymbolizer: ``Object``
     */
    updateSwatch: function(node, newSymbolizer) {
        node.attributes.featureRenderer.drawFeature();
        if (node.parentNode.attributes.featureRenderer) {
            node.parentNode.attributes.featureRenderer.drawFeature();
        } else {
            node.cascade(function(c) {
                c.attributes.featureRenderer.drawFeature();
            });
        }
        if (newSymbolizer) {
            this.fireEvent("change", this);
        }
    },

    /** private: method[getNodeIndex]
     *  :arg node: ``Ext.data.Node``
     *  :returns: ``Integer`` The index
     *
     *  Get the index of the node in the tree, ignore unchecked nodes.
     */
    getNodeIndex: function(node) {
        var p = node.parentNode;
        var idx = 0;
        p.eachChild(function(c) {
            if (c.getUI().isChecked() === true) {
                if (node === c) {
                    return false;
                }
                idx++;
            }
        });
        return idx;
    },

    /** private: method[onMoveNode]
     *
     *  Handle the movenode event for drag and drop. Update the symbolizers
     *  and their swatches.
     */
    onMoveNode: function(tree, node, oldParent, newParent, index) {
        var p = node.parentNode;
        if (p !== this.getRootNode()) {
            OpenLayers.Util.removeItem(p.attributes.symbolizer, node.attributes.symbolizer);
            // we cannot use index directly since it takes into account unchecked nodes
            var idx = this.getNodeIndex(node);
            p.attributes.symbolizer.splice(idx, 0, node.attributes.symbolizer);
            this.updateSwatch(node);
        }
        this.fireEvent("change", this);
    },

    /** private: method[onCheckChange]
     *  :arg node: ``Ext.data.Node``
     *  :arg checked: ``Boolean``
     *
     *  Handle the check change event. Update the symbolizers and their
     *  swatches.
     */
    onCheckChange: function(node, checked) {
        var p = node.parentNode;
        if (checked === false) {
            node.attributes.featureRenderer.hide();
            OpenLayers.Util.removeItem(p.attributes.symbolizer, node.attributes.symbolizer);
        } else {
            node.attributes.featureRenderer.show();
            var idx = this.getNodeIndex(node);
            p.attributes.symbolizer.splice(idx, 0, node.attributes.symbolizer);
        }
        this.updateSwatch(node);
        this.fireEvent("change", this);
    },

    /** private: method[afterRender]
     *  Create the swatches.
     */
    afterRender: function() {
        gxp.grid.SymbolizerGrid.superclass.afterRender.call(this);
        this.createSwatches(this.root);
    },

    /** private: method[createSwatches]
     *  :arg pNode: ``Ext.data.Node``
     *
     *  Create the FeatureRenderer instances on a node and all its subnodes.
     */
    createSwatches: function(pNode) {
        pNode.cascade(function(node) {
            var attr = node.attributes;
            if (attr.rendererId) {
                var ct = Ext.get(attr.rendererId);
                if (ct) {
                    attr.featureRenderer = new GeoExt.FeatureRenderer({
                        labelText: "Ab",
                        hidden: !node.getUI().isChecked(),
                        symbolizers: Ext.isArray(attr.symbolizer) ? attr.symbolizer : [attr.symbolizer],
                        symbolType: attr.symbolType,
                        renderTo: ct,
                        width: this.swatchSize[0],
                        height: this.swatchSize[1]
                    });
                }
            }
        }, this);
    }

});

/** api: xtype = gxp_symbolgrid */
gxp.grid.SymbolizerGrid && Ext.reg('gxp_symbolgrid', gxp.grid.SymbolizerGrid);
