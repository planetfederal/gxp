/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */


var feWin = null;
var format = new OpenLayers.Format.Filter();
function showFE() {
    var filter = panel.getComponent(0).getFilter();
    var node = format.write(filter);
    var text = OpenLayers.Format.XML.prototype.write.apply(format, [node]);
    if(!feWin) {
        feWin = new Ext.Window({
            title: "Filter Encoding",
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
        feWin.items.items[0].setValue(text);
    }
    feWin.show();
}

var panel, map;
Ext.onReady(function() {
    
    var map = new OpenLayers.Map("map");
    var layer = new OpenLayers.Layer.WMS(
        "Global Imagery",
        "http://demo.opengeo.org/geoserver/wms",
        {layers: 'bluemarble'}
    );
    map.addLayer(layer);
    map.setCenter(new OpenLayers.LonLat(5, 45), 3);

    panel = new Ext.Panel({
        title: "Query Panel",
        renderTo: "query",
        width: 380,
        bodyStyle: "padding: 10px",
        items: [{
            xtype: "gxp_querypanel",
            border: false,
            layers: new Ext.data.JsonStore({
                data: {
                    layers: [{
                        name: "layer_one", title: "Layer One"
                    }, {
                        name: "layer_two", title: "Layer Two"
                    }]
                },
                root: "layers",
                fields: ["title", "name"]
            }),
            map: map,
            // this will soon come from the layer record
            attributes: new gxp.data.AttributesStore({
                url: "data/describe_feature_type.xml",
                ignore: {name: "the_geom"}
            })
        }],
        bbar: ["->", {
            text: "Query",
            handler: function() {
                showFE();
            }
        }]
    });

});
