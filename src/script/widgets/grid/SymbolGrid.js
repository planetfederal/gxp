/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires data/SymbolReader.js
 * @requires OpenLayers/Symbolizer.js
 * @requires GeoExt/widgets/FeatureRenderer.js
 * @requires GeoExt/grid/SymbolizerColumn.js
 */

/** api: (define)
 *  module = gxp.grid
 *  class = SymbolGrid
 *  base_link = `Ext.grid.GridPanel <http://extjs.com/deploy/dev/docs/?class=Ext.grid.GridPanel>`_
 */
Ext.namespace("gxp.grid");

/** api: constructor
 *  .. class:: SymbolGrid(config)
 *
 *      Create a new grid displaying the symbolizers of a style and its subtypes.
 */
gxp.grid.SymbolGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: config[symbolizers]
     *  ``Array``
     */
    symbolizers: null,

    /** i18n */
    typeTitle: "Symbolizer Type",
    previewTitle: "Preview",

    /** api: method[initComponent]
     *  Initializes the SymbolGrid.
     */
    initComponent: function() {
        this.renderers = {};
        this.cls = "gxp-symbolgrid";
        this.enableHdMenu = false;
        this.store = new Ext.data.GroupingStore({
            reader: new gxp.data.SymbolReader(),
            data: this.symbolizers,
            groupField: "type",
            listeners: {
                update: function(store, r) {
                    var symbolizer = r.get('fullSymbolizer'),
                        subSymbolizer = r.get('symbolizer'),
                        subType = r.get('subType'),
                        type = r.get('type'),
                        checked = r.get('checked');
                    symbolizer[subType.toLowerCase()] = checked;
                    subSymbolizer[subType.toLowerCase()] = checked;
                    this.renderers[type].update({symbolizers: [symbolizer]});
                },
                scope: this
            }
        });
        this.view = new Ext.grid.GroupingView({
            showGroupName: false,
            forceFit:true,
            markDirty: false,
            groupTextTpl: '<span class="gxp-symbolgrid-feature gxp-symbolgrid-{[values.group.toLowerCase()]}"></span><span class="gxp-symbolgrid-title">{group}</span><span class="gxp-symbolgrid-symbolizer" id="symbolizer-{group}"></span>'
        });
        this.columns = [{
            id: 'group', 
            dataIndex: 'type', 
            hidden: true
        }, {
            id: 'checked', 
            header: "&nbsp;", 
            width: 20, 
            dataIndex: 'checked', 
            xtype: 'checkcolumn'
        }, {
            id:'type', 
            header: this.typeTitle, 
            width: 60, 
            dataIndex: 'subType'
        }, {
            id: 'preview',
            xtype: "gx_symbolizercolumn",
            header: this.previewTitle,
            width: 20
        }];
        this.deferRowRender = false;
        gxp.grid.SymbolGrid.superclass.initComponent.call(this);
    },

    afterRender: function() {
        gxp.grid.SymbolGrid.superclass.afterRender.call(this);
        this.store.each(function(record) {
            var type = record.get("type");
            var id = "symbolizer-"+type;
            if (!this.renderers[type]) {
                this.renderers[type] = new GeoExt.FeatureRenderer({
                    renderTo: id,
                    width: 20,
                    height: 20,
                    symbolType: record.get("type"),
                    symbolizers: [record.get("fullSymbolizer")]
                });
            }
        }, this);
    }

});

/** api: xtype = gxp_symbolgrid */
Ext.reg('gxp_symbolgrid', gxp.grid.SymbolGrid);
