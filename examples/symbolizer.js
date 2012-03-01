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
    }
};

Ext.ns("GeoExt.data");

GeoExt.data.SymbolReader = Ext.extend(Ext.data.JsonReader, {

    readRecords: function(o) {
        var data = {metaData: this.meta};
        data["Symbolizers"] = [];
        for (var key in o) {
            data["Symbolizers"].push({type: key, symbolizer: o[key]});
        }
        return GeoExt.data.SymbolReader.superclass.readRecords.call(this, data);
    }

});


var store = new Ext.data.Store({
    reader: new GeoExt.data.SymbolReader({
        root: "Symbolizers",
        fields: [
            {name: "type"},
            {name: "symbolizer"}
        ]
    }),
    data: symbolizer
});

    function renderFeature(value, p, r) {
        var id = Ext.id();
        (function() {
            var symbolizer = r.get("symbolizer");
            var renderer = new GeoExt.FeatureRenderer({
                renderTo: id,
                width: 20,
                height: 20,
                symbolType: r.get("type"),
                symbolizers: [symbolizer]
            });
        }).defer(25);
        return (String.format('<div id="{0}"></div>', id));
    }

Ext.onReady(function() {
    var grid = new Ext.grid.GridPanel({
        store: store,
        height: 300,
        width: 300,
        viewConfig: {forceFit:true},
        columns: [
            {id:'type', header: "Symbolizer Type", width: 60, dataIndex: 'type'},
            {id: 'preview', header: "Preview", width: 20, renderer: renderFeature}
        ],
        renderTo: "grid"
    });

    new gxp.FillSymbolizer({
        renderTo: "fill",
        labelAlign: "right",
        labelWidth: 50,
        width: 190
    });

    new gxp.StrokeSymbolizer({
        renderTo: "stroke",
        labelAlign: "right",
        labelWidth: 50,
        width: 190
    });


    // create line swatch that opens line symbolizer in new window when clicked
    var lineWin;
    var lineSwatch = new GeoExt.FeatureRenderer({
        symbolType: "Line",
        symbolizers: [symbolizer["Line"]],
        renderTo: "line",
        listeners: {
            click: function(renderer) {
                if(!lineWin) {
                    lineWin = new Ext.Window({
                        title: "Line Symbolizer",
                        width: 230,
                        plain: true,
                        closeAction: "hide",
                        items: [{
                            xtype: "gxp_linesymbolizer",
                            symbolizer: renderer.symbolizers[0],
                            bodyStyle: {padding: 10},
                            border: false,
                            defaults: {
                                labelWidth: 50,
                                labelAlign: "right"
                            },
                            listeners: {
                                change: function(symbolizer) {
                                    lineSwatch.setSymbolizers([symbolizer]);
                                }
                            }
                        }]
                    });
                }
                lineWin.show();
            }
        }
    });

    // create poly swatch that opens polygon symbolizer in new window when clicked
    var polyWin;
    var polySwatch = new GeoExt.FeatureRenderer({
        symbolType: "Polygon",
        symbolizers: [symbolizer["Polygon"]],
        renderTo: "polygon",
        listeners: {
            click: function(renderer) {
                if(!polyWin) {
                    polyWin = new Ext.Window({
                        title: "Polygon Symbolizer",
                        width: 230,
                        plain: true,
                        closeAction: "hide",
                        items: [{
                            xtype: "gxp_polygonsymbolizer",
                            symbolizer: renderer.symbolizers[0],
                            bodyStyle: {padding: 10},
                            border: false,
                            defaults: {
                                labelWidth: 50,
                                labelAlign: "right"
                            },
                            listeners: {
                                change: function(symbolizer) {
                                    polySwatch.setSymbolizers([symbolizer]);
                                }
                            }
                        }]
                    });
                }
                polyWin.show();
            }
        }
    });

    // create point swatch that opens point symbolizer in new window when clicked
    var pointWin;
    var pointSwatch = new GeoExt.FeatureRenderer({
        symbolType: "Point",
        symbolizers: [symbolizer["Point"]],
        renderTo: "point",
        listeners: {
            click: function(renderer) {
                if(!pointWin) {
                    pointWin = new Ext.Window({
                        title: "Point Symbolizer",
                        width: 230,
                        shadow: false,
                        plain: true,
                        closeAction: "hide",
                        items: [{
                            xtype: "gxp_pointsymbolizer",
                            symbolizer: renderer.symbolizers[0],
                            pointGraphics: [
                                {display: "circle", value: "circle", mark: true, preview: "../theme/img/circle.gif"},
                                {display: "square", value: "square", mark: true, preview: "../theme/img/square.gif"},
                                {display: "triangle", value: "triangle", mark: true, preview: "../theme/img/triangle.gif"},
                                {display: "star", value: "star", mark: true, preview: "../theme/img/star.gif"},
                                {display: "cross", value: "cross", mark: true, preview: "../theme/img/cross.gif"},
                                {display: "x", value: "x", mark: true, preview: "../theme/img/x.gif"},
                                {display: "magnifier", value: "../theme/img/magnifier.png", preview: "../theme/img/magnifier.png"},
                                {display: "external"}
                            ],
                            bodyStyle: {padding: 10},
                            border: false,
                            labelWidth: 50,
                            labelAlign: "right",
                            defaults: {
                                labelWidth: 50,
                                labelAlign: "right"
                            },
                            listeners: {
                                change: function(symbolizer) {
                                    pointSwatch.setSymbolizers([symbolizer]);
                                }
                            }
                        }]
                    });
                }
                pointWin.show();
            }
        }
    });

});
