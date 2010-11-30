var app;
Ext.onReady(function() {
    app = new gxp.Viewer({
        portalConfig: {
            renderTo: document.body,
            layout: "border",
            width: 800,
            height: 465,
            
            // by configuring items here, we don't need to configure portalItems
            // and save a wrapping container
            items: [{
                // a TabPanel with the map and the layer tree
                id: "centerpanel",
                xtype: "tabpanel",
                region: "center",
                activeTab: 0, // map needs to be visible on initialization
                border: true,
                items: ["mymap"]
            }, {
                // container for the FeatureGrid
                id: "grid",
                xtype: "container",
                layout: "fit",
                region: "south",
                height: 150,
            }, {
                // container for the queryform
                id: "query",
                xtype: "container",
                layout: "fit",
                region: "west",
                width: 310
            }],
            bbar: {id: "mybbar"}
        },
        
        // configuration of all tool plugins for this application
        tools: [{
            ptype: "gx_layertree",
            outputConfig: {
                title: "Layers",
                id: "tree",
                tbar: [] // we will add buttons to "tree.bbar" later
            },
            outputTarget: "centerpanel"
        }, {
            ptype: "gx_removelayer",
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        }, {
            ptype: "gx_wmsgetfeatureinfo",
            outputConfig: {
                width: 400,
                height: 200
            },
            actionTarget: "map.tbar", // this is the default, could be omitted
            toggleGroup: "layertools"
        }, {
            // shared FeatureManager for feature editing, grid and querying
            ptype: "gx_featuremanager",
            id: "featuremanager",
            autoLoadFeatures: true
        }, {
            ptype: "gx_featureeditor",
            featureManager: "featuremanager",
            autoLoadFeatures: true, // no need to "check out" features
            outputConfig: {panIn: false},
            toggleGroup: "layertools"
        }, {
            ptype: "gx_featuregrid",
            featureManager: "featuremanager",
            outputTarget: "grid"
        }, {
            ptype: "gx_queryform",
            featureManager: "featuremanager",
            outputTarget: "query"
        }, {
            // not a useful tool - just a demo for additional items
            actionTarget: "mybbar", // ".bbar" would also work
            actions: [{text: "Click me - I'm a tool on the portal's bbar"}]
        }],
        
        // layer sources
        defaultSourceType: "gx_wmssource",
        sources: {
            local: {
                url: "/geoserver/wms"
            },
            google: {
                ptype: "gx_googlesource"
            }
        },
        
        // map and layers
        map: {
            id: "mymap", // id needed to reference map in portalConfig above
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
