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

    border: false,

    performQuery: function() {
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
        // use baseParams so paging takes them into account
        store.baseParams = data;
        store.load();
    },

    initComponent: function() {
        var store = new Ext.data.Store({
            proxy: new GeoExt.data.ProtocolProxy({
                protocol: new OpenLayers.Protocol.CSW({
                    url: "http://demo.geonode.org/geonetwork/srv/en/csw"
                })
            }),
            reader: new GeoExt.data.CSWRecordsReader({
               fields: ['title', 'subject', 'URI', 'bounds', 'projection']
            })
        });
        this.items = [{
            xtype: 'container',
            border: false,
            height: 30,
            style: "margin-left: 5px; margin-top: 5px",
            items: [{
                xtype: "textfield",
                emptyText: "Search",
                ref: "../search",
                name: "search"
            }, {
                xtype: "button",
                text: "Search",
                style: "position: absolute; right: 5px; top: 5px;",
                handler: this.performQuery,
                scope: this
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
                store: store,
                pageSize: 100 
            }),
            loadMask: true,
            hideHeaders: true,
            store: store,
            columns: [{
                id: 'title', 
                xtype: "templatecolumn", 
                tpl: new Ext.XTemplate('<b><tpl for="title">{value}</tpl></b><br/><tpl for="subject">{value}<tpl if="xindex < xcount"><br/></tpl></tpl>'), 
                sortable: true
            }, {
                xtype: "actioncolumn",
                width: 30,
                items: [{
                    iconCls: "gxp-icon-addlayers",
                    tooltip: 'Add layer to map',
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

    addLayer: function(record) {
        var uri = record.get("URI");
        var bounds = record.get("bounds");
        var wms, layer;
        for (var key in uri) {
            var url = uri[key].value;
            if (url && url.toLowerCase().indexOf('service=wms') > 0) {
                var obj = OpenLayers.Util.createUrlObject(url);
                wms = obj.protocol + "//" + obj.host + ":" + obj.port + obj.pathname;
                // TODO remove this hack
                wms = wms.replace("geoserver-geonode-dev", "geoserver");
                // end TODO
                layer = obj.args.layers;
                break;
            }
        }
        // TODO: is this always WGS84 in DC?
        this.plugin.addWMSLayer(wms, {
            name: layer,
            title: record.get('title')[0].value,
            bbox: bounds.toArray(),
            srs: "EPSG:4326"
        });
    }

});

/** api: xtype = gxp_cataloguesearchpanel */
Ext.reg('gxp_cataloguesearchpanel', gxp.CatalogueSearchPanel);
