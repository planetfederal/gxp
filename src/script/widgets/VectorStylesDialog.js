/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @require util.js
 * @require widgets/RulePanel.js
 * @require widgets/StylePropertiesDialog.js
 * @requires OpenLayers/Renderer/SVG.js
 * @requires OpenLayers/Renderer/VML.js
 * @requires OpenLayers/Renderer/Canvas.js
 * @require OpenLayers/Style2.js
 * @require OpenLayers/Format/SLD/v1_0_0_GeoServer.js
 * @require GeoExt/data/AttributeStore.js
 * @require GeoExt/widgets/WMSLegend.js
 * @require GeoExt/widgets/VectorLegend.js
 * @require widgets/WMSStylesDialog.js
 */

/** api: (define)
 *  module = gxp
 *  class = VectorStylesDialog
 *  base_link = `Ext.Container <http://extjs.com/deploy/dev/docs/?class=Ext.Container>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: VectorStylesDialog(config)
 *
 *      Extend the GXP WMSStylesDialog to work with Vector Layers
 *      that originate from a WFS or local OpenLayers Features from upload or drawing.
 */
gxp.VectorStylesDialog = Ext.extend(gxp.WMSStylesDialog, {

    /** private: method[initComponent]
     */
    initComponent: function () {
        gxp.VectorStylesDialog.superclass.initComponent.apply(this, arguments);

        // We cannot create/delete new styles for Vector Layers (StyleMap restriction)
        // this.items.removeAt(1);
        this.initialConfig.styleName = 'default';
        this.items.get(1).setDisabled(true);

        this.on({
            "styleselected": function (cmp, style) {
                var index = this.stylesStore.findExact("name", style.name);
                if (index !== -1) {
                    this.selectedStyle = this.stylesStore.getAt(index);
                }
            },
            "modified": function (cmp, style) {
                cmp.saveStyles();
            },
            "beforesaved": function () {
                this._saving = true;
            },
            "saved": function () {
                delete this._saving;
            },
            "savefailed": function () {
                Ext.Msg.show({
                    title: this.errorTitle,
                    msg: this.errorMsg,
                    icon: Ext.MessageBox.ERROR,
                    buttons: {ok: true}
                });
                delete this._saving;
            },
            "render": function () {
                gxp.util.dispatch([this.getStyles], function () {
                    this.enable();
                }, this);
            },
            scope: this
        });

    },


    /** private: method[editRule]
     */
    editRule: function () {
        var rule = this.selectedRule;
        var origRule = rule.clone();

        // Attribute types: either from WFS or local features
        var attributeStore;
        if (this.layerDescription) {
            // WFS Layer: use DescribeFeatureType to get attribute-names/types
            attributeStore = new GeoExt.data.AttributeStore({
                url: this.layerDescription.owsURL,
                baseParams: {
                    "SERVICE": "WFS",
                    "REQUEST": "DescribeFeatureType",
                    "TYPENAME": this.layerDescription.typeName
                },
                method: "GET",
                disableCaching: false
            });
        } else {
            // Attribute store will be derived from local features
            attributeStore = new Ext.data.Store({
                // explicitly create reader
                // id for each record will be the first element}
                reader: new Ext.data.ArrayReader(
                        {idIndex: 0},
                        Ext.data.Record.create([{name: 'name'}])
                )
            });

            // Create attribute meta data from feature-attributes
            var myData = [];
            var layer = this.layerRecord.data.layer;
            if (layer && layer.features && layer.features.length > 0) {
                var attrs = layer.features[0].attributes;
                for (var attr in attrs) {
                    myData.push([attr]);
                }
            }
            attributeStore.loadData(myData);
            // Silence the proxy (must be better way...)
            attributeStore.proxy = {request: function () {}};
        }

        var ruleDlg = new this.dialogCls({
            title: String.format(this.ruleWindowTitle,
                    rule.title || rule.name || this.newRuleText),
            shortTitle: rule.title || rule.name || this.newRuleText,
            layout: "fit",
            width: 320,
            height: 450,
            pageX: 150,
            pageY: 100,
            modal: true,
            listeners: {
                hide: function() {
                    if (gxp.ColorManager.pickerWin) {
                        gxp.ColorManager.pickerWin.hide();
                    }
                },
                scope: this
            },
            items: [
                {
                    xtype: "gxp_rulepanel",
                    ref: "rulePanel",
                    symbolType: this.symbolType,
                    rule: rule,
                    attributes: attributeStore,
                    autoScroll: true,
                    border: false,
                    defaults: {
                        autoHeight: true,
                        hideMode: "offsets"
                    },
                    listeners: {
                        "change": this.saveRule,
                        "tabchange": function () {
                            if (ruleDlg instanceof Ext.Window) {
                                ruleDlg.syncShadow();
                            }
                        },
                        scope: this
                    }
                }
            ],
            bbar: ["->", {
                text: this.cancelText,
                iconCls: "cancel",
                handler: function () {
                    this.saveRule(ruleDlg.rulePanel, origRule);
                    ruleDlg.destroy();
                },
                scope: this
            }, {
                text: this.saveText,
                iconCls: "save",
                handler: function () {
                    ruleDlg.destroy();
                }
            }]
        });
        this.showDlg(ruleDlg);
    },


    /** private: method[prepareStyle]
     *  :arg style: ``Style`` object to be cloned and prepared for GXP editing.
     */
    prepareStyle: function (layer, style, name) {
        style = style.clone();
        style.isDefault = name === 'default';
        style.name = name;
        style.title = name + ' style';
        style.description = name + ' style for this layer';
        style.layerName = layer.name;

        if (style.rules && style.rules.length > 0) {
            for (var i = 0, len = style.rules.length; i < len; i++) {
                var rule = style.rules[i];
                rule.symbolizers = [];

                for (var symbol in rule.symbolizer) {
                    var symbolizer = rule.symbolizer[symbol];
                    if (symbolizer.CLASS_NAME && symbolizer.CLASS_NAME.indexOf('OpenLayers.Symbolizer.') > 0) {
                        ;
                    } else if (symbolizer instanceof Object) {
                        // In some cases the symbolizer may be a hash: create corresponding class object
                        symbolizer = Heron.Utils.createOLObject(['OpenLayers.Symbolizer.' + symbol, symbolizer]);
                    }
                    rule.symbolizers.push(symbolizer);
                }
                rule.symbolizer = undefined;
            }

        } else {
            // GXP Style Editing needs symbolizers array in Rule object
            // while Vector/Style drawing needs symbolizer hash...
            var symbolizer = new OpenLayers.Symbolizer.Polygon(style.defaultStyle);
            if (layer && layer.features && layer.features.length > 0) {
                 var geom = layer.features[0].geometry;
                 if (geom) {
                     if (geom.CLASS_NAME.indexOf('Point') > 0) {
                         symbolizer = new OpenLayers.Symbolizer.Point(style.defaultStyle);
                     } else if (geom.CLASS_NAME.indexOf('Line') > 0) {
                         symbolizer = new OpenLayers.Symbolizer.Line(style.defaultStyle);
                     }
                 }
             }
            var symbolizers = [symbolizer];
            style.rules = [new OpenLayers.Rule({title: style.name, symbolizers: symbolizers})];
            style.defaultsPerSymbolizer = true;
        }
        return style;
    },

    /** private: method[getStyles]
     *  :arg callback: ``Function`` function that will be called when the
     *      request result was returned.
     */
    getStyles: function () {
        if (this.first) {
            return;
        }
        var layer = this.layerRecord.getLayer();
        if (this.editable) {
            this.first = true;
            var initialStyle = this.initialConfig.styleName;
            this.selectedStyle = this.stylesStore.getAt(this.stylesStore.findExact("name", initialStyle));

            try {

                // add userStyle objects to the stylesStore
                var userStyles = [];

                // Some layers are styled via the "Style" config prop: convert to a StyleMap
                if (layer.style && layer.styleMap) {
                    OpenLayers.Util.extend(layer.styleMap.styles['default'].defaultStyle, layer.style);
                    delete layer.style;
                }
                for (var styleName in layer.styleMap.styles) {
                    // Do only default style for now.
                    if (styleName == 'default') {
                        userStyles.push(this.prepareStyle(layer, layer.styleMap.styles[styleName], styleName));
                    }
                }

                // our stylesStore comes from the layerRecord's styles - clear it
                // and repopulate from GetStyles
                this.stylesStore.removeAll();
                this.selectedStyle = null;

                var userStyle, record, index;
                for (var i = 0, len = userStyles.length; i < len; ++i) {
                    userStyle = userStyles[i];
                    // remove existing record - this way we replace styles from
                    // userStyles with inline styles.
                    index = this.stylesStore.findExact("name", userStyle.name);
                    index !== -1 && this.stylesStore.removeAt(index);
                    record = new this.stylesStore.recordType({
                        "name": userStyle.name,
                        "title": userStyle.title,
                        "abstract": userStyle.description,
                        "userStyle": userStyle
                    });
                    record.phantom = false;
                    this.stylesStore.add(record);
                    // set the default style if no STYLES param is set on the layer
                    if (!this.selectedStyle && (initialStyle === userStyle.name ||
                            (!initialStyle && userStyle.isDefault === true))) {
                        this.selectedStyle = record;
                    }
                }

                this.addRulesFieldSet();
                this.createLegend(this.selectedStyle.get("userStyle").rules);
                // this.createLegend();

                this.stylesStoreReady();
                this.markModified();
            }
            catch (e) {
                this.setupNonEditable();
            }
        } else {
            this.setupNonEditable();
        }
    },


    /** private: method[describeLayer]
     *  :arg callback: ``Function`` function that will be called when the
     *      request result was returned.
     */
    describeLayer: function (callback) {

        var layer = this.layerRecord.getLayer();
        if (layer.protocol && layer.protocol.CLASS_NAME.indexOf('.WFS') > 0) {
            this.layerDescription = {};
            this.layerDescription.owsURL = layer.protocol.url.replace('?', '');
            this.layerDescription.owsType = 'WFS';
            this.layerDescription.typeName = layer.protocol.featureType;
        }
        this.editRule();
    },

    /** private: method[addStylesCombo]
     *
     *  Adds a combo box with the available style names found for the layer
     *  in the capabilities document to this component's stylesFieldset.
     */
    addStylesCombo: function () {
        if (this.combo) {
            return;
        }
        var store = this.stylesStore;
        this.combo = new Ext.form.ComboBox(Ext.apply({
            fieldLabel: this.chooseStyleText,
            store: store,
            editable: false,
            displayField: "title",
            valueField: "name",
            value: this.selectedStyle ? this.selectedStyle.get("title") : "default",
            disabled: !store.getCount(),
            mode: "local",
            typeAhead: true,
            triggerAction: "all",
            forceSelection: true,
            anchor: "100%",
            listeners: {
                "select": function (combo, record) {
                    this.changeStyle(record);
                    if (!record.phantom && !this._removing) {
                        this.fireEvent("styleselected", this, record.get("name"));
                    }
                },
                scope: this
            }
        }, this.initialConfig.stylesComboOptions));
        // add combo to the styles fieldset
        this.items.get(0).add(this.combo);
        this.doLayout();
    },

    /** private: method[createLegendImage]
     *  :return: ``GeoExt.LegendImage`` or undefined if none available.
     *
     *  Creates a legend image for the first style of the current layer. This
     *  is used when GetStyles is not available from the layer's WMS.
     */
    createLegendImage: function () {
        return new GeoExt.VectorLegend({
            showTitle: false,
            layerRecord: this.layerRecord,
            autoScroll: true
        });
    },

    /** private: method[updateStyleRemoveButton]
     *  We cannot remove styles for Vector styles so always disable remove.
     */
    updateStyleRemoveButton: function () {
        this.items.get(1).items.get(1).setDisabled(true);
    }


});

