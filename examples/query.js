/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

OpenLayers.ProxyHost = "/proxy/?url=";

var panel, map;
Ext.onReady(function() {
    
    var map = new OpenLayers.Map("map");
    var wms = new OpenLayers.Layer.WMS(
        "Global Imagery",
        "/geoserver/wms",
        {layers: 'bluemarble'}
    );
    var vector = new OpenLayers.Layer.Vector();    
    map.addLayers([wms, vector]);
    map.setCenter(new OpenLayers.LonLat(-120, 45), 5);

    panel = new gxp.QueryPanel({
        title: "Query Panel",
        renderTo: "query",
        width: 380,
        bodyStyle: "padding: 10px",
        map: map,
        layerStore: new Ext.data.JsonStore({
            data: {
                layers: [{
                    title: "US States",
                    name: "states",
                    namespace: "http://www.openplans.org/topp",
                    url: "/geoserver/wfs",
                    schema: "/geoserver/wfs?version=1.1.0&request=DescribeFeatureType&typeName=topp:states"
                }, {
                    title: "Archaeological Sites",
                    name: "archsites",
                    namespace: "http://opengeo.org",
                    url: "/geoserver/wfs",
                    schema: "/geoserver/wfs?version=1.1.0&request=DescribeFeatureType&typeName=og:archsites"
                }]
            },
            root: "layers",
            fields: ["title", "name", "namespace", "url", "schema"]
        }),
        bbar: ["->", {
            text: "Query",
            handler: function() {
                panel.query();
            }
        }],
        listeners: {
            storeload: function(panel, store) {
                vector.destroyFeatures();
                var features = [];
                store.each(function(record) {
                    features.push(record.get("feature"));
                });
                vector.addFeatures(features);
            }
        }
    });

});
