var symbolizers = [];
symbolizers.push(new OpenLayers.Symbolizer.Point({
    graphicName: "star",
    pointRadius: 8,
    fillColor: "yellow",
    strokeColor: "red",
    strokeWidth: 1
}));
symbolizers.push(new OpenLayers.Symbolizer.Line({
    strokeColor: "#669900",
    strokeWidth: 3
}));
symbolizers.push(new OpenLayers.Symbolizer.Polygon({
    fillColor: "olive",
    fillOpacity: 0.25,
    strokeColor: "#666666",
    strokeWidth: 2,
    strokeDashstyle: "dot"
}));
symbolizers.push(new OpenLayers.Symbolizer.Text({
    label: "Ab",
    labelAlign: "cm",
    fontColor: "#FF0000"
}));

Ext.onReady(function() {
    var grid = new gxp.grid.SymbolGrid({
        symbolizers: symbolizers,
        height: 350,
        width: 400,
        renderTo: "grid"
    });
});
