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
gxp.grid.SymbolizerGrid = Ext.extend(Ext.ux.tree.TreeGrid, {

    /** api: config[symbolizers]
     *  ``Array`` Array of OpenLayers symbolizer objects which will be
     *  displayed by the grid.
     */
    symbolizers: null,

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
            symbolizers: symbolizers
        });
        this.columns = [{
            header: this.typeTitle,
            dataIndex: 'type',
            width: 200
        }, {
            header: this.previewTitle,
            width: 100,
            dataIndex: 'preview'
        }];
        gxp.grid.SymbolizerGrid.superclass.initComponent.call(this);
    },

    onCheckChange: function(node, checked) {
        var a = node.attributes;
        var r = a.featureRenderer;
        var type = a.type.toLowerCase();
        if (type !== "label") {
            // special handling for graphic, can only be turned on if label is on
            if (type === 'graphic') {
                var label = node.parentNode.findChild('type', 'Label');
                if (label !== null) {
                    var labelChecked = label.attributes.checked;
                    if ((labelChecked && checked) || !checked) {
                        node.parentNode.attributes.symbolizer[type] = a.symbolizer[type] = checked;
                    } else {
                        node.getUI().toggleCheck(false);
                    }
                }
            } else {
                node.parentNode.attributes.symbolizer[type] = a.symbolizer[type] = checked;
            }
        } else {
            if (!checked) {
                a.symbolizer[type] = node.parentNode.attributes.symbolizer[type] = "";
                var graphic = node.parentNode.findChild('type', 'Graphic');
                if (graphic !== null) {
                    graphic.getUI().toggleCheck(false);
                }
            } else {
                a.symbolizer[type] = node.parentNode.attributes.symbolizer[type] = "Ab";
            }
        }
        if (node.parentNode.attributes.featureRenderer) {
            node.parentNode.attributes.featureRenderer.update({
                symbolizers: [node.parentNode.attributes.symbolizer]
            });
        }
        r.update({symbolizers: [a.symbolizer]});
    },

    /** private: method[afterRender]
     *  Create the group swatches.
     */
    afterRender: function() {
        gxp.grid.SymbolizerGrid.superclass.afterRender.call(this);
        this.root.cascade(function(node) {
            if (node.attributes.rendererId) {
                var ct = Ext.get(node.attributes.rendererId);
                if (ct) {
                    node.attributes.featureRenderer = new GeoExt.FeatureRenderer({
                        symbolizers: [node.attributes.symbolizer],
                        renderTo: ct
                    });
                }
            }
        });
    }

});

/** api: xtype = gxp_symbolgrid */
Ext.reg('gxp_symbolgrid', gxp.grid.SymbolizerGrid);
