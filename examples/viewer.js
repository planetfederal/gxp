var app;
Ext.onReady(function() {
    app = new gxp.Viewer({
        portalConfig: {
            renderTo: document.body,
            width: 500,
            height: 300
        },
        sources: {
            local: {
                ptype: "gx-layersource-wms",
                url: "/geoserver/wms"
            }
        },
        map: {
            layers: [{
                source: "local",
                name: "topp:states"
            }]
        }
    });
});
