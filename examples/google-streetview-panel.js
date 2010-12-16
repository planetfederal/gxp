/**
 * Copyright (c) 2008-2010 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

var map, streetViewPanel, mapPanel;
Ext.onReady(function() {

    var map = new OpenLayers.Map();
    var layer = new OpenLayers.Layer.WMS(
        "Global Imagery",
        "http://demo.opengeo.org/geoserver/wms",
        {layers: 'bluemarble'}
    );
    map.addLayer(layer);

    mapPanel = new GeoExt.MapPanel({
        title: "Map",
        renderTo: "container",
        height: 400,
        width: 600,
        map: map,
        center: new OpenLayers.LonLat(5, 45),
        zoom: 4
    });
    
    
    streetViewPanel = new gxp.GoogleStreetViewPanel({
        location: map.getCenter()
    });

    var popup = new GeoExt.Popup({
        title: "Street View",
        location: map.getCenter(),
        width: 300,
        height: 300,
        collapsible: true,
        map: map,
        items: [streetViewPanel]
    });
    popup.show();


});
