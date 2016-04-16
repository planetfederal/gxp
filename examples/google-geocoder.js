var map = new OpenLayers.Map({
    div: "map",
    theme: null,
    layers: [new OpenLayers.Layer.OSM()],
    center: new OpenLayers.LonLat(-8237542, 4970279),
    zoom: 12
});

var combo1 = new gxp.form.GoogleGeocoderComboBox({
    renderTo: "combo1",
    valueField: "viewport", /* zoom to bounds */
    map: map,
    width: 200
});

var combo2 = new gxp.form.GoogleGeocoderComboBox({
    renderTo: "combo2",
    valueField: "viewport",
    bounds: new OpenLayers.Bounds(-74.04167, 40.69547, -73.86589, 40.87743),
    map: map,
    width: 200
});
