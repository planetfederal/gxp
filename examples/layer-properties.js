/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

var panel;
Ext.onReady(function() {
    
    var map = new GeoExt.MapPanel({
        title: "Map",
        renderTo: document.body,
        width: 512,
        height: 256,
        layers: [
            new OpenLayers.Layer.WMS(
                "Global Imagery",
                "/geoserver/wms",
                {layers: 'bluemarble'}
            )
        ],
        center: [-120, 45],
        zoom: 5
    });
    
    var record = map.layers.getAt(0);
    
    var win = new Ext.Window({
        title: "Properties: " + record.get("title"),
        width: 250,
        height: 300,
        layout: "fit",
        items: [{
            xtype: "gx_wmslayerpanel",
            layerRecord: record,
            defaults: {style: "padding: 10px"}
        }]
    });
    
    win.show();

});
