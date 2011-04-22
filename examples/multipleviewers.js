/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

// create a viewport with 2 columns
new Ext.Viewport({
    layout:'hbox',
    layoutConfig: {
        align : 'stretch',
        pack  : 'start'
    },
    items: [
        {id: 'viewer1', flex: 1, title: "First viewer"},
        {id: 'viewer2', flex: 1, title: "Second viewer"}
    ]
});

var app = new gxp.Viewer({
    portalConfig: {renderTo: Ext.getCmp('viewer1').body, height: Ext.getCmp('viewer1').body.getHeight()},
    portalItems: ["map1"],
    mapItems: [
        {
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        }
    ],
    sources: {
        osm: {
            ptype: "gxp_osmsource"
        }
    },
    map: {
        id: "map1",
        region: "center",
        projection: "EPSG:900913",
        units: "m",
        numZoomLevels: 21,
        maxResolution: 156543.03390625,
        maxExtent: [
            -20037508.34, -20037508.34,
            20037508.34, 20037508.34
        ],
        extent: [-13650159, 4534735, -13609227, 4554724],
        layers: [{
            source: "osm",
            name: "mapnik"
        }]
    }
});

var app2 = new gxp.Viewer({
    portalConfig: {renderTo: Ext.getCmp('viewer2').body, height: Ext.getCmp('viewer2').body.getHeight()},
    portalItems: ["map2", {region: "south", xtype: 'panel', height: 200, title: "A south panel"}],
    mapItems: [
        {
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        }
    ],
    sources: {
        osm: {
            ptype: "gxp_osmsource"
        }
    },
    map: {
        id: "map2",
        region: "center",
        projection: "EPSG:900913",
        units: "m",
        numZoomLevels: 21,
        maxResolution: 156543.03390625,
        maxExtent: [
            -20037508.34, -20037508.34,
            20037508.34, 20037508.34
        ],
        extent: [-13650159, 4534735, -13609227, 4554724],
        layers: [{
            source: "osm",
            name: "mapnik"
        }]
    }
});
