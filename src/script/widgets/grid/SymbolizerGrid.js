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

    symbolType: null,

    /** private overrides */
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
        this.on('checkchange', this.onCheckChange, this);
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
        this.root.eachChild(function(n){
            var type = n.attributes.type,
                i, ii,
                result = [];
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
        for (var key in symbolizers) {
            if (symbolizers[key].length > 0) {
                for (i=symbolizers[key].length-1; i>=0; --i) {
                    var s;
                    if (key === "Point") {
                        // every subType should create its own symbolizer
                        var tmp = [];
                        for (s in symbolizers[key][i]) {
                            tmp.push(new OpenLayers.Symbolizer[key](symbolizers[key][i][s]));
                        }
                        result = result.concat(tmp.reverse());
                    } else {
                        var config = {};
                        for (s in symbolizers[key][i]) {
                            if (s !== "Label") {
                                config[s.toLowerCase()] = true;
                            }
                            config = Ext.applyIf(config, symbolizers[key][i][s]);
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
            OpenLayers.Util.removeItem(p.attributes.symbolizer, node.attributes.symbolizer);
        } else {
            var counter = 0;
            p.eachChild(function(c) {
                if (c.getUI().isChecked() === true) {
                    if (node === c) {
                        return false;
                    }
                    counter++;
                }
            });
            p.attributes.symbolizer.splice(counter, 0, node.attributes.symbolizer);
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

    createSwatches: function(rootNode) {
        rootNode.cascade(function(node) {
            if (node.attributes.rendererId) {
                var ct = Ext.get(node.attributes.rendererId);
                if (ct) {
                    node.attributes.featureRenderer = new GeoExt.FeatureRenderer({
                        labelText: "Ab",
                        symbolizers: Ext.isArray(node.attributes.symbolizer) ? node.attributes.symbolizer : [node.attributes.symbolizer],
                        symbolType: node.attributes.symbolType,
                        renderTo: ct,
                        width:21,
                        height: 21
                    });
                }
            }
        });
    }

});

/** api: xtype = gxp_symbolgrid */
gxp.grid.SymbolizerGrid && Ext.reg('gxp_symbolgrid', gxp.grid.SymbolizerGrid);
