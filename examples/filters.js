/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

var filter = new OpenLayers.Filter.Logical({
    type: OpenLayers.Filter.Logical.OR,
    filters: [
        new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "population",
            value: 1000
        }),
        new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.LESS_THAN,
            property: "income",
            value: 1000
        })
    ]
});

var feWin = null;
var format = new OpenLayers.Format.Filter();
function showFE(panel) {
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

Ext.onReady(function() {

    var panel1 = new Ext.Panel({
        title: "Filter Builder (with groups)",
        renderTo: "panel1",
        width: 370,
        items: [{
            xtype: "gx_filterbuilder",
            filter: filter.clone(),
            attributes: new GeoExt.data.AttributeStore({
                url: "data/describe_feature_type.xml",
                ignore: {name: "the_geom"}
            })
        }],
        bbar: ["->", {
            text: "View Filter Encoding",
            handler: function() {
                showFE(panel1);
            }
        }]
    });

    var panel2 = new Ext.Panel({
        title: "Filter Builder (no groups)",
        renderTo: "panel2",
        width: 250,
        items: [{
            xtype: "gx_filterbuilder",
            allowGroups: false,
            filter: filter.clone(),
            attributes: new GeoExt.data.AttributeStore({
                url: "data/describe_feature_type.xml",
                ignore: {name: "the_geom"}
            })
        }],
        bbar: ["->", {
            text: "View Filter Encoding",
            handler: function() {
                showFE(panel2);
            }
        }]
    });
});
