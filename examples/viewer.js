var app;
Ext.onReady(function() {
    app = new gxp.Viewer({
        portalConfig: {
            renderTo: document.body,
            width: 500,
            height: 300
        },
        defaultSourceType: "gx-wmssource",
        sources: {
            local: {
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