/** api: function[createGeoServerStylerConfig]
 *  :arg layerRecord: ``GeoExt.data.LayerRecord`` Layer record to configure the
 *      dialog for.
 *  :arg url: ``String`` Optional. Custaom URL for the GeoServer REST endpoint
 *      for writing styles.
 *
 *  Creates a configuration object for a :class:`gxp.VectorStylesDialog` with a
 *  :class:`gxp.plugins.GeoServerStyleWriter` plugin and listeners for the
 *  "styleselected", "modified" and "saved" events that take care of saving
 *  styles and keeping the layer view updated.
 */
gxp.VectorStylesDialog.createVectorStylerConfig = function (layerRecord) {
    return {
        xtype: "gxp_vectorstylesdialog",
        layerRecord: layerRecord,
        listeners: {
            hide: function () {
                alert('hode');
            }
        },
        plugins: [
            {
                ptype: "gxp_vectorstylewriter"
            }
        ]
    };
};

//gxp.VectorStylesDialog.createColorsArr = function () {
//
//    var colors = new Array('00', 'CC', '33', '66', '99', 'FF');
//    var colorsArr = [];
//    for (var i = 0; i < 6; i++) {
//        for (var j = 0; j < 6; j++) {
//            // each row will have 6 colors
//            for (var k = 0; k < 6; k++) {
//                //this creates hex code for each color
//                colorsArr.push(colors[i] + '' + colors[k] + '' + colors[j]);
//            }
//        }
//
//    }
//    return colorsArr;
//};

