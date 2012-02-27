/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
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
    
    /** api: config[addActionMenuText]
     *  ``String``
     *  Text for add menu item (i18n).
     */
    addActionMenuText: "Add layers",

    /** api: config[findActionMenuText]
     *  ``String``
     *  Text for find menu item (i18n).
     */
    findActionMenuText: "Find layers",

    /** api: config[addActionTip]
     *  ``String``
     *  Text for add action tooltip (i18n).
     */
    addActionTip: "Add layers",
    
    /** api: config[addActionText]
     *  ``String``
     *  Text for the Add action. None by default.
     */
   
    /** api: config[addServerText]
     *  ``String``
     *  Text for add server button (i18n).
     */
    addServerText: "Add a New Server",

    /** api: config[addButtonText]
     *  ``String``
     *  Text for add layers button (i18n).
     */
    addButtonText: "Add layers",
    
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

    /** api: config[availableLayersText]
     *  ``String``
     *  Text for the grid expander (i18n).
     */
    expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>",
    
    /** api: config[availableLayersText]
     *  ``String``
     *  Text for the layer title (i18n).
     */
    panelTitleText: "Title",

    /** api: config[availableLayersText]
     *  ``String``
     *  Text for the layer selection (i18n).
     */
    layerSelectionText: "View available data from:",
    
    /** api: config[instructionsText]
     *  ``String``
     *  Text for additional instructions at the bottom of the grid (i18n).
     *  None by default.
     */
    
    /** api: config[doneText]
     *  ``String``
     *  Text for Done button (i18n).
     */
    doneText: "Done",

    /** api: config[search]
     *  ``Object | Boolean``
     *  If provided, a :class:`gxp.CatalogueSearchPanel` will be added as a
     *  menu option. This panel will be constructed using the provided config.
     *  By default, no search functionality is provided.
     */

    /** api: config[upload]
     *  ``Object | Boolean``
     *  If provided, a :class:`gxp.LayerUploadPanel` will be made accessible
     *  from a button on the Available Layers dialog.  This panel will be 
     *  constructed using the provided config.  By default, no upload 
     *  functionality is provided.
     */
    
    /** api: config[uploadText]
     *  ``String``
     *  Text for upload button (only renders if ``upload`` is provided).
     */
    uploadText: "Upload Data",

    /** api: config[nonUploadSources]
     *  ``Array``
     *  If ``upload`` is enabled, the upload button will not be displayed for 
     *  sources whose identifiers or URLs are in the provided array.  By 
     *  default, the upload button will make an effort to be shown for all 
     *  sources with a url property.
     */

    /** api: config[relativeUploadOnly]
     *  ``Boolean``
     *  If ``upload`` is enabled, only show the button for sources with relative
     *  URLs (e.g. "/geoserver").  Default is ``true``.
     */
    relativeUploadOnly: true,

    /** api: config[startSourceId]
     * ``Integer``
     * The identifier of the source that we should start with.
     */
    startSourceId: null,
    
    /** private: property[selectedSource]
     *  :class:`gxp.plugins.LayerSource`
     *  The currently selected layer source.
     */
    selectedSource: null,

    /** private: method[constructor]
     */
    constructor: function(config) {
        this.addEvents(
            /** api: event[sourceselected]
             *  Fired when a new source is selected.
             *
             *  Listener arguments:
             *
             *  * tool - :class:`gxp.plugins.AddLayers` This tool.
             *  * source - :class:`gxp.plugins.LayerSource` The selected source.
             */
            "sourceselected"
        );
        gxp.plugins.AddLayers.superclass.constructor.apply(this, arguments);        
    },
    
    /** api: method[addActions]
     */
    addActions: function() {
        var commonOptions = {
            tooltip : this.addActionTip,
            text: this.addActionText,
            menuText: this.addActionMenuText,
            disabled: true,
            iconCls: "gxp-icon-addlayers"
        };
        var options;
        if (this.initialConfig.search) {
            options = Ext.apply(commonOptions, {
                menu: new Ext.menu.Menu({
                    items: [
                        new Ext.menu.Item({
                            iconCls: 'gxp-icon-addlayers', 
                            text: this.addActionMenuText, 
                            handler: this.showCapabilitiesGrid, 
                            scope: this
                        }),
                        new Ext.menu.Item({
                            iconCls: 'gxp-icon-addlayers', 
                            text: this.findActionMenuText,
                            handler: this.showCatalogueSearch,
                            scope: this
                        })
                    ]
                })
            });
        } else {
            options = Ext.apply(commonOptions, {
                handler : this.showCapabilitiesGrid,
                scope: this
            });
        }
        var actions = gxp.plugins.AddLayers.superclass.addActions.apply(this, [options]);
        
        this.target.on("ready", function() {actions[0].enable();});
        return actions;
    },

    /** api: method[showCatalogueSearch]
     * Shows the window with a search panel.
     */
    showCatalogueSearch: function() {
        var selectedSource = this.initialConfig.search.selectedSource;
        var sources = {};
        for (var key in this.target.layerSources) {
            var source = this.target.layerSources[key];
            if (source instanceof gxp.plugins.CatalogueSource) {
                var obj = {};
                obj[key] = source;
                Ext.apply(sources, obj);
            }
        }
        var output = gxp.plugins.AddLayers.superclass.addOutput.apply(this, [{
            sources: sources,
            selectedSource: selectedSource,
            xtype: 'gxp_cataloguesearchpanel',
            map: this.target.mapPanel.map,
            listeners: {
                'addlayer': function(cmp, sourceKey, layerConfig) {
                    var source = this.target.layerSources[sourceKey];
                    var record = source.createLayerRecord(layerConfig);
                    this.target.mapPanel.layers.add(record);
                },
                scope: this
            }
        }]);
        var popup = output.findParentByType('window');
        popup && popup.center();
        return output;
    },
        
    /** api: method[showCapabilitiesGrid]
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
        var source, data = [], target = this.target;        
        for (var id in target.layerSources) {
            source = target.layerSources[id];
            if (source.store && source.ptype !== "gxp_cataloguesource") {
                data.push([id, source.title || id, source.url]);                
            }
        }
        var sources = new Ext.data.ArrayStore({
            fields: ["id", "title", "url"],
            data: data
        });

        var expander = this.createExpander();
        
        function addLayers() {
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
        }
        
        var idx = 0;
        if (this.startSourceId !== null) {
            sources.each(function(record) {
                if (record.get("id") === this.startSourceId) {
                    idx = sources.indexOf(record);
                }
            }, this);
        }

        source = this.target.layerSources[data[idx][0]];

        var capGridPanel = new Ext.grid.GridPanel({
            store: source.store,
            autoScroll: true,
            flex: 1,
            autoExpandColumn: "title",
            plugins: [expander],
            loadMask: true,
            colModel: new Ext.grid.ColumnModel([
                expander,
                {id: "title", header: this.panelTitleText, dataIndex: "title", sortable: true},
                {header: "Id", dataIndex: "name", width: 150, sortable: true}
            ]),
            listeners: {
                rowdblclick: addLayers,
                scope: this
            }
        });
        
        var sourceComboBox = new Ext.form.ComboBox({
            ref: "../sourceComboBox",
            store: sources,
            valueField: "id",
            displayField: "title",
            tpl: '<tpl for="."><div ext:qtip="{url}" class="x-combo-list-item">{title}</div></tpl>',
            triggerAction: "all",
            editable: false,
            allowBlank: false,
            forceSelection: true,
            mode: "local",
            value: data[idx][0],
            listeners: {
                select: function(combo, record, index) {
                    var source = this.target.layerSources[record.get("id")];
                    capGridPanel.reconfigure(source.store, capGridPanel.getColumnModel());
                    // TODO: remove the following when this Ext issue is addressed
                    // http://www.extjs.com/forum/showthread.php?100345-GridPanel-reconfigure-should-refocus-view-to-correct-scroller-height&p=471843
                    capGridPanel.getView().focusRow(0);
                    this.setSelectedSource(source);
                },
                scope: this
            }
        });
        
        var capGridToolbar = null;
        if (this.target.proxy || data.length > 1) {
            capGridToolbar = [
                new Ext.Toolbar.TextItem({
                    text: this.layerSelectionText
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
        
        var items = {
            xtype: "container",
            region: "center",
            layout: "vbox",
            items: [capGridPanel]
        };
        if (this.instructionsText) {
            items.items.push({
                xtype: "box",
                autoHeight: true,
                autoEl: {
                    tag: "p",
                    cls: "x-form-item",
                    style: "padding-left: 5px; padding-right: 5px"
                },
                html: this.instructionsText
            });
        }
        
        var bbarItems = [
            "->",
            new Ext.Button({
                text: this.addButtonText,
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
        ];
        
        var uploadButton = this.createUploadButton();
        if (uploadButton) {
            bbarItems.unshift(uploadButton);
        }

        //TODO use addOutput here instead of just applying outputConfig
        this.capGrid = new Ext.Window(Ext.apply({
            title: this.availableLayersText,
            closeAction: "hide",
            layout: "border",
            height: 300,
            width: 450,
            modal: true,
            items: items,
            tbar: capGridToolbar,
            bbar: bbarItems,
            listeners: {
                hide: function(win) {
                    capGridPanel.getSelectionModel().clearSelections();
                },
                show: function(win) {
                    if (this.selectedSource === null) {
                        this.setSelectedSource(this.target.layerSources[data[idx][0]]);
                    } else {
                        this.setSelectedSource(this.selectedSource);
                    }
                },
                scope: this
            }
        }, this.initialConfig.outputConfig));
        
    },
    
    /** private: method[setSelectedSource]
     *  :arg source: :class:`gxp.plugins.LayerSource`
     */
    setSelectedSource: function(source, callback) {
        this.selectedSource = source;
        var store = source.store;
        this.fireEvent("sourceselected", this, source);
        if (source.lazy) {
            source.store.load({callback: (function() {
                var sourceComboBox = this.capGrid.sourceComboBox,
                    store = sourceComboBox.store,
                    valueField = sourceComboBox.valueField,
                    index = store.findExact(valueField, sourceComboBox.getValue()),
                    rec = store.getAt(index),
                    source = this.target.layerSources[rec.get("id")];
                if (source) {
                    if (source.title !== rec.get("title")) {
                        rec.set("title", source.title);
                        sourceComboBox.setValue(rec.get(valueField));
                    }
                } else {
                    store.remove(rec);
                }
            }).createDelegate(this)});
        }
    },
    
    /** api: method[createUploadButton]
     *  If this tool is provided an ``upload`` property, a button will be created
     *  that launches a window with a :class:`gxp.LayerUploadPanel`.
     */
    createUploadButton: function() {
        var button;
        var uploadConfig = this.initialConfig.upload;
        // the url will be set in the sourceselected sequence
        var url;
        if (uploadConfig) {
            if (typeof uploadConfig === "boolean") {
                uploadConfig = {};
            }
            button = new Ext.Button({
                xtype: "button",
                text: this.uploadText,
                iconCls: "gxp-icon-filebrowse",
                hidden: true,
                handler: function() {
                    var panel = new gxp.LayerUploadPanel(Ext.apply({
                        url: url,
                        width: 350,
                        border: false,
                        bodyStyle: "padding: 10px 10px 0 10px;",
                        frame: true,
                        labelWidth: 65,
                        defaults: {
                            anchor: "95%",
                            allowBlank: false,
                            msgTarget: "side"
                        },
                        listeners: {
                            uploadcomplete: function(panel, detail) {
                                var layers = detail.layers;
                                var names = {};
                                for (var i=0, len=layers.length; i<len; ++i) {
                                    names[layers[i].name] = true;
                                }
                                this.selectedSource.store.load({
                                    callback: function(records, options, success) {
                                        var gridPanel = this.capGrid.items.get(0);
                                        var sel = gridPanel.getSelectionModel();
                                        sel.clearSelections();
                                        // select newly added layers
                                        var newRecords = [];
                                        var last = 0;
                                        this.selectedSource.store.each(function(record, index) {
                                            if (record.get("name") in names) {
                                                last = index;
                                                newRecords.push(record);
                                            }
                                        });
                                        sel.selectRecords(newRecords);
                                        // this needs to be deferred because the 
                                        // grid view has not refreshed yet
                                        window.setTimeout(function() {
                                            gridPanel.getView().focusRow(last);
                                        }, 100);
                                    },
                                    scope: this
                                });
                                win.close();
                            },
                            scope: this
                        }
                    }, uploadConfig));
                    
                    var win = new Ext.Window({
                        title: this.uploadText,
                        modal: true,
                        resizable: false,
                        items: [panel]
                    });
                    win.show();
                },
                scope: this
            });
            
            var urlCache = {};
            function getStatus(url, callback, scope) {
                if (url in urlCache) {
                    // always call callback after returning
                    window.setTimeout(function() {
                        callback.call(scope, urlCache[url]);
                    }, 0);
                } else {
                    Ext.Ajax.request({
                        url: url,
                        disableCaching: false,
                        callback: function(options, success, response) {
                            var status = response.status;
                            urlCache[url] = status;
                            callback.call(scope, status);
                        }
                    });
                }
            }
            
            this.on({
                sourceselected: function(tool, source) {
                    button.hide();
                    var show = false;
                    if (this.isEligibleForUpload(source)) {
                        // only works with GeoServer
                        // if url is http://example.com/geoserver/ows, we
                        // want http://example.com/geoserver/rest.
                        var parts = source.url.split("/");
                        parts.pop();
                        parts.push("rest");
                        // this sets the url for the layer upload panel
                        url = parts.join("/");
                        if (this.target.isAuthorized()) {
                            // determine availability of upload functionality based
                            // on a 405 for GET
                            getStatus(url + "/upload", function(status) {
                                button.setVisible(status === 405);
                            }, this);
                        }
                    }
                },
                scope: this
            });
        }
        return button;
    },
    
    /** private: method[isEligibleForUpload]
     *  :arg source: :class:`gxp.plugins.LayerSource`
     *  :returns: ``Boolean``
     *
     *  Determine if the provided source is eligible for upload given the tool
     *  config.
     */
    isEligibleForUpload: function(source) {
        return (
            source.url &&
            (this.relativeUploadOnly ? (source.url.charAt(0) === "/") : true) &&
            (this.nonUploadSources || []).indexOf(source.id) === -1
        );
    },
    
    /** api: config[createExpander]
     *  ``Function`` Returns an ``Ext.grid.RowExpander``. Can be overridden
     *  by applications/subclasses to provide a custom expander.
     */
    createExpander: function() {
        return new Ext.grid.RowExpander({
            tpl: new Ext.Template(this.expanderTemplateText)
        });
    }

});

Ext.preg(gxp.plugins.AddLayers.prototype.ptype, gxp.plugins.AddLayers);
