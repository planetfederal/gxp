var app;
Ext.onReady(function() {
    app = new gxp.Viewer({
        portalConfig: {
            renderTo: document.body,
            width: 500,
            height: 450,
            bbar: {id: "mybbar"}
        },
        portalItems: [{
            xtype: "tabpanel",
            id: "maincontent",
            region: "center",
            activeTab: 0,
            items: ["mymap"]
        }, {
            id: "gridcontainer",
            region: "south",
            layout: "fit",
            border: false,
            height: 150
        }],
        tools: [{
            ptype: "gx_layertree",
            outputConfig: {
                title: "Layers",
                id: "tree",
                tbar: []
            },
            outputTarget: "maincontent"
        }, {
            ptype: "gx_removelayer",
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        }, {
            ptype: "gx_wmsgetfeatureinfo",
            outputConfig: {
                width: 400,
                height: 200
            },
            actionTarget: "map.tbar", // this is the default
            toggleGroup: "layertools"
        }, {
            ptype: "gx_featuremanager",
            id: "featuremanager"
        }, {
            ptype: "gx_featureeditor",
            featureManager: "featuremanager",
            autoLoadFeatures: true,
            outputConfig: {panIn: false},
            toggleGroup: "layertools"
        }, {
            ptype: "gx_featuregrid",
            featureManager: "featuremanager",
            outputTarget: "gridcontainer"
        }, {
            actionTarget: "mybbar", // ".bbar" would also work
            actions: [{text: "Click me - I'm a tool on the portal's bbar"}]
        }],
        defaultSourceType: "gx_wmssource",
        sources: {
            local: {
                url: "/geoserver/wms"
            },
            google: {
                ptype: "gx_googlesource"
            }
        },
        map: {
            id: "mymap",
            title: "Map",
            projection: "EPSG:900913",
            units: "m",
            maxResolution: 156543.0339,
            center: [-10764594.758211, 4523072.3184791],
            zoom: 3,
            layers: [{
                source: "google",
                name: "TERRAIN",
                group: "background"
            }, {
                source: "local",
                name: "usa:states",
                selected: true
            }]
        }
    });
});
