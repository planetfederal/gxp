var format = new OpenLayers.Format.SLD.v1_0_0();
var sldWin;
function showSLD(panel) {
    var symbolizer = panel.symbolizer;
    var node = format.writeNode("sld:TextSymbolizer", symbolizer);
    var text = OpenLayers.Format.XML.prototype.write.apply(format, [node]);
    if(!sldWin) {
        sldWin = new Ext.Window({
            title: "SLD",
            layout: "fit",
            closeAction: "hide",
            height: 300,
            width: 450,
            plain: true,
            modal: true,
            items: [{
                xtype: "textarea",
                value: text
            }]
        });
    } else {
        sldWin.items.items[0].setValue(text);
    }
    sldWin.show();
}

Ext.onReady(function() {

    var panel = new gxp.TextSymbolizer({
        title: "Text Symbolizer",
        renderTo: "panel",
        width: 235,
        border: true,
        bodyStyle: {padding: 10},
        attributes: new GeoExt.data.AttributeStore({
            url: "data/describe_feature_type.xml",
            ignore: {name: "the_geom"}
        }),
        bbar: ["->", {
            text: "Show SLD",
            handler: function() {
                showSLD(panel);
            }
        }]
    });

});