/** api: xtype = gxp_vectorstylesdialog */
Ext.reg('gxp_vectorstylesdialog', gxp.VectorStylesDialog);

/** Using the ExtJS-way to override single methods of classes. Extend colors available in standard palette. */
Ext.override(Ext.ColorPalette, {
    // Use the 256 web-safe colors, see http://www.w3schools.com/html/html_colors.asp
    colors: [
        '000000', '000033', '000066', '000099', '0000CC', '0000FF',
        '003300', '003333', '003366', '003399', '0033CC', '0033FF',
        '006600', '006633', '006666', '006699', '0066CC', '0066FF',
        '009900', '009933', '009966', '009999', '0099CC', '0099FF',
        '00CC00', '00CC33', '00CC66', '00CC99', '00CCCC', '00CCFF',
        '00FF00', '00FF33', '00FF66', '00FF99', '00FFCC', '00FFFF',
        '330000', '330033', '330066', '330099', '3300CC', '3300FF',
        '333300', '333333', '333366', '333399', '3333CC', '3333FF',
        '336600', '336633', '336666', '336699', '3366CC', '3366FF',
        '339900', '339933', '339966', '339999', '3399CC', '3399FF',
        '33CC00', '33CC33', '33CC66', '33CC99', '33CCCC', '33CCFF',
        '33FF00', '33FF33', '33FF66', '33FF99', '33FFCC', '33FFFF',
        '660000', '660033', '660066', '660099', '6600CC', '6600FF',
        '663300', '663333', '663366', '663399', '6633CC', '6633FF',
        '666600', '666633', '666666', '666699', '6666CC', '6666FF',
        '669900', '669933', '669966', '669999', '6699CC', '6699FF',
        '66CC00', '66CC33', '66CC66', '66CC99', '66CCCC', '66CCFF',
        '66FF00', '66FF33', '66FF66', '66FF99', '66FFCC', '66FFFF',
        '990000', '990033', '990066', '990099', '9900CC', '9900FF',
        '993300', '993333', '993366', '993399', '9933CC', '9933FF',
        '996600', '996633', '996666', '996699', '9966CC', '9966FF',
        '999900', '999933', '999966', '999999', '9999CC', '9999FF',
        '99CC00', '99CC33', '99CC66', '99CC99', '99CCCC', '99CCFF',
        '99FF00', '99FF33', '99FF66', '99FF99', '99FFCC', '99FFFF',
        'CC0000', 'CC0033', 'CC0066', 'CC0099', 'CC00CC', 'CC00FF',
        'CC3300', 'CC3333', 'CC3366', 'CC3399', 'CC33CC', 'CC33FF',
        'CC6600', 'CC6633', 'CC6666', 'CC6699', 'CC66CC', 'CC66FF',
        'CC9900', 'CC9933', 'CC9966', 'CC9999', 'CC99CC', 'CC99FF',
        'CCCC00', 'CCCC33', 'CCCC66', 'CCCC99', 'CCCCCC', 'CCCCFF',
        'CCFF00', 'CCFF33', 'CCFF66', 'CCFF99', 'CCFFCC', 'CCFFFF',
        'FF0000', 'FF0033', 'FF0066', 'FF0099', 'FF00CC', 'FF00FF',
        'FF3300', 'FF3333', 'FF3366', 'FF3399', 'FF33CC', 'FF33FF',
        'FF6600', 'FF6633', 'FF6666', 'FF6699', 'FF66CC', 'FF66FF',
        'FF9900', 'FF9933', 'FF9966', 'FF9999', 'FF99CC', 'FF99FF',
        'FFCC00', 'FFCC33', 'FFCC66', 'FFCC99', 'FFCCCC', 'FFCCFF',
        'FFFF00', 'FFFF33', 'FFFF66', 'FFFF99', 'FFFFCC', 'FFFFFF'
    ]
});

(function() {
    // register the color manager with every color field
    Ext.util.Observable.observeClass(Ext.ColorPalette);
    Ext.ColorPalette.on({
        render: function() {
            if (gxp.ColorManager.pickerWin) {
                gxp.ColorManager.pickerWin.setPagePosition(200,100);
            }
        }
    });
})();

//(function() {
//    // register the color manager with every color field
//    Ext.util.Observable.observeClass(gxp.TextSymbolizer);
//    gxp.TextSymbolizer.on({
//        afterrender: function(textSymbolizer) {
//            var items = textSymbolizer.items;
//            for (var i=3; i < items.length-1; i++) {
//                textSymbolizer.remove(items[i], true);
//            }
//            textSymbolizer.doLayout();
//        }
//    });
//})();

