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
    initComponent: function(){
        this.cls = "gxp-symbolgrid";
        this.enableHdMenu = false;
        this.store = new Ext.data.GroupingStore({
            reader: new gxp.data.SymbolReader(),
            data: this.symbolizers,
            groupField: "type"
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
            header: this.previewTitle,
            width: 20, 
            renderer: this.renderFeature
        }];
        this.deferRowRender = false;
        gxp.grid.SymbolGrid.superclass.initComponent.call(this);
    },

    afterRender: function() {
        gxp.grid.SymbolGrid.superclass.afterRender.call(this);
        var ids = [];
        this.store.each(function(record) {
            var type = record.get("type");
            var id = "symbolizer-"+type;
            if (ids.indexOf(id) === -1) {
                var renderer = new GeoExt.FeatureRenderer({
                    renderTo: id,
                    width: 20,
                    height: 20,
                    symbolType: record.get("type"),
                    symbolizers: [record.get("symbolizer")]
                });
                this.store.on({update: function(store, r) {
                    if (r.get('type') === record.get('type')) {
                        var subType = r.get('subType');
                        var symbolizer = record.get('symbolizer');
                        var checked = r.get('checked');
                        symbolizer[subType.toLowerCase()] = checked;
                        renderer.update({symbolizers: [symbolizer]});
                    }
                }, scope: this});
            }
            ids.push(id);
        }, this);
    },

    /** private: method[renderFeature]
     */
    renderFeature: function(value, p, r) {
        var id = Ext.id();
        (function() {
            var symbolizer = r.get("symbolizer");
            var type = r.get("type");
            var subType = r.get("subType");
            var constructor = OpenLayers.Symbolizer[type];
            var s = new constructor(symbolizer);
            if (subType === "Stroke") {
                s.fill = false;
            }
            if (subType === "Fill") {
                s.stroke = false;
            }
            var renderer = new GeoExt.FeatureRenderer({
                renderTo: id,
                width: 20,
                height: 20,
                symbolType: r.get("type"),
                symbolizers: [s]
            });
        }).defer(25);
        return (String.format('<div id="{0}"></div>', id));
    }

});

/** api: xtype = gxp_symbolgrid */
Ext.reg('gxp_symbolgrid', gxp.grid.SymbolGrid);
