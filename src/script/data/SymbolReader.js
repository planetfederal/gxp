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
            var key = symbolizer.CLASS_NAME.substring(symbolizer.CLASS_NAME.lastIndexOf(".")+1);
            if (key === "Polygon" || key === "Point") {
                var strokeSym = symbolizer.clone();
                strokeSym.fill = false;
                data[type].push({
                    type: key, 
                    checked: symbolizer.stroke !== undefined ? symbolizer.stroke : true, 
                    subType: "Stroke", 
                    symbolizer: strokeSym,
                    fullSymbolizer: symbolizer
                    
                });
                var fillSym = symbolizer.clone();
                fillSym.stroke = false;
                data[type].push({
                    type: key, 
                    checked: symbolizer.fill !== undefined ? symbolizer.fill : true, 
                    subType: "Fill", 
                    symbolizer: fillSym,
                    fullSymbolizer: symbolizer
                });
            } else if (key === "Line") {
                data[type].push({
                    type: key,
                    subType: "Stroke",
                    checked: true,
                    symbolizer: symbolizer,
                    fullSymbolizer: symbolizer
                });
            } else if (key === "Text") {
                // since we are gonna manipulate the label for display purposes
                // we need to store the original value and restore it later on.
                symbolizer.originalLabel = symbolizer.label;
                symbolizer.label = "Ab";
                if (symbolizer.fillColor || symbolizer.graphicName) {
                    symbolizer.graphic = true;
                }
                var labelSym = symbolizer.clone();
                labelSym.graphic = false;
                data[type].push({
                    type: key,
                    subType: "Label",
                    checked: true,
                    symbolizer: labelSym,
                    fullSymbolizer: symbolizer
                });
                var graphicSym = symbolizer.clone();
                graphicSym.label = "";
                data[type].push({
                    type: key, 
                    subType: "Graphic", 
                    checked: symbolizer.graphic,
                    symbolizer: graphicSym,
                    fullSymbolizer: symbolizer
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
            {name: "fullSymbolizer"}
        ],
        storeToData: function(store) {
            store.sort("type", "ASC");
            var symbolizers = [];
            var types = [];
            store.each(function(record) {
                var type = record.get("type"),
                    subType = record.get("subType"),
                    checked = record.get("checked"),
                    symbolizer = record.get('fullSymbolizer'),
                    subSymbolizer = record.get('symbolizer');
                var count = store.query('type', type).length;
                if (types.indexOf(type) === -1 && !(count === 1 && !checked)) {
                    symbolizers.push(symbolizer);
                }
                types.push(record.get("type"));
            });
            return symbolizers;
        }
    }
};
