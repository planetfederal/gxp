var symbolizer = {
    Point: {
        graphicName: "star",
        pointRadius: 8,
        fillColor: "yellow",
        strokeColor: "red",
        strokeWidth: 1
    },
    Line: {
        strokeColor: "#669900",
        strokeWidth: 3
    },
    Polygon: {
        fillColor: "olive",
        fillOpacity: 0.25,
        strokeColor: "#666666",
        strokeWidth: 2,
        strokeDashstyle: "dot"
    },
    Text: {
        label: "Ab",
        labelAlign: "cm",
        fontColor: "#FF0000"
    }
};

Ext.onReady(function() {
    var grid = new gxp.grid.SymbolGrid({
        symbolizer: symbolizer,
        height: 350,
        width: 400,
        renderTo: "grid"
    });
});
