/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

Ext.ns("gxp.data");

/** api: (define)
 *  module = gxp.data
 *  class = SymbolReader
 *  extends = Ext.data.JsonReader
 */

/** api: constructor
 *  .. class:: SymbolReader(config)
 *
 *  Parses symbolizers and splits them up in sub types (such as fill and stroke).
 */
gxp.data.SymbolReader = Ext.extend(Ext.data.JsonReader, {

    /** private: method[readRecords]
     *  Override to split up the symbolizers in sub types.
     */
    readRecords: function(o) {
        var type = "Symbolizers";
        this.raw = o;
        Ext.applyIf(this.meta, gxp.data.SymbolReader.metaData[type]);
        var data = {metaData: this.meta};
        data[type] = [];
        for (var i=0,ii=o.length;i<ii;++i) {
            var symbolizer = o[i];
            var fullSymbolizer = symbolizer.clone();
            var key = symbolizer.CLASS_NAME.substring(symbolizer.CLASS_NAME.lastIndexOf(".")+1);
            if (key === "Polygon" || key === "Point") {
                var strokeSym = symbolizer.clone();
                strokeSym.fill = false;
                data[type].push({
                    type: key, 
                    checked: fullSymbolizer.stroke !== undefined ? fullSymbolizer.stroke : true, 
                    subType: "Stroke", 
                    symbolizer: strokeSym,
                    fullSymbolizer: fullSymbolizer,
                    originalSymbolizer: symbolizer
                    
                });
                var fillSym = fullSymbolizer.clone();
                fillSym.stroke = false;
                data[type].push({
                    type: key, 
                    checked: fullSymbolizer.fill !== undefined ? fullSymbolizer.fill : true, 
                    subType: "Fill", 
                    symbolizer: fillSym,
                    fullSymbolizer: fullSymbolizer,
                    originalSymbolizer: symbolizer
                });
            } else if (key === "Line") {
                data[type].push({
                    type: key,
                    subType: "Stroke",
                    checked: true,
                    symbolizer: fullSymbolizer,
                    fullSymbolizer: fullSymbolizer,
                    originalSymbolizer: symbolizer
                });
            } else if (key === "Text") {
                fullSymbolizer.label = "Ab";
                if (fullSymbolizer.fillColor || fullSymbolizer.graphicName) {
                    fullSymbolizer.graphic = true;
                }
                var labelSym = fullSymbolizer.clone();
                labelSym.graphic = false;
                data[type].push({
                    type: key,
                    subType: "Label",
                    checked: true,
                    symbolizer: labelSym,
                    fullSymbolizer: fullSymbolizer,
                    originalSymbolizer: symbolizer
                });
                var graphicSym = fullSymbolizer.clone();
                graphicSym.label = "";
                data[type].push({
                    type: key, 
                    subType: "Graphic", 
                    checked: fullSymbolizer.graphic,
                    symbolizer: graphicSym,
                    fullSymbolizer: fullSymbolizer,
                    originalSymbolizer: symbolizer
                });
            }
        }
        return gxp.data.SymbolReader.superclass.readRecords.call(this, data);
    }

});

/** private: constant[metaData]
 *  ``Object`` MetaData configuration
 */
gxp.data.SymbolReader.metaData = {
    Symbolizers: {
        root: "Symbolizers",
        fields: [
            {name: "type"},
            {name: "checked"},
            {name: "subType"},
            {name: "symbolizer"},
            {name: "fullSymbolizer"},
            {name: "originalSymbolizer"}
        ],
        storeToData: function(store) {
            var symbolizers = [];
            var types = [];
            store.each(function(record) {
                var type = record.get("type"),
                    subType = record.get("subType").toLowerCase(),
                    checked = record.get("checked"),
                    symbolizer = record.get('originalSymbolizer'),
                    subSymbolizer = record.get('symbolizer');
                var query = store.query('type', type);
                var count = query.length;
                var childVisible = false;
                for (var i=0,ii=query.items.length;i<ii; ++i) {
                    var r = query.items[i];
                    if (r.get('checked') === true) {
                        childVisible = true;
                        break;
                    }
                }
                if (subType !== "label") {
                    symbolizer[subType] = checked;
                }
                // filter out symbolizers in the following cases:
                // 1. the symbolizer was already added
                // 2. any symbolizer should be filtered out if all of their subTypes are unchecked
                if (types.indexOf(type) === -1 && childVisible) {
                    symbolizers.push(symbolizer);
                }
                types.push(record.get("type"));
            });
            return symbolizers;
        }
    }
};
