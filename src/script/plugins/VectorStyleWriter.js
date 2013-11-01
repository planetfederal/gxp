/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires util.js
 * @requires plugins/StyleWriter.js
 */

Ext.namespace("gxp.plugins");

/** api: (define)
 *  module = gxp.plugins
 *  class = VectorStyleWriter
 */

/** api: (extends)
 *  plugins/StyleWriter.js
 */

/** api: constructor
 *  .. class:: VectorStyleWriter(config)
 *
 *      Save styles from :class:`gxp.VectorStylesDialog` or similar classes that
 *      have a ``layerRecord`` and a ``stylesStore`` with a ``userStyle``
 *      field. The plugin provides a save method, which will save to the Feature-styles in the associated
 *      Vector Layer, thereby redrawing these Features.
 */
gxp.plugins.VectorStyleWriter = Ext.extend(gxp.plugins.StyleWriter, {

    /** private: method[constructor]
     */
    constructor: function (config) {
        this.initialConfig = config;
        Ext.apply(this, config);

        gxp.plugins.VectorStyleWriter.superclass.constructor.apply(this, arguments);
    },


    /** private: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function (target) {
        gxp.plugins.VectorStyleWriter.superclass.init.apply(this, arguments);

        target.on({
            "beforesaved": this.write,
            "saved": this.assignStyles,
            scope: this
        });
    },

    /** api: method[write]
     *  :arg options: ``Object``
     *
     *  Saves the styles of the target's ``layerRecord`` using GeoServer's
     *  RESTconfig API.
     *
     *  Supported options:
     *
     *  * defaultStyle - ``String`` If set, the default style will be set.
     *  * success - ``Function`` A function to call when all styles were
     *    written successfully.
     *  * scope - ``Object`` A scope to call the ``success`` function with.
     */
    write: function (options) {
        this.target.stylesStore.commitChanges();
        this.target.fireEvent("saved", this.target, this.target.selectedStyle.get("name"));
        return;

//        delete this._failed;
//        options = options || {};
//        var dispatchQueue = [];
//        var store = this.target.stylesStore;
//        store.each(function(rec) {
//            (rec.phantom || store.modified.indexOf(rec) !== -1) &&
//                this.writeStyle(rec, dispatchQueue);
//        }, this);
//        var success = function() {
//            var target = this.target;
//            if (this._failed !== true) {
//                // we don't need any callbacks for deleting styles.
//                this.deleteStyles();
//                var modified = this.target.stylesStore.getModifiedRecords();
//                for (var i=modified.length-1; i>=0; --i) {
//                    // mark saved
//                    modified[i].phantom = false;
//                }
//                target.stylesStore.commitChanges();
//                options.success && options.success.call(options.scope);
//                target.fireEvent("saved", target, target.selectedStyle.get("name"));
//            } else {
//                target.fireEvent("savefailed", target, target.selectedStyle.get("name"));
//            }
//        };
//        if(dispatchQueue.length > 0) {
//            gxp.util.dispatch(dispatchQueue, function() {
//                this.assignStyles(options.defaultStyle, success);
//            }, this);
//        } else {
//            this.assignStyles(options.defaultStyle, success);
//        }
    },

    /** private: method[writeStyle]
     *  :arg styleRec: ``Ext.data.Record`` the record from the target's
     *      ``stylesStore`` to write
     *  :arg dispatchQueue: ``Array(Function)`` the dispatch queue the write
     *      function is added to.
     *
     *  This method does not actually write styles, it just adds a function to
     *  the provided ``dispatchQueue`` that will do so.
     */
    writeStyle: function (styleRec, dispatchQueue) {
        var styleName = styleRec.get("userStyle").name;
//        dispatchQueue.push(function(callback, storage) {
//            Ext.Ajax.request({
//                method: styleRec.phantom === true ? "POST" : "PUT",
//                url: this.baseUrl + "/styles" + (styleRec.phantom === true ?
//                    "" : "/" + styleName + ".xml"),
//                headers: {
//                    "Content-Type": "application/vnd.ogc.sld+xml; charset=UTF-8"
//                },
//                xmlData: this.target.createSLD({
//                    userStyles: [styleName]
//                }),
//                failure: function() {
//                    this._failed = true;
//                    callback.call(this);
//                },
//                success: styleRec.phantom === true ? function(){
//                    Ext.Ajax.request({
//                        method: "POST",
//                        url: this.baseUrl + "/layers/" +
//                            this.target.layerRecord.get("name") + "/styles.json",
//                        jsonData: {
//                            "style": {
//                                "name": styleName
//                            }
//                        },
//                        failure: function() {
//                            this._failed = true;
//                            callback.call(this);
//                        },
//                        success: callback,
//                        scope: this
//                    });
//                } : callback,
//                scope: this
//            });
//        });
    },

    /** private: method[assignStyles]
     *  :arg defaultStyle: ``String`` The default style. Optional.
     *  :arg callback: ``Function`` The function to call when all operations
     *      succeeded. Will be called in the scope of this instance. Optional.
     */
    assignStyles: function (target, styleName) {
        if (!this.target.first) {
            return;
        }
        var layerRecord = this.target.layerRecord;
        var layer = layerRecord.getLayer();
        var layerStyles = layer.styleMap;
        var styleRec = this.target.selectedStyle;
        if (styleRec) {
            var oldStyleName = styleRec.get("userStyle").name;
            var oldStyle = styleRec.get("userStyle");
            var newStyle = oldStyle.clone();
            newStyle.defaultsPerSymbolizer = false;

            // GXP Style Editing needs symbolizers array in Rule object
            // while Vector/Style drawing needs symbolizer hash...
            var textStyle = {};
            var symbolizer;
            if (newStyle.rules) {
                for (var i = 0, len = newStyle.rules.length; i < len; i++) {
                    var rule = newStyle.rules[i].clone();
                    rule.symbolizer = {};

                    for (var j = 0; j < rule.symbolizers.length; j++) {
                        symbolizer = rule.symbolizers[j];
                        var symbolType = symbolizer.CLASS_NAME.split(".").pop();
                        if (symbolType == 'Text') {
                            textStyle.label = symbolizer.label;
                            textStyle.fontFamily = symbolizer.fontFamily;
                            textStyle.fontSize = symbolizer.fontSize;
                            textStyle.fontWeight = symbolizer.fontWeight;
                            textStyle.fontStyle = symbolizer.fontStyle;
                            textStyle.fontColor= symbolizer.fontColor;
                        }
                        rule.symbolizer[symbolType] = rule.symbolizers[j];
                        // newStyle.label = rule.symbolizer[symbolType].label;
                    }
                    newStyle.rules[i] = rule;
                    rule.symbolizers = undefined;
                }
            }
            OpenLayers.Util.extend(newStyle.defaultStyle, textStyle);

            newStyle.propertyStyles = newStyle.findPropertyStyles();
            layerStyles.styles[styleName] = newStyle;
            // newStyle.defaultStyle = undefined;
            var feature;
            layer.eraseFeatures(layer.features);
            for (var f = 0; f < layer.features.length; f++) {
                feature = layer.features[f];
                // Some features still may have local style object
                if (feature.style) {
                    delete feature.style;
                }
                feature.style = newStyle.createSymbolizer(feature);

                layer.drawFeature(feature);
            }

            // layerRecord.store.fireEvent("update", layerRecord.store, layerRecord, Ext.data.Record.EDIT)
        }
        //       this.target.stylesStore.each(function(rec) {
//            if (!defaultStyle && rec.get("userStyle").isDefault === true) {
//                defaultStyle = rec.get("name");
//            }
//            if (rec.get("name") !== defaultStyle &&
//                                this.deletedStyles.indexOf(rec.id) === -1) {
//                styles.push({"name": rec.get("name")});
//            }
//       }, this);
//        Ext.Ajax.request({
//            method: "PUT",
//            url: this.baseUrl + "/layers/" +
//                this.target.layerRecord.get("name") + ".json",
//            jsonData: {
//                "layer": {
//                    "defaultStyle": {
//                        "name": defaultStyle
//                    },
//                    "styles": styles.length > 0 ? {
//                        "style": styles
//                    } : {},
//                    "enabled": true
//                }
//            },
//            success: callback,
//            failure: function() {
//                this._failed = true;
//                callback.call(this);
//            },
//            scope: this
//        });
    },

    /** private: method[deleteStyles]
     *  Deletes styles that are no longer assigned to the layer.
     */
    deleteStyles: function () {
//        for (var i=0, len=this.deletedStyles.length; i<len; ++i) {
//            Ext.Ajax.request({
//                method: "DELETE",
//                url: this.baseUrl + "/styles/" + this.deletedStyles[i] +
//                    // cannot use params for DELETE requests without jsonData
//                    "?purge=true"
//            });
//        }
        this.deletedStyles = [];
    }

});

/** api: ptype = gxp_vectorstylewriter */
Ext.preg("gxp_vectorstylewriter", gxp.plugins.VectorStyleWriter);
