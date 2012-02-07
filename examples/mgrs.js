var panel = new GeoExt.MapPanel({
    renderTo: "panel",
    width: 450,
    height: 300,
    layers: [new OpenLayers.Layer.OSM()],
    map: {
        controls: [
            new OpenLayers.Control.PanPanel(),
            new OpenLayers.Control.ZoomPanel(),
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.MousePosition({
                formatOutput: function(lonlat) {
                    return gxp.util.MGRS.forward(lonlat.lat, lonlat.lon);
                }
            })
        ],
        displayProjection: "EPSG:4326"
    }, 
    extent: new OpenLayers.Bounds(-180, -90, 180, 90).transform("EPSG:4326", "EPSG:3857"),
    tbar: [{
        xtype: "textfield",
        emptyText: "Enter MGRS reference",
        ref: "../mgrsField"
    }],
    keys: [{
        key: [Ext.EventObject.ENTER],
        handler: function() {
            if (Ext.EventObject.getTarget() === panel.mgrsField.getEl().dom) {
                var bbox = gxp.util.MGRS.inverse(panel.mgrsField.getValue());
                panel.map.zoomToExtent(
                    new OpenLayers.Bounds(bbox.left, bbox.bottom, bbox.right, bbox.top).transform("EPSG:4326", "EPSG:3857")
                );
            }
        }
    }]
    
});