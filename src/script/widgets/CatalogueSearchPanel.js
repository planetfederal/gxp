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
            name: "search"
        }, {
            xtype: "button",
            text: "Search"
        }, {
            xtype: "grid",
            store: new Ext.data.Store({
                reader: new GeoExt.data.CSWRecordsReader({
                   fields: ['title', 'subject']
                }),
                url: "data/cswrecords.xml",
                autoLoad: true
            }),
            columns: [
                {id: 'title', xtype: "templatecolumn", tpl: new Ext.XTemplate('<tpl for="title">{value}<br/></tpl>'), header: "Title", dataIndex: "title", sortable: true},
                {header: "Subject", xtype: "templatecolumn", tpl: new Ext.XTemplate('<tpl for="subject">{value}<br/></tpl>'), dataIndex: "subject", sortable: true, width: 300}
            ],
            autoExpandColumn: 'title',
            width: 300,
            height: 300
        }];
        gxp.CatalogueSearchPanel.superclass.initComponent.apply(this, arguments);
    }

});

/** api: xtype = gxp_cataloguesearchpanel */
Ext.reg('gxp_cataloguesearchpanel', gxp.CatalogueSearchPanel);
