/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires widgets/form/CSWFilterField.js
 */

/** api: (define)
 *  module = gxp
 *  class = CatalogueSearchPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: CatalogueSearchPanel(config)
 *   
 *      Create a panel for searching a CS-W.
 */
gxp.CatalogueSearchPanel = Ext.extend(Ext.Panel, {

    border: false,

    source: null,

    /* i18n */
    searchFieldEmptyText: "Search",
    searchButtonText: "Search",
    addTooltip: "Add to map",

    performQuery: function() {
        var store = this.grid.store;
        var searchValue = this.search.getValue();
        var filter = undefined;
        if (searchValue !== "") {
            filter = new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.LIKE,
                property: 'csw:AnyText',
                value: '*' + searchValue + '*'
            });
        }
        var data = {
            "resultType": "results",
            "maxRecords": 100,
            "Query": {
                "typeNames": "gmd:MD_Metadata",
                "ElementSetName": {
                    "value": "full"
                }
            }
        };
        var fullFilter = this.getFullFilter(filter);
        if (fullFilter !== undefined) {
            Ext.apply(data.Query, {
                "Constraint": {
                    version: "1.1.0",
                    Filter: fullFilter
                }
            });
        }
        // use baseParams so paging takes them into account
        store.baseParams = data;
        store.load();
    },

    getFullFilter: function(filter) {
        var filters = [];
        if (filter !== undefined) {
            filters.push(filter);
        }
        for (var key in this.filters) {
            if (key === 'extent' && this.filters[key] === 'map_extent') {
                filters.push(new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.BBOX,
                    property: 'BoundingBox',
                    /* TODO revisit axis order */
                    value: this.plugin.target.mapPanel.map.getExtent().transform(
                        this.plugin.target.mapPanel.map.getProjectionObject(), 
                        new OpenLayers.Projection("EPSG:4326")
                    )
                }));
            }
        }
        if (filters.length <= 1) {
            return filters[0];
        } else {
            return new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: filters
            });
        }
    },

    addFilter: function(filter) {
        Ext.apply(this.filters, filter);
    },

    removeFilter: function(key) {
        delete this.filters[key];
    },

    initComponent: function() {
        this.filters = {};
        this.items = [{
            xtype: 'form',
            border: false,
            ref: 'form',
            hideLabels: true,
            autoHeight: true,
            style: "margin-left: 5px; margin-top: 5px",
            items: [{
                xtype: "textfield",
                emptyText: this.searchFieldEmptyText,
                ref: "../search",
                name: "search"
            }, {
                xtype: "button",
                text: this.searchButtonText,
                style: "position: absolute; right: 5px; top: 5px;",
                handler: this.performQuery,
                scope: this
            }, {
                xtype: "fieldset",
                collapsible: true,
                collapsed: true,
                hideLabels: false,
                title: "Advanced",
                items: [{
                    xtype: 'cswfilterfield',
                    name: 'extent',
                    comboFieldLabel: "Spatial extent",
                    comboStoreData: [['map_extent', 'Filter by spatial extent of the map']],
                    target: this
                }, {
                    xtype: 'compositefield',
                    items: [{
                        xtype: "combo",
                        fieldLabel: "Filter search by",
                        store: new Ext.data.ArrayStore({
                            fields: ['id', 'value'],
                            data: [['extent', 'spatial extent']]
                        }),
                        displayField: 'value',
                        valueField: 'id',
                        mode: 'local',
                        triggerAction: 'all'
                    }, {
                        xtype: 'button',
                        iconCls: 'gxp-icon-addlayers',
                        handler: function(btn) {
                            btn.ownerCt.items.each(function(item) {
                                if (item.getXType() === "combo") {
                                    var id = item.getValue();
                                    this.form.getForm().findField(id).show();
                                }
                            }, this);
                        },
                        scope: this
                    }, {
                        xtype: 'button',
                        hidden: true,
                        iconCls: 'gxp-icon-removelayers'
                    }]
                }]
            }]
        }, {
            xtype: "grid",
            border: false,
            ref: "grid",
            bbar: new Ext.PagingToolbar({
                paramNames: {
                    start: 'startPosition', 
                    limit: 'maxRecords'
                },
                store: this.source.store,
                pageSize: 100 
            }),
            loadMask: true,
            hideHeaders: true,
            store: this.source.store,
            columns: [{
                id: 'title', 
                xtype: "templatecolumn", 
                tpl: new Ext.XTemplate('<b>{title}</b><br/>{subject}'), 
                sortable: true
            }, {
                xtype: "actioncolumn",
                width: 30,
                items: [{
                    iconCls: "gxp-icon-addlayers",
                    tooltip: this.addTooltip,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = this.grid.store.getAt(rowIndex);
                        this.addLayer(rec);
                    },
                    scope: this
                }]
            }],
            autoExpandColumn: 'title',
            width: 400,
            height: 300
        }];
        gxp.CatalogueSearchPanel.superclass.initComponent.apply(this, arguments);
    },

    findWMS: function(links) {
        var url = null, name = null;
        for (var i=0, ii=links.length; i<ii; ++i) {
            var link = links[i];
            if (link && link.toLowerCase().indexOf('service=wms') > 0) {
                var obj = OpenLayers.Util.createUrlObject(link);
                url = obj.protocol + "//" + obj.host + ":" + obj.port + obj.pathname;
                // TODO remove this hack
                url = url.replace("geoserver-geonode-dev", "geoserver");
                // end TODO
                name = obj.args.layers;
                break;
            }
        }
        if (url !== null && name !== null) {
            return {
                url: url,
                name: name
            };
        } else {
            return false;
        }
    },

    addLayer: function(record) {
        var uri = record.get("URI");
        var bounds = record.get("bounds");
        var wmsInfo = this.findWMS(uri);
        if (wmsInfo === false) {
            // fallback to dct:references
            var references = record.get("references");
            wmsInfo = this.findWMS(references);
        }
        if (wmsInfo !== false) {
            // TODO: is this always WGS84 in DC?
            this.plugin.addWMSLayer(Ext.apply({
                title: record.get('title')[0],
                bbox: bounds.toArray(),
                srs: "EPSG:4326"
            }, wmsInfo));
        }
    }

});

/** api: xtype = gxp_cataloguesearchpanel */
Ext.reg('gxp_cataloguesearchpanel', gxp.CatalogueSearchPanel);
