/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/NewSourceDialog.js
 * @requires widgets/FeedSourceDialog.js
 * @requires plugins/GeoNodeCatalogueSource.js
 * @requires widgets/CatalogueSearchPanel.js
 * @requires plugins/TMSSource.js
 * @requires plugins/ArcRestSource.js
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

    /** api: config[addActionMenuText]
     *  ``String``
     *  Text for add feed menu item (i18n).
     */
    addFeedActionMenuText: "Add feeds",

    /** api: config[addActionTip]
     *  ``String``
     *  Text for add action tooltip (i18n).
     */
    addActionTip: "Add layers",

    /** api: config[findActionTip]
     *  ``String``
     *  Text for find action tooltip (i18n).
     */
    findActionTip: "Find layers",

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
    addLayerSourceErrorText: "Error getting {type} capabilities ({msg}).\nPlease check the url and try again.",

    /** api: config[availableLayersText]
     *  ``String``
     *  Text for the available layers (i18n).
     */
    availableLayersText: "Available Layers",

    /** api: config[searchText]
     *  ``String``
     *  Text for the search dialog title (i18n).
     */
    searchText: "Search for layers",

    /** api: config[expanderTemplateText]
     *  ``String``
     *  Text for the grid expander (i18n).
     */
    expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>",

    /** api: config[panelTitleText]
     *  ``String``
     *  Text for the layer title (i18n).
     */
    panelTitleText: "Title",

    /** api: config[layerSelectionText]
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

    /** api: config[layerNameText]
     *  ``String``
     *  Text for Layer Name in the Layer Card (i18n).
     */
    layerNameText: "Name",

    /** api: config[layerAbstractText]
     *  ``String``
     *  Text for Layer Abstract in the Layer Card (i18n).
     */
    layerAbstractText: "Abstract",

    /** api: config[layerQueryableText]
     *  ``String``
     *  Text for Layer "isQuerable" in the Layer Card (i18n).
     */
    layerQueryableText: "Queryable",


    /** api: config[searchLayersEmptyText]
      *  ``String``
      *  Text for source layers search box when empty (i18n).
      */
     searchLayersEmptyText: 'Search layers',


    /** api: config[searchLayersSearchText]
      *  ``String``
      *  Text for source layers search button (i18n).
      */
     searchLayersSearchText: 'Search',

    /** api: config[sortLayersText]
     *  ``String``
     *  Text for source layers sort button (i18n).
     */
    sortLayersText: 'Sort alphabetically',

    /** api: config[search]
     *  ``Object | Boolean``
     *  If provided, a :class:`gxp.CatalogueSearchPanel` will be added as a
     *  menu option. This panel will be constructed using the provided config.
     *  By default, no search functionality is provided.
     */

    /** api: config[feeds]
     *  ``Object | Boolean``
     *  If provided, a :class:`gxp.FeedSourceDialog` will be added as a
     *  menu option. This panel will be constructed using the provided config.
     *  By default, no feed functionality is provided.
     */

    /** api: config[upload]
     *  ``Object | Boolean``
     *  If provided, a :class:`gxp.LayerUploadPanel` will be made accessible
     *  from a button on the Available Layers dialog.  This panel will be
     *  constructed using the provided config.  By default, no upload
     *  button will be added to the Available Layers dialog.
     */

    /** api: config[uploadRoles]
     *  ``Array`` Roles authorized to upload layers. Default is
     *  ["ROLE_ADMINISTRATOR"]
     */
    uploadRoles: ["ROLE_ADMINISTRATOR"],

    /** api: config[uploadText]
     *  ``String``
     *  Text for upload button (only renders if ``upload`` is provided).
     */
    uploadText: "Upload layers",

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

    /** api: config[uploadSource]
     *  ``String`` id of a WMS source (:class:`gxp.plugins.WMSSource') backed
     *  by a GeoServer instance that all uploads will be sent to. If provided,
     *  an Upload menu item will be shown in the "Add Layers" button menu.
     */

    /** api: config[postUploadAction]
     *  ``String|Object`` Either the id of a plugin that provides the action to
     *  be performed after an upload, or an object with ``plugin`` and
     *  ``outputConfig`` properties. The ``addOutput`` method of the plugin
     *  referenced by the provided id (or the ``plugin`` property) will be
     *  called, with the provided ``outputConfig`` as argument. A usage example
     *  would be to open the Styles tab of the LayerProperties dialog for a WMS
     *  layer:
     *
     *  .. code-block:: javascript
     *
     *      postUploadAction: {
     *          plugin: "layerproperties",
     *          outputConfig: {activeTab: 2}
     *      }
     */

    /** api: config[startSourceId]
     * ``Integer``
     * The identifier of the source that we should start with.
     */
    startSourceId: null,

    /** api: config[catalogSourceKey]
     *  ``String`` When lazy layerRecords are created by the 'Find Layers'
     *  function, they can optionally be associated with another source.
     *  E.g. the 'local' source in GeoNode client.
     */
    catalogSourceKey: null,

    /** api: config[catalogPanelWidth]
     *  ``Number``
     *  Initial width of the CSW catalog panel.
     */
    catalogPanelWidth: 440,

    /** api: config[catalogPanelHeight]
     *  ``Number``
     *  Initial height of the CSW catalog panel.
     */
    catalogPanelHeight: 300,

    /** api: config[templatedLayerGrid]
     *  ``Boolean``
     *  Show the layer grid as single-column and using an ExtJS Template from ``layerGridTemplate``.  Default is ``false``.
     */
    templatedLayerGrid: false,

    /** api: config[layerGridWidth]
     *  ``Number``
     *  Initial width of the layer grid panel.
     */
    layerGridWidth: 315,

    /** api: config[layerGridHeight]
     *  ``Number``
     *  Initial height of the layer grid panel.
     */
    layerGridHeight: 300,

    /** api: config[layerPreviewWidth]
     *  ``Number``
     *  Width of the legend image inside the Layer card (``templatedLayerGrid`` must be true).
     */
    layerPreviewWidth: 20,

    /** api: config[layerPreviewHeight]
     *  ``Number``
     *  Height of the legend image inside the Layer card (``templatedLayerGrid`` must be true).
     */
    layerPreviewHeight: 20,

    /** api: config[owsPreviewStrategies]
      *  ``Array``
      *  String array with the order of strategies to obtain preview images for OWS services, default is ['attributionlogo', 'getlegendgraphic', 'randomcolor'].
      *  'randomcolor' only applies to WFSSources. 'attributionlogo' and 'getlegendgraphic' only to WMSSources. TMSSources take the first top tile.
      */
    owsPreviewStrategies: ['attributionlogo', 'getlegendgraphic', 'randomcolor'],

    /** api: config[minTextSearchLength]
     *  ``Number``
     *  Minimal string length in text autosearch box.
     */
    minTextSearchLength: 2,

    /** api: config[textSearchQueryDelay]
     *  ``Number``
     *  `Delay before the search in the grid occurs, defaults to 500 ms.
     */
    textSearchQueryDelay: 500,

    /** private: property[selectedSource]
     *  :class:`gxp.plugins.LayerSource`
     *  The currently selected layer source.
     */
    selectedSource: null,

    /** private: property[addServerId]
     *  ``String`` Id of the record in the sourceComboBox that is used to
     *  add a new source.
     */
    addServerId: null,

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
        var options, uploadButton;
        if (this.initialConfig.search || (this.uploadSource)) {
            var items = [new Ext.menu.Item({
                iconCls: 'gxp-icon-addlayers',
                text: this.addActionMenuText,
                handler: this.showCapabilitiesGrid,
                scope: this
            })];
            if (this.initialConfig.search && this.initialConfig.search.selectedSource &&
              this.target.sources[this.initialConfig.search.selectedSource]) {
                var search = new Ext.menu.Item({
                    iconCls: 'gxp-icon-addlayers',
                    tooltip : this.findActionTip,
                    text: this.findActionMenuText,
                    handler: this.showCatalogueSearch,
                    scope: this
                });
                items.push(search);
                Ext.Ajax.request({
                    method: "GET",
                    url: this.target.sources[this.initialConfig.search.selectedSource].url,
                    callback: function(options, success, response) {
                        if (success === false) {
                            search.hide();
                        }
                    }
                });
            }
            if (this.initialConfig.feeds) {
                items.push(new Ext.menu.Item({
                    iconCls: 'gxp-icon-addlayers',
                    text: this.addFeedActionMenuText,
                    handler: this.showFeedDialog,
                    scope: this
                }));
            }
            if (this.uploadSource) {
                uploadButton = this.createUploadButton(Ext.menu.Item);
                if (uploadButton) {
                    items.push(uploadButton);
                }
            }
            options = Ext.apply(commonOptions, {
                menu: new Ext.menu.Menu({
                    items: items
                })
            });
        } else {
            options = Ext.apply(commonOptions, {
                handler : this.showCapabilitiesGrid,
                scope: this
            });
        }
        var actions = gxp.plugins.AddLayers.superclass.addActions.apply(this, [options]);

        this.target.on("ready", function() {
            if (this.uploadSource) {
                var source = this.target.layerSources[this.uploadSource];
                if (source) {
                    this.setSelectedSource(source);
                } else {
                    delete this.uploadSource;
                    if (uploadButton) {
                        uploadButton.hide();
                    }
                    // TODO: add error logging
                    // throw new Error("Layer source for uploadSource '" + this.uploadSource + "' not found.");
                }
            }
            actions[0].enable();
        }, this);
        return actions;
    },

    /** api: method[showCatalogueSearch]
     * Shows the window with a search panel.
     */
    showCatalogueSearch: function() {
        var selectedSource = this.initialConfig.search.selectedSource;
        var sources = {};
        var found = false;
        for (var key in this.target.layerSources) {
            var source = this.target.layerSources[key];
            if (source instanceof gxp.plugins.CatalogueSource) {
                var obj = {};
                obj[key] = source;
                Ext.apply(sources, obj);
                found = true;
            }
        }
        if (found === false) {
            if (window.console) {
                window.console.debug('No catalogue source specified');
            }
            return;
        }
        var output = gxp.plugins.AddLayers.superclass.addOutput.apply(this, [{
            sources: sources,
            title: this.searchText,
            height: this.catalogPanelHeight,
            width: this.catalogPanelWidth,
            selectedSource: selectedSource,
            xtype: 'gxp_cataloguesearchpanel',
            map: this.target.mapPanel.map
        }]);
        output.on({
            'addlayer': function(cmp, sourceKey, layerConfig) {
                var source = this.target.layerSources[sourceKey];
                var map = this.target.mapPanel.map;
                var mapProjection = map.getProjection();

                // Bounds may be empty!
                var bbox;
                if (layerConfig.bbox) {
                    var bounds = OpenLayers.Bounds.fromArray(layerConfig.bbox,
                        (source.yx && source.yx[layerConfig.projection] === true));
                    bbox = bounds.transform(layerConfig.srs, mapProjection);
                    layerConfig.bbox = bbox.toArray();
                }
                layerConfig.srs = mapProjection;
                layerConfig.source = this.initialConfig.catalogSourceKey ?
                    this.initialConfig.catalogSourceKey : sourceKey;

                var record = source.createLayerRecord(layerConfig);
                this.target.mapPanel.layers.add(record);
                if (bbox) {
                    this.target.mapPanel.map.zoomToExtent(bbox);
                }
            },
            scope: this
        });
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
        } else if (!(this.capGrid instanceof Ext.Window)) {
            this.addOutput(this.capGrid);
        }
        this.capGrid.show();
    },

    /** api: method[showFeedDialog]
     * Shows the window with a dialog for adding feeds.
     */
    showFeedDialog: function() {
        if(!this.feedDialog) {
            var Cls = this.outputTarget ? Ext.Panel : Ext.Window;
            this.feedDialog = new Cls(Ext.apply({
                closeAction: "hide",
                autoScroll: true,
                title: this.addFeedActionMenuText,
                items: [{
                    xtype: "gxp_feedsourcedialog",
                    target: this.target,
                    listeners: {
                        'addfeed':function (ptype, config) {
                            var sourceConfig = {"config":{"ptype":ptype}};
                            if (config.url) {
                                sourceConfig.config["url"] = config.url;
                            }
                            var source = this.target.addLayerSource(sourceConfig);
                            config.source = source.id;
                            var feedRecord = source.createLayerRecord(config);
                            this.target.mapPanel.layers.add([feedRecord]);
                            this.feedDialog.hide();
                        },
                        scope: this
                    }
                }]
            }, this.initialConfig.outputConfig));
            if (Cls === Ext.Panel) {
                this.addOutput(this.feedDialog);
            }
        }
        if (!(this.feedDialog instanceof Ext.Window)) {
            this.addOutput(this.feedDialog);
        }
        this.feedDialog.show();
    },

    createColumnModel: function() {
        // For use in previewImage.
        var layerPreviewWidth = this.layerPreviewWidth, layerPreviewHeight = this.layerPreviewHeight;
        var self = this;

        var tpl = '<div class="layercard">' +
            '<div class="meta_title">{title}' +
                '<!-- <div class="btn_info" id="{id}" title="Show metadata for this Layer">' +
                    '<table cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">' +
                        '<tbody class="x-btn-small x-btn-icon-small-left">' +
                        '<tr>' +
                            '<td class="x-btn-tl"><i>&nbsp;</i></td>' +
                            '<td class="x-btn-tc"></td>' +
                            '<td class="x-btn-tr"><i>&nbsp;</i></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="x-btn-ml"><i>&nbsp;</i></td>' +
                            '<td class="x-btn-mc"><em class=" x-unselectable" unselectable="on">' +
                                '<button type="button" id="mb-{id}" class=" x-btn-text gxp-icon-metadata">Metadata</button>' +
                            '</em></td>' +
                            '<td class="x-btn-mr"><i>&nbsp;</i></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="x-btn-bl"><i>&nbsp;</i></td>' +
                            '<td class="x-btn-bc"></td>' +
                            '<td class="x-btn-br"><i>&nbsp;</i></td>' +
                        '</tr>' +
                        '</tbody>' +
                    '</table>' +
                '</div> -->' +
            '</div>' +
            '<table cellspacing="2" cellpadding="2">' +
            '<tr>' +
            '<td style="vertical-align:middle;">' +
                 '{previewImage}' +
            '</td>' +
            '<td style="vertical-align:top; white-space: normal!important;"><p style="margin-top:4px;"><strong>' + this.layerNameText + ': </strong>{name}<br/><strong>' + this.layerAbstractText + ': </strong>{abstract}<br/><strong>' + this.layerQueryableText + ': </strong>{queryable}</p></td>' +
            '</tr>' +

            '</table>' +
            '<div class="btn_add" title="Add this layer to the map">' +
                '<table name="addlayer" cellspacing="0" class="x-btn  x-btn-text-icon" style="width: auto;">' +
                    '<tbody class="x-btn-small x-btn-icon-small-left">' +
                    '<tr>' +
                        '<td class="x-btn-tl"><i>&nbsp;</i></td>' +
                        '<td class="x-btn-tc"></td>' +
                        '<td class="x-btn-tr"><i>&nbsp;</i></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="x-btn-ml"><i>&nbsp;</i></td>' +
                        '<td class="x-btn-mc"><em class=" x-selectable">' +
                            '<button name="addlayer" type="button" id="but-{id}-{rowIndex}" class=" x-btn-text gxp-icon-addlayers">Add layer</button>' +
                        '</em></td>' +
                        '<td class="x-btn-mr"><i>&nbsp;</i></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="x-btn-bl"><i>&nbsp;</i></td>' +
                        '<td class="x-btn-bc"></td>' +
                        '<td class="x-btn-br"><i>&nbsp;</i></td>' +
                    '</tr>' +
                    '</tbody>' +
                '</table>' +
            '</div>' +
        '</div>';
        tpl = new Ext.XTemplate(tpl);
        tpl.compile();
        return new Ext.grid.ColumnModel([
            // Just one column, styled with the ExtJS template
            {id: "title", dataIndex: "title", sortable: true,
                renderer: function (value, metaData, record, rowIndex, colIndex, view) {
                    var data = record.data;
                    data.id = record.id;
                    var source = self.target.layerSources[record.store.sourceId];

                    // Let LayerSource provide a URL to a preview image, if none use 'preview-notavailable' CSS.
                    // TODO: background image loading, and loading only once
                    var previewImageURL = source.getPreviewImageURL(record, layerPreviewWidth, layerPreviewHeight);
                    if (previewImageURL) {
                        // Only resize TMS preview images. TODO: make smarter an request from Source
                        var backgroundSize = record.data.scalePreviewImage === true ? 'background-size:' + layerPreviewWidth + 'px ' + layerPreviewHeight + 'px;' : ' ';

                        data.previewImage = '<div style="width:' + layerPreviewWidth + 'px; height:'+ layerPreviewHeight + 'px; background-image: url(\'' + previewImageURL + '\'); ' + backgroundSize + ' background-repeat: repeat;" >&nbsp;</div>';
                        // data.previewImage = '<img class="layerpreview"  width="'+ layerPreviewWidth +'" height="'+ layerPreviewHeight + '" src="' + previewImageURL + '"/>';
                    } else {
                        data.previewImage = '<div style="width:' + layerPreviewHeight + 'px; height:'+ layerPreviewHeight + 'px" class="preview-notavailable">&nbsp;</div>';
                    }
                    data.rowIndex = rowIndex;
                    return tpl.apply(data);
                }}
        ]);
    },

    /**
     * private: method[initCapGrid]
     * Constructs a window with a capabilities grid.
     */
    initCapGrid: function() {
        var source, data = [], target = this.target;
        for (var id in target.layerSources) {
            source = target.layerSources[id];
            if (source.store && !source.hidden) {
                source.store.sourceId = id;
                data.push([id, source.title || id, source.url]);
            }
        }
        var sources = new Ext.data.ArrayStore({
            fields: ["id", "title", "url"],
            data: data
        });

        var expander = this.createExpander();

        // Allows async record loading for layers that need to consult a server via Ajax (e.g. TMS)
        function addLayers() {
            var source = this.selectedSource;
            var records = capGridPanel.getSelectionModel().getSelections();
            var recordsToAdd = [],
                numRecords = records.length;
            function collectRecords(record) {
                if (recordsToAdd) {
                    recordsToAdd.push(record);
                }
                numRecords--;
                if (numRecords === 0) {
                    this.addLayers(recordsToAdd);
                }
            }

            for (var i = 0, ii = records.length; i < ii; ++i) {
                var record = source.createLayerRecord({
                    name: records[i].get("name"),
                    source: source.id
                }, collectRecords, this);
                if (record) {
                    collectRecords.call(this, record);
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

        var capGridPanel;
        var self = this;
        if (this.templatedLayerGrid) {
            // Nice layout using ExtJS Template
            capGridPanel = new Ext.grid.GridPanel({
                store: source.store,
                autoScroll: true,
                autoExpandColumn: "title",
                hideHeaders: true,
                bodyCssClass: 'layercardgrid',
                stripeRows: false,
                // plugins: [expander],
                loadMask: true,
                colModel: this.createColumnModel(),
                listeners: {
                    // Listen to button clicked
                    click: function (e) {
                        var target = e.getTarget();
                        if (target.name == "addlayer") {
                            // Get selected row id from target element
                            var rowIndex = target.id.slice(target.id.lastIndexOf('-')+1);

                            // Explicit row and source selection
                            capGridPanel.getSelectionModel().selectRow(rowIndex);
                            var record = capGridPanel.getSelectionModel().getSelections()[0];
                            self.selectedSource  = self.target.layerSources[record.store.sourceId];

                            // Cannot call this.addLayers directly: LayerSource.createLayerRecord could be async e.g. TMSSource
                            addLayers.apply(this);
                        }
                    },
                    scope: this
                }
// Not yet: for a Paging Toolbar we need a paging Store....
//                ,bbar: new Ext.PagingToolbar({
//                        store: source.store,
//                        displayInfo: true,
//                        pageSize: 5,
//                        prependButtons: true,
//                        items: [
//                            'text 1'
//                        ]
//                    })
            });
        } else {
            // Ordinary Layout with row expander
            capGridPanel = new Ext.grid.GridPanel({
                store: source.store,
                autoScroll: true,
                autoExpandColumn: "title",
                plugins: [expander],
                loadMask: true,
                colModel: new Ext.grid.ColumnModel([
                    expander,
                    {id: "title", header: this.panelTitleText, dataIndex: "title", sortable: true},
                    {header: "Id", dataIndex: "name", width: 120, sortable: true}
                ]),
                listeners: {
                    rowdblclick: addLayers,
                    scope: this
                }
            });
        }

        var sourceComboBox = new Ext.form.ComboBox({
            ref: "../sourceComboBox",
            width: 240,
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
                    var id = record.get("id");
                    if (id === this.addServerId) {
                        showNewSourceDialog();
                        sourceComboBox.reset();
                        return;
                    }
                    var source = this.target.layerSources[id];
                    source.store.sourceId = id;
                    capGridPanel.reconfigure(source.store, capGridPanel.getColumnModel());
                    // TODO: remove the following when this Ext issue is addressed
                    // http://www.extjs.com/forum/showthread.php?100345-GridPanel-reconfigure-should-refocus-view-to-correct-scroller-height&p=471843
                    capGridPanel.getView().focusRow(0);
                    this.setSelectedSource(source);
                    // blur the combo box
                    //TODO Investigate if there is a more elegant way to do this.
                    (function() {
                        combo.triggerBlur();
                        combo.el.blur();
                    }).defer(100);
                },
                focus: function(field) {
                    if (target.proxy) {
                        field.reset();
                    }
                },
                scope: this
            }
        });


        var sourceToolsItems = [
            {
                xtype: 'tbspacer',
                width: 14
            },
            {
                id: 'txtSearch',
                xtype: 'textfield',
                emptyText: this.searchLayersEmptyText,
                selectOnFocus: true,
                minWidth: 180,
                enableKeyEvents : true,
                listeners: {
                    scope: this,
                    keyup: function (e) {
                        // Get typed text from element directly
                        var text = Ext.getDom('txtSearch').value;

                        // Only do search when minimum chars reached
                        if (text && text.length < this.minTextSearchLength) {
                            return;
                        }

                        // Use a delayed task as not to start search immediately for each typed char
                        if (!this.dqTask) {
                            this.dqTask = new Ext.util.DelayedTask(this.sourceTextSearch, this);
                        }

                        // Perform delayed text search
                        this.dqTask.delay(this.textSearchQueryDelay, null, null, [text]);
                    }
                }
            },
            {
                xtype: 'tbfill'
            },
            {
                id: 'btnList',
                xtype: 'button',
                iconCls: 'gxp-icon-book-open',
                text: this.sortLayersText,
                tooltip: {
                    text: 'Sort the layers alphabetically by title. Toggle to sort asc/descending.',
                    width: 360
                 },
                handler: function () {
                    this.sourceSort();
                },
                scope: this
            },
            {
                xtype: 'tbspacer',
                width: 16
            }
        ];

        var capGridToolbar = null,
            container;

        if (this.target.proxy || data.length > 1) {
/*            container = new Ext.Container({
                cls: 'gxp-addlayers-sourceselect',
                items: [sourceComboBox, new Ext.Toolbar.TextItem({text: this.layerSelectionText})
                ]
            });
            capGridToolbar = [container];  */
            // JvdB : simplified (also changed ref for  sourceComboBox)
            capGridToolbar = [new Ext.Toolbar.TextItem({text: this.layerSelectionText}), sourceComboBox];
        }


        if (this.target.proxy) {
            this.addServerId = Ext.id();
            sources.loadData([[this.addServerId, this.addServerText + "..."]], true);
        }

        var newSourceDialog = {
            xtype: "gxp_newsourcedialog",
            header: false,
            listeners: {
                "hide": function(cmp) {
                    if (!this.outputTarget) {
                        cmp.ownerCt.hide();
                    }
                },
                "urlselected": function(newSourceDialog, url, type) {
                    newSourceDialog.setLoading();
                    var config = {url: url};
                    switch (type) {
                    	case 'TMS':
                            config.ptype = "gxp_tmssource";
                    		break;
                    	case 'REST':
                            config.ptype = 'gxp_arcrestsource';
                    		break;
                        case 'WMS':
                            config.ptype = 'gxp_wmssource';
                            config.owsPreviewStrategies = this.owsPreviewStrategies;
                       		break;
                        case 'WFS':
                            config.ptype = 'gxp_wfssource';
                            config.owsPreviewStrategies = this.owsPreviewStrategies;
                            if (this.defaultSrs !== undefined)  {
                                config.defaultSrs = this.defaultSrs;
                            }
                       		break;
                    	default:
                            config.ptype = 'gxp_wmscsource';
                    }

                    this.target.addLayerSource({
                        config: config,
                        callback: function(id) {
                            // First check if Source did not bump on any error loading.
                            var source = this.target.layerSources[id];
                            if (source.error) {
                                newSourceDialog.setError(
                                     new Ext.Template(this.addLayerSourceErrorText).apply({type: type, msg: source.error})
                                 );
                                return;
                            }
                            // add to combo and select
                            var record = new sources.recordType({
                                id: id,
                                title: source.title || this.untitledText
                            });
                            sources.insert(0, [record]);
                            sourceComboBox.onSelect(record, 0);
                            newSourceDialog.hide();
                        },
                        fallback: function(source, msg) {
                            newSourceDialog.setError(
                                new Ext.Template(this.addLayerSourceErrorText).apply({type: type, msg: msg})
                            );
                        },
                        scope: this
                    });
                },
                scope: this
            }
        };
        var me = this;
        function showNewSourceDialog() {
            if (me.outputTarget) {
                me.addOutput(newSourceDialog);
            } else {
                new Ext.Window({
                    title: gxp.NewSourceDialog.prototype.title,
                    modal: true,
                    hideBorders: true,
                    width: 300,
                    items: newSourceDialog
                }).show();
            }
        }

        var panelItems = [];
        panelItems.push(capGridPanel);

        var serverInfoItem = {
            xtype: "box",
            region: "north",
            height: 24,
            autoWidth: true,
            tpl: new Ext.Template('<div style="margin-left:6px; margin-top:2px; margin-bottom: 2px"><span style="font-weight: bold">{serverTitle}</span><br><span style="color: #aaaaaa">{serverUrl}</span></div>'),
            listeners: {
                'afterrender': function (e) {
                    var box = this;
                    if (sources) {
                        var sourceRec = sources.getAt(0);
                        box.update({serverTitle: sourceRec.data.title, serverUrl: sourceRec.data.url});

                    }
                    sourceComboBox.on('select',
                        function (obj) {
                            var title = self.selectedSource.serviceTitle ? self.selectedSource.serviceTitle : self.selectedSource.title;
                            box.update({serverTitle: title, serverUrl: self.selectedSource.url});
                        }
                        );
                }
            }
        };

        var items = [serverInfoItem, {
            xtype: "panel",
            region: "center",
            layout: "fit",
            hideBorders: true,
            border: false,
            margins: {
                top: 8
            },
            tbar: sourceToolsItems,
            items: panelItems
        }];

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

        var bbarItems = null;
        if (!this.templatedLayerGrid) {

            bbarItems = [
                "->",
                new Ext.Button({
                    text: this.addButtonText,
                    iconCls: "gxp-icon-addlayers",
                    handler: addLayers,
                    scope: this
                }),
                new Ext.Button({
                    text: this.doneText,
                    handler: function () {
                        this.capGrid.hide();
                    },
                    scope: this
                })
            ];
        }

        var uploadButton;
        if (!this.uploadSource) {
            uploadButton = this.createUploadButton();
            if (uploadButton) {
                bbarItems.unshift(uploadButton);
            }
        }

        var Cls = this.outputTarget ? Ext.Panel : Ext.Window;
        this.capGrid = new Cls(Ext.apply({
            title: this.availableLayersText,
            closeAction: "hide",
            layout: "border",
            height: this.layerGridHeight,
            width: this.layerGridWidth,
            modal: true,
            items: items,
            tbar: capGridToolbar,
            bbar: bbarItems,
            listeners: {
                destroy: function () {
                    if (this.dqTask) {
                        this.dqTask.cancel();
                        this.dqTask = null;
                    }
                },
                hide: function (win) {
                    if (this.dqTask) {
                        this.dqTask.cancel();
                        this.dqTask = null;
                    }
                    capGridPanel.getSelectionModel().clearSelections();
                },
                show: function (win) {
                    if (this.selectedSource === null) {
                        this.setSelectedSource(this.target.layerSources[data[idx][0]]);
                    } else {
                        this.setSelectedSource(this.selectedSource);
                    }
                },
                scope: this
            }
        }, this.initialConfig.outputConfig));
        if (Cls === Ext.Panel) {
            this.addOutput(this.capGrid);
        }

    },

    /** private: method[sourceSort]
     * Sort the records in the selected Source Store.
     */
    sourceSort: function () {
        if (!this.selectedSource || !this.selectedSource.store) {
            alert('No source active');
            return;
        }

        this.selectedSource.store.sort('title');
    },

    /** private: method[sourceTextSearch]
     *  :arg text: ``String`` search text
     *  :arg message: ``String`` message to display while searching
     */
    sourceTextSearch: function (text, message) {
        if (!this.selectedSource || !this.selectedSource.store) {
            alert('No source active');
            return;
        }

        var store = this.selectedSource.store;
        if (!text || text == '' || text == this.searchLayersEmptyText) {
            store.clearFilter(false);
            return;
        }
        store.clearFilter(true);

        // Not all source types may support or have values in all fields
        var tryFields = ['name', 'title', 'abstract', 'attribution'];

        var filter = [
            {
                fn: function (record) {
                    var result = false;
                    var value;
                    var textLower = text.toLowerCase();
                    for (var i=0; i <  tryFields.length && !result; i++) {
                        value = record.get(tryFields[i]);
                        if (!value || value == '' || !(typeof(value) === 'string' || value instanceof String)) {
                            continue;
                        }

                        result = value.toLowerCase().indexOf(textLower) > -1;
                    }
                    return result;
                },
                scope: this
            }
        ];
        store.filter(filter);
        store.lastSearchText = text;
    },

    /** private: method[addLayers]
     *  :arg records: ``Array`` the layer records to add
     *  :arg isUpload: ``Boolean`` Do the layers to add come from an upload?
     */
    addLayers: function(records, isUpload) {
        var source = this.selectedSource;
        var layerStore = this.target.mapPanel.layers,
            extent, record, layer, isVisible;
        for (var i=0, ii=records.length; i<ii; ++i) {
            // If the source is lazy, then createLayerRecord will not return
            // a record, and we take the preconfigured record.
            record = source.createLayerRecord({
                name: records[i].get("name"),
                source: source.id
            }) || records[i];
            if (record) {
                layer = record.getLayer();
                isVisible = layer.getVisibility();
                if (layer.maxExtent) {
                    if (!extent) {
                        extent = record.getLayer().maxExtent.clone();
                    } else {
                        extent.extend(record.getLayer().maxExtent);
                    }
                }
                if (record.get("group") === "background") {
                    // layer index 0 is the invisible base layer, so we insert
                    // at position 1.
                    layerStore.insert(1, [record]);
                } else {
                    layerStore.add([record]);
                }
            }
        }
        if (extent && isVisible) {
            this.target.mapPanel.map.zoomToExtent(extent);
        }
        if (records.length === 1 && record) {
            // select the added layer
            this.target.selectLayer(record);
            if (isUpload && this.postUploadAction) {
                // show LayerProperties dialog if just one layer was uploaded
                var outputConfig,
                    actionPlugin = this.postUploadAction;
                if (!Ext.isString(actionPlugin)) {
                    outputConfig = actionPlugin.outputConfig;
                    actionPlugin = actionPlugin.plugin;
                }
                this.target.tools[actionPlugin].addOutput(outputConfig);
            }
        }
    },

    /** private: method[setSelectedSource]
     *  :arg source: :class:`gxp.plugins.LayerSource`
     */
    setSelectedSource: function(source, callback) {
        this.selectedSource = source;
        var store = source.store;
        this.fireEvent("sourceselected", this, source);
        if (this.capGrid && source.lazy) {
            source.store.load({callback: (function() {
                var sourceComboBox = this.capGrid.sourceComboBox,
                    store = sourceComboBox.store,
                    valueField = sourceComboBox.valueField,
                    index = store.findExact(valueField, sourceComboBox.getValue()),
                    rec = store.getAt(index),
                    source = this.target.layerSources[rec.get("id")];
                if (source) {
                    if (source.title !== rec.get("title") && !Ext.isEmpty(source.title)) {
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
     *  :arg Cls: ``Function`` The class to use for creating the button. If not
     *      provided, an ``Ext.Button`` instance will be created.
     *      ``Ext.menu.Item`` would be another option.
     *  If this tool is provided an ``upload`` property, a button will be created
     *  that launches a window with a :class:`gxp.LayerUploadPanel`.
     */
    createUploadButton: function(Cls) {
        Cls = Cls || Ext.Button;
        var button;
        var uploadConfig = this.initialConfig.upload || !!this.initialConfig.uploadSource;
        // the url will be set in the sourceselected sequence
        var url;
        if (uploadConfig) {
            if (typeof uploadConfig === "boolean") {
                uploadConfig = {};
            }
            button = new Cls({
                text: this.uploadText,
                iconCls: "gxp-icon-filebrowse",
                hidden: !this.uploadSource,
                handler: function() {
                    this.target.doAuthorized(this.uploadRoles, function() {
                        var panel = new gxp.LayerUploadPanel(Ext.apply({
                            title: this.outputTarget ? this.uploadText : undefined,
                            url: url,
                            width: 300,
                            border: false,
                            bodyStyle: "padding: 10px 10px 0 10px;",
                            labelWidth: 65,
                            autoScroll: true,
                            defaults: {
                                anchor: "99%",
                                allowBlank: false,
                                msgTarget: "side"
                            },
                            listeners: {
                                uploadcomplete: function(panel, detail) {
                                    var layers = detail["import"].tasks;
                                    var item, names = {}, resource, layer;
                                    for (var i=0, len=layers.length; i<len; ++i) {
                                        item = layers[i];
                                        if (item.state === "ERROR") {
                                            Ext.Msg.alert(item.layer.originalName, item.errorMessage);
                                            return;
                                        }
                                        var ws;
                                        if (item.target.dataStore) {
                                            ws = item.target.dataStore.workspace.name;
                                        } else if (item.target.coverageStore) {
                                            ws = item.target.coverageStore.workspace.name;
                                        }
                                        names[ws + ":" + item.layer.name] = true;
                                    }
                                    this.selectedSource.store.load({
                                        params: {"_dc": Math.random()},
                                        callback: function(records, options, success) {
                                            var gridPanel, sel;
                                            if (this.capGrid && this.capGrid.isVisible()) {
                                                gridPanel = this.capGrid.get(0).get(0);
                                                sel = gridPanel.getSelectionModel();
                                                sel.clearSelections();
                                            }
                                            // select newly added layers
                                            var newRecords = [];
                                            var last = 0;
                                            this.selectedSource.store.each(function(record, index) {
                                                if (record.get("name") in names) {
                                                    last = index;
                                                    newRecords.push(record);
                                                }
                                            });
                                            if (gridPanel) {
                                                // this needs to be deferred because the
                                                // grid view has not refreshed yet
                                                window.setTimeout(function() {
                                                    sel.selectRecords(newRecords);
                                                    gridPanel.getView().focusRow(last);
                                                }, 100);
                                            } else {
                                                this.addLayers(newRecords, true);
                                            }
                                        },
                                        scope: this
                                    });
                                    if (this.outputTarget) {
                                        panel.hide();
                                    } else {
                                        win.close();
                                    }
                                },
                                scope: this
                            }
                        }, uploadConfig));

                        var win;
                        if (this.outputTarget) {
                            this.addOutput(panel);
                        } else {
                            win = new Ext.Window({
                                title: this.uploadText,
                                modal: true,
                                resizable: false,
                                items: [panel]
                            });
                            win.show();
                        }
                    }, this);
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
                    button[this.uploadSource ? "show" : "hide"]();
                    var show = false;
                    if (this.isEligibleForUpload(source)) {
                        url = this.getGeoServerRestUrl(source.url);
                        if (this.target.isAuthorized()) {
                            // determine availability of upload functionality based
                            // on a 200 for GET /imports
                            getStatus(url + "/imports", function(status) {
                                button.setVisible(status === 200);
                            }, this);
                        }
                    }
                },
                scope: this
            });
        }
        return button;
    },

    /** private: method[getGeoServerRestUrl]
     *  :arg url: ``String`` A GeoServer url like "geoserver/ows"
     *  :returns: ``String`` The rest endpoint for the above GeoServer,
     *      i.e. "geoserver/rest"
     */
    getGeoServerRestUrl: function(url) {
        var parts = url.split("/");
        parts.pop();
        parts.push("rest");
        return parts.join("/");
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
