/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @include widgets/FilterBuilder.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = CrossLayerQueryForm
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: CrossLayerQueryForm(config)
 *
 *    Plugin for performing cross layer queries
 */
gxp.plugins.CrossLayerQueryForm = Ext.extend(gxp.plugins.Tool, {
    /** api: ptype = gxp_crosslayerqueryform */
    ptype: "gxp_crosslayerqueryform",

    /** api: config[featureManager]
     *  ``String`` The id of the :class:`gxp.plugins.FeatureManager` to use
     *  with this tool.
     */
    featureManager: null,
    
    /** api: config[autoHide]
     *  ``Boolean`` Set to true if the output of this tool goes into an
     *  ``Ext.Window`` that should be hidden when the query result is
     *  available. Default is false.
     */
    autoHide: false,

    /** private: property[schema]
     *  ``GeoExt.data.AttributeStore``
     */
    schema: null,
    
    /** api: config[queryActionText]
     *  ``String``
     *  Text for query action (i18n).
     */
    queryActionText: "CrossQuery",
    
    /** api: config[cancelButtonText]
     *  ``String``
     *  Text for cancel button (i18n).
     */
    cancelButtonText: "Cancel",

    /** api: config[queryMenuText]
     *  ``String``
     *  Text for query menu item (i18n).
     */
    queryMenuText: "Cross layer query",

    /** api: config[queryActionTip]
     *  ``String``
     *  Text for query action tooltip (i18n).
     */
    queryActionTip: "Cross query selected layer",

  
    /** api: config[queryMsg]
     *  ``String``
     *  Text for query load mask (i18n).
     */
    queryMsg: "Querying...",
    
    /** api: config[noFeaturesTitle]
     *  ``String``
     *  Text for no features alert title (i18n)
     */
    noFeaturesTitle: "No Match",

    /** api: config[noFeaturesMsg]
     *  ``String``
     *  Text for no features alert message (i18n)
     */
    noFeaturesMessage: "Your query did not return any results.",

    /** api: config[actions]
     *  ``Object`` By default, this tool creates a "Query" action to trigger
     *  the output of this tool's form. Set to null if you want to include
     *  the form permanently in your layout.
     */
    
    /** api: config[outputAction]
     *  ``Number`` By default, the "Query" action will trigger this tool's
     *  form output. There is no need to change this unless you configure
     *  custom ``actions``.
     */
    outputAction: 0,
    
    /** api: crossLayerRecord
     *  ``Object``
     *  Store for cross layer records (i18n)
     */
    crossLayerRecord: {},

    constructor: function(config) {
        Ext.applyIf(config, {
            actions: [{
                text: this.queryActionText,
                menuText: this.queryMenuText,
                iconCls: "gxp-icon-find",
                tooltip: this.queryActionTip,
                disabled: true
            }]
        });
        gxp.plugins.CrossLayerQueryForm.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[addActions]
     */
    addActions: function(actions) {
        gxp.plugins.CrossLayerQueryForm.superclass.addActions.apply(this, arguments);
        // support custom actions
        if (this.actions) {
            this.target.tools[this.featureManager].on("layerchange",
                function(mgr, rec, schema) {
                    for (var i=this.actions.length-1; i>=0; --i) {
                        this.actions[i].setDisabled(!schema);
                    }
                }, this);
        }
    },

    /** api: method[getLayerSource]
     */
    getLayerSource: function(target) {
        var featureManager = target.tools[this.featureManager];
        var sourceId = featureManager.layerRecord.data.source;
        return target.layerSources[sourceId];
    },

    /** api: method[addFilterBuilder]
     */
    addFilterBuilder: function(layerTypeSchema, attrFieldSet) {
        if (attrFieldSet.hidden) {
            attrFieldSet.show();
        }
        attrFieldSet.removeAll();
        if (layerTypeSchema) {
            attrFieldSet.add({
                xtype: "gxp_filterbuilder",
                ref: "filterBuilder",
                attributes: layerTypeSchema,
                allowBlank: true,
                allowGroups: false
            });
            attrFieldSet.expand();
        } else {
            attrFieldSet.rendered && attrFieldSet.collapse();
        }
        attrFieldSet.doLayout();
    },

    /** api: method[crossLayerSelect]
     */
    crossLayerSelect: function(targetField, attrFieldSet, recordName) {
        var record = this.capGrid.capGridPanel.getSelectionModel().getSelected();
        if (record.get("queryable")) {
            targetField.setValue(record.get("name"));
            targetField.enable();
            this.capGrid.hide();
            this.getLayerSource(this.target).getSchema(record, function(schema) {
                this.addFilterBuilder(schema, attrFieldSet);
            }, this);
        }
        this.crossLayerRecord[recordName] = record;
    },

    /** api: method[showCapabilitiesGrid]
     */
    showCapabilitiesGrid: function(field, attrFieldSet, recordName) {
        if(!this.capGrid) {
            this.initCapGrid();
        }
        this.capGrid.capGridPanel.on('rowdblclick',
            Ext.createDelegate(this.crossLayerSelect, this,
                [field, attrFieldSet, recordName]), this,
                { single : true });
        this.capGrid.show();
    },

    /** api: method[initCapGrid]
     */
    initCapGrid: function() {
        var featureManager = this.target.tools[this.featureManager];
        var sourceId = featureManager.layerRecord.data.source;
        var source = this.target.layerSources[sourceId];

        var capGridPanel = new gxp.grid.CapabilitiesGrid({
            expander: null,
            ref: "../capGridPanel",
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            height: 300,
            width: 450,
            plugins: [],
            store: source.store,
            allowNewSources: false
        });

        var items = {
            xtype: "container",
            region: "center",
            layout: "vbox",
            items: [capGridPanel]
        };

        this.capGrid = new Ext.Window(Ext.apply({
            title: "Select layer for cross query",
            closeAction: "hide",
            layout: "border",
            height: 300,
            width: 650,
            modal: true,
            items: items,
            listeners: {
                hide: function(win) {
                    capGridPanel.getSelectionModel().clearSelections();
                },
                show: function(win) {
                    var sourceId = featureManager.layerRecord.data.source;
                    capGridPanel.reconfigure(this.target.layerSources[sourceId].store,
                                            capGridPanel.getColumnModel());
                },
                scope: this
            }
        }, this.initialConfig.outputConfig));

    },

    /** api: method[resetGridPanel]
     */
    resetGridPanel: function(queryForm) {
        queryForm.intersectCrossLayerField.reset();
        queryForm.intersectCrossLayerField.disable();
        queryForm.intersectAttributeFieldset.removeAll();
        queryForm.intersectAttributeFieldset.hide();
        queryForm.dWithinCrossLayerField.reset();
        queryForm.dWithinCrossLayerField.disable();
        queryForm.dWithinAttributeFieldset.removeAll();
        queryForm.dWithinAttributeFieldset.hide();
    },

    /** api: method[filterTemplate]
     */
    filterTemplate: function(attrFilter, filterType, params) {
        var featureManager = this.target.tools[this.featureManager];
        var record = this.crossLayerRecord[filterType];
        var filterStr = "INCLUDE";

        if (attrFilter) {filterStr = attrFilter.toString();}

        var filterFunc = new OpenLayers.Filter.Function({
            name: 'collectGeometries',
            params: [new OpenLayers.Filter.Function({
                name: 'queryCollection',
                params: [record.get("name"),
                        featureManager.featureStore.geometryName,
                        filterStr]
            })]
        });
        var filterQuery = new OpenLayers.Filter.Spatial({
            property: featureManager.featureStore.geometryName,
            type: filterType,
            value: filterFunc
        });
        Ext.apply(filterQuery, params);

        return filterQuery;
    },

    /** api: method[getattrFieldsetFilter]
     */
    getattrFieldsetFilter: function(attrFieldset) {
        var filter = "INCLUDE";
        if (attrFieldset.collapsed !== true) {
            var attributeFilter = attrFieldset.filterBuilder.getFilter();
            if (attributeFilter) {
                filter = attributeFilter.toString();
            }
        }
        return filter;
    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var featureManager = this.target.tools[this.featureManager];
        config = Ext.apply({
            border: false,
            bodyStyle: "padding: 10px",
            layout: "form",
            autoScroll: true,
            items: [{
                xtype: "fieldset",
                ref: "intersectFieldset",
                title: "Intersects",
                checkboxToggle: true,
                collapsed: false,
                hideLabels: true,
                items: [{
                        xtype: "compositefield",
                        items: [{
                            xtype: "button",
                            text: "Select Layer",
                            handler: function() {
                                this.showCapabilitiesGrid(
                                    queryForm.intersectCrossLayerField,
                                    queryForm.intersectAttributeFieldset,
                                    OpenLayers.Filter.Spatial.INTERSECTS);
                            },
                            scope: this
                        }, {
                            xtype: "textfield",
                            ref: "../../intersectCrossLayerField",
                            disabled: true,
                            readOnly: true
                        }]
                    }, {
                        xtype: "fieldset",
                        hidden: "true",
                        ref: "../intersectAttributeFieldset",
                        title: "Filter",
                        checkboxToggle: true
                    }
                ]
            }, {
                xtype: "fieldset",
                ref: "dWithinFieldset",
                title: "DWithin",
                checkboxToggle: true,
                collapsed: true,
                items: [{
                        xtype: "compositefield",
                        hideLabel: true,
                        items: [{
                            xtype: "button",
                            text: "Select Layer",
                            handler: function() {
                                this.showCapabilitiesGrid(queryForm.dWithinCrossLayerField,
                                    queryForm.dWithinAttributeFieldset,
                                    OpenLayers.Filter.Spatial.DWITHIN);
                            },
                            scope: this
                        }, {
                            xtype: "textfield",
                            ref: "../../dWithinCrossLayerField",
                            disabled: true,
                            readOnly: true
                        }]
                    },
                    {
                        xtype: "textfield",
                        ref: "../dWithinDistanceField",
                        fieldLabel: "Distance (km)",
                        width: 120,
                        value: "100",
                        readOnly: false
                    }, {
                        xtype: "fieldset",
                        hidden: "true",
                        ref: "../dWithinAttributeFieldset",
                        title: "Filter",
                        checkboxToggle: true
                    }
                ]
            }],
            bbar: ["->", {
                text: this.cancelButtonText,
                iconCls: "cancel",
                handler: function() {
                    var ownerCt = this.outputTarget ? queryForm.ownerCt :
                        queryForm.ownerCt.ownerCt;
                    if (ownerCt && ownerCt instanceof Ext.Window) {
                        ownerCt.hide();
                    } else {
                        addAttributeFilter(
                            featureManager,
                            featureManager.layerRecord,
                            featureManager.schema
                        );
                    }
                }
            }, {
                text: this.queryActionText,
                iconCls: "gxp-icon-find",

                handler: function() {
                    var filters = [];
                    if (queryForm.intersectFieldset.collapsed !== true &&
                            queryForm.intersectCrossLayerField.disabled !== true) {
                        var intersectFilter = this.filterTemplate(
                                        queryForm.intersectAttributeFieldset.filterBuilder.getFilter(),
                                        OpenLayers.Filter.Spatial.INTERSECTS);
                        filters.push(intersectFilter);
                    }
                    if (queryForm.dWithinFieldset.collapsed !== true &&
                            queryForm.dWithinCrossLayerField.disabled !== true) {
                        var dWithinFilter = this.filterTemplate(
                                    queryForm.dWithinAttributeFieldset.filterBuilder.getFilter(),
                                    OpenLayers.Filter.Spatial.DWITHIN,
                                    {distance: queryForm.dWithinDistanceField.getValue()});
                        filters.push(dWithinFilter);
                    }
                    if (filters.length > 0) {
                        featureManager.loadFeatures(filters.length > 1 ?
                            new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.AND,
                                filters: filters
                            }) :
                            filters[0]
                        );
                    }
                },
                scope: this
            }]
        }, config || {});
        var queryForm = gxp.plugins.CrossLayerQueryForm.superclass.addOutput.call(this, config);
        

        featureManager.on({
            "layerchange": function(mgr, rec, schema) {
                this.resetGridPanel(queryForm);
            },
            "beforequery": function() {
                new Ext.LoadMask(queryForm.getEl(), {
                    store: featureManager.featureStore,
                    msg: this.queryMsg
                }).show();
            },
            "query": function(tool, store) {
                if (store) {
                    store.getCount() || Ext.Msg.show({
                        title: this.noFeaturesTitle,
                        msg: this.noFeaturesMessage,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                    if (this.autoHide) {
                        var ownerCt = this.outputTarget ? queryForm.ownerCt :
                            queryForm.ownerCt.ownerCt;
                        ownerCt instanceof Ext.Window && ownerCt.hide();
                    }
                }
            },
            scope: this
        });
        
        return queryForm;
    }
});

Ext.preg(gxp.plugins.CrossLayerQueryForm.prototype.ptype,
            gxp.plugins.CrossLayerQueryForm);