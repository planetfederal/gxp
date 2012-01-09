/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
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

    initComponent: function() {
        this.items = [{
            xtype: "textfield",
            ref: "search",
            name: "search"
        }, {
            xtype: "button",
            text: "Search",
            handler: function() {
                var store = this.grid.store;
                var searchValue = this.search.getValue();
                var data = { 
                    "resultType": "results", 
                    "maxRecords": 100, 
                    "Query": {
                        "Constraint": {
                            version: "1.1.0",
                            CqlText: {
                                value: "AnyText LIKE '*"+searchValue+"*'"
                            }
                        },
                        "typeNames": "gmd:MD_Metadata",
                        "ElementSetName": { 
                            "value": "full" 
                        } 
                    } 
                }; 
                store.load({params: data});
            },
            scope: this
        }, {
            xtype: "grid",
            ref: "grid",
            loadMask: true,
            store: new Ext.data.Store({
                proxy: new GeoExt.data.ProtocolProxy({ 
                    protocol: new OpenLayers.Protocol.CSW({ 
                        url: "http://demo.geonode.org/geonetwork/srv/en/csw"
                    })
                }),
                reader: new GeoExt.data.CSWRecordsReader({
                   fields: ['title', 'subject']
                })
            }),
            columns: [{
                xtype: "actioncolumn",
                width: 30,
                items: [{
                    iconCls: "gxp-icon-addlayers",
                    tooltip: 'Add layer to map',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = this.grid.store.getAt(rowIndex);
                    },
                    scope: this
                }]}, {
                    id: 'title', 
                    xtype: "templatecolumn", 
                    tpl: new Ext.XTemplate('<tpl for="title">{value}<br/></tpl>'), 
                    header: "Title", 
                    dataIndex: "title", 
                    sortable: true
                }, {
                    header: "Subject", 
                    xtype: "templatecolumn", 
                    tpl: new Ext.XTemplate('<tpl for="subject">{value}<br/></tpl>'), 
                    dataIndex: "subject", 
                    sortable: true, 
                    width:200
                }
            ],
            autoExpandColumn: 'title',
            width: 400,
            height: 300
        }];
        gxp.CatalogueSearchPanel.superclass.initComponent.apply(this, arguments);
    }

});

/** api: xtype = gxp_cataloguesearchpanel */
Ext.reg('gxp_cataloguesearchpanel', gxp.CatalogueSearchPanel);
