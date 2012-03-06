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
        var data = {
            metaData: this.meta
        };
        data["Symbolizers"] = [];
        for (var key in o) {
            if (key === "Polygon" || key === "Point") {
                data["Symbolizers"].push({
                    type: key, 
                    checked: o[key].stroke !== undefined ? o[key].stroke : true, 
                    subType: "Stroke", symbolizer: o[key]
                });
                data["Symbolizers"].push({
                    type: key, 
                    checked: o[key].fill !== undefined ? o[key].fill : true, 
                    subType: "Fill", symbolizer: o[key]
                });
            } else {
                data["Symbolizers"].push({
                    type: key, 
                    subType: key, 
                    symbolizer: o[key]
                });
            }
        }
        return gxp.data.SymbolReader.superclass.readRecords.call(this, data);
    }

});
