/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

var panel, map;

Ext.onReady(function() {
    
    var map = new OpenLayers.Map("map");
    var layer = new OpenLayers.Layer.WMS(
        "Global Imagery",
        "http://demo.opengeo.org/geoserver/wms",
        {layers: 'bluemarble'}
    );
    map.addLayer(layer);
    map.setCenter(new OpenLayers.LonLat(5, 45), 3);

    panel = new Ext.Panel({
        title: "Query Panel",
        renderTo: "query",
        width: 380,
        bodyStyle: "padding: 10px",
        items: [{
            xtype: "gxp_querypanel",
            border: false,
            layers: new Ext.data.JsonStore({
                data: {
                    layers: [{
                        name: "layer_one", title: "Layer One"
                    }, {
                        name: "layer_two", title: "Layer Two"
                    }]
                },
                root: "layers",
                fields: ["title", "name"]
            }),
            map: map,
            // this will soon come from the layer record
            attributes: new gxp.data.AttributesStore({
                url: "data/describe_feature_type.xml",
                ignore: {name: "the_geom"}
            })
        }],
        bbar: ["->", {
            text: "Query",
            handler: function() {
                // show filter encoding
            }
        }]
    });

});
