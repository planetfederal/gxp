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

    /** private: method[afterRender]
     *  Create the group swatches.
     */
    afterRender: function() {
        gxp.grid.SymbolizerGrid.superclass.afterRender.call(this);
        this.root.cascade(function(node) {
            if (node.attributes.rendererId) {
                var ct = Ext.get(node.attributes.rendererId);
                if (ct) {
                    new GeoExt.FeatureRenderer({
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
