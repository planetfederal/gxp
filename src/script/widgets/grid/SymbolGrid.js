/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires data/SymbolReader.js
 * @requires widgets/grid/CheckColumn.js
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
     *  ``Array`` Array of OpenLayers symbolizer objects which will be
     *  displayed by the grid.
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
        this.enableColumnResize = false;
        this.store = new Ext.data.GroupingStore({
            reader: new gxp.data.SymbolReader(),
            data: this.symbolizers,
            groupField: "type",
            listeners: {
                update: this.onStoreUpdate,
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

    /** private: method[onStoreUpdate]
     *  When a record in the store gets updated, update the symbolizers and
     *  group swatch.
     *
     * :arg store: ``Ext.data.Store``
     * :arg r: ``Ext.data.Record``
     */
    onStoreUpdate: function(store, r) {
        var symbolizer = r.get('fullSymbolizer'),
            subSymbolizer = r.get('symbolizer'),
            subType = r.get('subType').toLowerCase(),
            type = r.get('type'),
            checked = r.get('checked');
        if (subType !== "label") {
            symbolizer[subType] = subSymbolizer[subType] = checked;
        } else {
            if (!checked) {
                symbolizer[subType] = subSymbolizer[subType] = "";
                var idx = store.findExact('subType', 'Graphic');
                idx != -1 && store.getAt(idx).set("checked", false);
            } else {
                symbolizer[subType] = subSymbolizer[subType] = "Ab";
            }
        }
        this.renderers[type].update({symbolizers: [symbolizer]});
    },

    /** private: method[onDestroy]
     *  Clean up.
     */
    onDestroy : function(){
        if (this.store) {
            this.store.un("update", this.onStoreUpdate, this);
        }
        for (var key in this.renderers) {
            this.renderers[key] && this.renderers[key].destroy();
        }
        gxp.grid.SymbolGrid.superclass.onDestroy.call(this);
    },

    /** private: method[afterRender]
     *  Create the group swatches.
     */
    afterRender: function() {
        gxp.grid.SymbolGrid.superclass.afterRender.call(this);
        this.store.each(function(record) {
            var type = record.get("type");
            var id = "symbolizer-"+type;
            var left = this.colModel.getColumnWidth(1) + this.colModel.getColumnWidth(2);
            Ext.get(id).setStyle('left', left + 'px'); 
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
