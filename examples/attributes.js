/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

var store;
Ext.onReady(function() {
    
    // create a new attributes store
    store = new gxp.data.AttributesStore({
        url: "data/describe_feature_type.xml"
    });
    store.load();

    // create a grid to display records from the store
    var grid = new Ext.grid.GridPanel({
        title: "Feature Attributes",
        store: store,
        cm: new Ext.grid.ColumnModel([
            {id: "name", header: "Name", dataIndex: "name", sortable: true},
            {id: "type", header: "Type", dataIndex: "type", sortable: true}
        ]),
        autoExpandColumn: "name",
        renderTo: "panel",
        height: 300,
        width: 350
    });    

});
