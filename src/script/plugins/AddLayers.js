/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/NewSourceWindow.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = AddLayers
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: AddLayers(config)
 *
 *    Plugin for removing a selected layer from the map.
 *    TODO Make this plural - selected layers
 */
gxp.plugins.AddLayers = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addlayers */
    ptype: "gxp_addlayers",
    
    /** api: config[addMenuText]
     *  ``String``
     *  Text for add menu item (i18n).
     */
    addMenuText: "Add layers",

    /** api: config[addActionTip]
     *  ``String``
     *  Text for add action tooltip (i18n).
     */
    addActionTip: "Add layers",

    /** api: config[addServerText]
     *  ``String``
     *  Text for add server button (i18n).
     */
    addServerText: "Add a New Server",

    /** api: config[untitledText]
     *  ``String``
     *  Text for an untitled layer (i18n).
     */
    untitledText: "Untitled",

    /** api: config[addLayerSourceErrorText]
     *  ``String``
     *  Text for an error message when WMS GetCapabilities retrieval fails (i18n).
     */
    addLayerSourceErrorText: "Error getting WMS capabilities ({msg}).\nPlease check the url and try again.",

    /** api: config[availableLayersText]
     *  ``String``
     *  Text for the available layers (i18n).
     */
    availableLayersText: "Available Layers",

    /** api: config[doneText]
     *  ``String``
     *  Text for Done button (i18n).
     */
    doneText: "Done",
    
    /** api: method[addActions]
     */
    addActions: function() {
        var selectedLayer;
        var actions = gxp.plugins.AddLayers.superclass.addActions.apply(this, [{
            tooltip : this.addActionTip,
            disabled: true,
            iconCls: "gxp-icon-addlayers",
            handler : this.showCapabilitiesGrid,
            scope: this
        }]);
        
        this.target.on("ready", function() {actions[0].enable();});
        return actions;
    },
        
    /** private: method[showCapabilitiesGrid]
     * Shows the window with a capabilities grid.
     */
    showCapabilitiesGrid: function() {
        if(!this.capGrid) {
            this.initCapGrid();
        }
        this.capGrid.show();
    },

    /**
     * private: method[initCapGrid]
     * Constructs a window with a capabilities grid.
     */
    initCapGrid: function() {
        
        var source, data = [];        
        for (var id in this.target.layerSources) {
            source = this.target.layerSources[id];
            if (source.store) {
                data.push([id, source.title || id]);                
            }
        }
        var sources = new Ext.data.ArrayStore({
            fields: ["id", "title"],
            data: data
        });

        var expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template("<p><b>Abstract:</b> {abstract}</p>")
        });
        
        var addLayers = function() {
            var key = sourceComboBox.getValue();
            var layerStore = this.target.mapPanel.layers;
            var source = this.target.layerSources[key];
            var records = capGridPanel.getSelectionModel().getSelections();
            var record;
            for (var i=0, ii=records.length; i<ii; ++i) {
                record = source.createLayerRecord({
                    name: records[i].get("name"),
                    source: key
                });
                if (record) {
                    if (record.get("group") === "background") {
                        layerStore.insert(0, [record]);
                    } else {
                        layerStore.add([record]);
                    }
                }
            }
        };

        var capGridPanel = new Ext.grid.GridPanel({
            store: this.target.layerSources[data[0][0]].store,
            layout: "fit",
            region: "center",
            autoScroll: true,
            autoExpandColumn: "title",
            plugins: [expander],
            colModel: new Ext.grid.ColumnModel([
                expander,
                {id: "title", header: "Title", dataIndex: "title", sortable: true},
                {header: "Id", dataIndex: "name", width: 150, sortable: true}
            ]),
            listeners: {
                rowdblclick: addLayers,
                scope: this
            }
        });
        
        var sourceComboBox = new Ext.form.ComboBox({
            store: sources,
            valueField: "id",
            displayField: "title",
            triggerAction: "all",
            editable: false,
            allowBlank: false,
            forceSelection: true,
            mode: "local",
            value: data[0][0],
            listeners: {
                select: function(combo, record, index) {
                    var store = this.target.layerSources[record.get("id")].store;
                    capGridPanel.reconfigure(store, capGridPanel.getColumnModel());
                    // TODO: remove the following when this Ext issue is addressed
                    // http://www.extjs.com/forum/showthread.php?100345-GridPanel-reconfigure-should-refocus-view-to-correct-scroller-height&p=471843
                    capGridPanel.getView().focusRow(0);
                },
                scope: this
            }
        });
        
        var capGridToolbar = null;
        if (this.target.proxy || data.length > 1) {
            capGridToolbar = [
                new Ext.Toolbar.TextItem({
                    text: "View available data from:"
                }),
                sourceComboBox
            ];
        }
        
        if (this.target.proxy) {
            capGridToolbar.push("-", new Ext.Button({
                text: this.addServerText,
                iconCls: "gxp-icon-addserver",
                handler: function() {
                    newSourceWindow.show();
                }
            }));
        }
        
        var newSourceWindow = new gxp.NewSourceWindow({
            modal: true,
            listeners: {
                "server-added": function(url) {
                    newSourceWindow.setLoading();
                    this.target.addLayerSource({
                        config: {url: url}, // assumes default of gx_wmssource
                        callback: function(id) {
                            // add to combo and select
                            var record = new sources.recordType({
                                id: id,
                                title: this.target.layerSources[id].title || this.untitledText
                            });
                            sources.insert(0, [record]);
                            sourceComboBox.onSelect(record, 0);
                            newSourceWindow.hide();
                        },
                        fallback: function(source, msg) {
                            newSourceWindow.setError(
                                new Ext.Template(this.addLayerSourceErrorText).apply({msg: msg})
                            );
                        },
                        scope: this
                    });
                },
                scope: this
            }
        });

        this.capGrid = new Ext.Window({
            title: this.availableLayersText,
            closeAction: "hide",
            layout: "border",
            height: 300,
            width: 450,
            modal: true,
            items: [capGridPanel],
            tbar: capGridToolbar,
            bbar: [
                "->",
                new Ext.Button({
                    text: "Add Layers",
                    iconCls: "gxp-icon-addlayers",
                    handler: addLayers,
                    scope : this
                }),
                new Ext.Button({
                    text: this.doneText,
                    handler: function() {
                        this.capGrid.hide();
                    },
                    scope: this
                })
            ],
            listeners: {
                hide: function(win){
                    capGridPanel.getSelectionModel().clearSelections();
                }
            }
        });
 
    }

});

Ext.preg(gxp.plugins.AddLayers.prototype.ptype, gxp.plugins.AddLayers);
