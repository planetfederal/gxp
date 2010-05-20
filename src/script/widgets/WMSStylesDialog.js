/**
 * Copyright (c) 2010 The Open Planning Project
 */

/** api: (define)
 *  module = gxp
 *  class = WMSStylesDialog
 *  base_link = `Ext.Container <http://extjs.com/deploy/dev/docs/?class=Ext.Container>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: WMSStylesDialog(config)
 *   
 *      Create a dialog for selecting and layer styles. If the WMS supports
 *      GetStyles, styles can also be edited. The dialog does not provide any
 *      means of writing modified styles back to the server. To save styles,
 *      configure the dialog with a :class:`gxp.plugins.StyleWriter` and use
 *      the plugin's ``write`` method. If the WMS does not support GetStyles,
 *      the selected style will be applied to the layer provided as
 *      ``layerRecord`` instantly.
 */
gxp.WMSStylesDialog = Ext.extend(Ext.Container, {
    
    /** api: config[layerRecord]
     *  ``GeoExt.data.LayerRecord`` The layer to edit/select styles for.
     */
    
    /** private: property[layerRecord]
     *  ``GeoExt.data.LayerRecord`` The layer to edit/select styles for.
     */
    layerRecord: null,
    
    /** api: config[wfsUrl]
     *  ``String`` Optional wfs url for issuing a DescribeFeatureType request
     *  to. Only required if the layer (WMS) url does not provide
     *  ``SERVICE=WFS``
     */
    
    /** private: property[symbolType]
     *  ``Point`` or ``Line`` or ``Polygon`` - the primary symbol type for the
     *  layer. This is the symbolizer type of the first symbolizer of the
     *  first rule of the current layer style. Only available if the WMS
     *  supports GetStyles.
     */
    symbolType: null,
    
    /** api: property[stylesStore]
     *  ``Ext.data.Store`` A store representing the styles returned from
     *  GetCapabilities and GetStyles. It has "name", "title", "abstract",
     *  "legend" and "userStyle" fields. If the WMS supports GetStyles, the
     *  "legend" field will not be available. If it does not, the "userStyle"
     *  field will not be available.
     */
    stylesStore: null,
    
    /** api: property[selectedStyle]
     *  ``Ext.data.Record`` The currently selected style from the
     *  ``stylesStore``.
     */
    selectedStyle: null,
    
    /** private: property[selectedRule]
     *  ``OpenLayers.Rule`` The currently selected rule, or null if none
     *  selected.
     */
    selectedRule: null,
        
    /** private: method[initComponent]
     */
    initComponent: function() {
        var defConfig = {
            layout: "form",
            items: [{
                xtype: "fieldset",
                title: "Styles",
                labelWidth: 75,
                style: "margin-bottom: 0;"
            }, {
                xtype: "toolbar",
                style: "border-width: 0 1px 1px 1px; margin-bottom: 10px;",
                items: [
                    {
                        xtype: "button",
                        iconCls: "add",
                        text: "Add",
                        handler: function() {
                            var store = this.stylesStore;
                            var newStyle = new OpenLayers.Style(null, {
                                name: gxp.util.uniqueName("New_Style", "_"),
                                rules: [this.createRule()]
                            });
                            store.add(new store.recordType({
                                "name": newStyle.name,
                                "userStyle": newStyle
                            }));
                        },
                        scope: this
                    }, {
                        xtype: "button",
                        iconCls: "delete",
                        text: "Remove",
                        handler: function() {
                            this.stylesStore.remove(this.selectedStyle);
                        },
                        scope: this
                    }, {
                        xtype: "button",
                        iconCls: "edit",
                        text: "Edit",
                        handler: function() {
                            var userStyle = this.selectedStyle.get("userStyle");
                            var styleProperties = new Ext.Window({
                                title: "User Style: " + userStyle.name,
                                bodyBorder: false,
                                autoHeight: true,
                                width: 300,
                                modal: true,
                                items: {
                                    border: false,
                                    items: {
                                        xtype: "gx_stylepropertiesdialog",
                                        userStyle: userStyle.clone(),
                                        // styles that came from the server
                                        // have a name that we don't change
                                        nameEditable: this.selectedStyle.id !==
                                            this.selectedStyle.get("name"),
                                        style: "padding: 10px;"
                                    }
                                },
                                buttons: [{
                                    text: "Cancel",
                                    handler: function() {
                                        styleProperties.close();
                                    }
                                }, {
                                    text: "Save",
                                    handler: function() {
                                        var userStyle = 
                                        this.selectedStyle.set(
                                            "userStyle",
                                            styleProperties.items.get(0).items.get(0).userStyle);
                                        styleProperties.close();
                                    },
                                    scope: this
                                }]
                            });
                            styleProperties.show();
                        },
                        scope: this
                    }, {
                        xtype: "button",
                        iconCls: "duplicate",
                        text: "Duplicate",
                        handler: function() {
                            var newStyle = this.selectedStyle.get(
                                "userStyle").clone();
                            newStyle.isDefault = false;
                            newStyle.name = gxp.util.uniqueName(
                                newStyle.name + "_copy", "_");
                            var store = this.stylesStore;
                            store.add(new store.recordType({
                                "name": newStyle.name,
                                "title": newStyle.title,
                                "abstract": newStyle.description,
                                "userStyle": newStyle
                            }));
                        },
                        scope: this
                    }
                ]
            }]
        };
        Ext.applyIf(this, defConfig);
                
        this.createStylesStore();

        gxp.WMSStylesDialog.superclass.initComponent.apply(this, arguments);
    },
    
    /** api: method[createSLD]
     *  :arg options: ``Object``
     *  :return: ``String`` The current SLD for the NamedLayer.
     *  
     *  Supported ``options``:
     *  * userStyles - ``Array(String)`` list of userStyles (by name) that are
     *    to be included in the SLD. By default, all will be included.
     */
    createSLD: function(options) {
        options = options || {};
        var sld = {
            version: "1.0.0",
            namedLayers: {}
        };
        var layerName = this.layerRecord.get("name");
        sld.namedLayers[layerName] = {
            name: layerName,
            userStyles: []
        };
        this.stylesStore.each(function(r) {
            if(!options.userStyles ||
                    options.userStyles.indexOf(r.get("name")) !== -1) {
                sld.namedLayers[layerName].userStyles.push(r.get("userStyle"));
            }
        });
        return new OpenLayers.Format.SLD().write(sld);
    },
    
    /** private: method[updateStyleRemoveButton]
     *  Enable/disable the "Remove" button to make sure that we don't delete
     *  the last style.
     */
    updateStyleRemoveButton: function() {
        this.items.get(1).items.get(1).setDisabled(
            this.stylesStore.getCount() <= 1 ||
            this.selectedStyle.get("userStyle").isDefault === true);
    },
    
    /** private: method[updateRuleRemoveButton]
     *  Enable/disable the "Remove" button to make sure that we don't delete
     *  the last rule.
     */
    updateRuleRemoveButton: function() {
        this.items.get(3).items.get(1).setDisabled(
            this.selectedStyle.get("userStyle").rules.length <= 1);
    },
    
    /** private: method[createRule]
     */
    createRule: function() {
        var symbolizer = {};
        symbolizer[this.symbolType] = {};
        return new OpenLayers.Rule({
            name: gxp.util.uniqueName("New Rule"),
            symbolizer: symbolizer
        });
    },
    
    /** private: method[addRulesFieldSet]
     *  Creates the rules fieldSet and adds it to this container.
     */
    addRulesFieldSet: function() {
        var rulesFieldSet = new Ext.form.FieldSet({
            title: "Rules",
            autoScroll: true,
            style: "margin-bottom: 0;"
        });
        var rulesToolbar = new Ext.Toolbar({
            style: "border-width: 0 1px 1px 1px;",
            items: [
                {
                    xtype: "button",
                    iconCls: "add",
                    text: "Add",
                    handler: function() {
                        this.selectedStyle.get("userStyle").addRules(
                            [this.createRule()]);
                        // update the legend
                        this.items.get(2).items.get(0).update();
                        this.updateRuleRemoveButton();
                    },
                    scope: this
                }, {
                    xtype: "button",
                    iconCls: "delete",
                    text: "Remove",
                    handler: function() {
                        var rule = this.selectedRule;
                        var legend = this.items.get(2).items.get(0);
                        legend.unselect();
                        this.selectedStyle.get("userStyle").rules.remove(rule);
                        legend.update();
                    },
                    scope: this,
                    disabled: true
                }, {
                    xtype: "button",
                    iconCls: "edit",
                    text: "Edit",
                    handler: this.editRule,
                    scope: this,
                    disabled: true
                }, {
                    xtype: "button",
                    iconCls: "duplicate",
                    text: "Duplicate",
                    handler: function() {
                        var legend = this.items.get(2).items.get(0);
                        var newRule = this.selectedRule.clone();
                        newRule.name = gxp.util.uniqueName(
                            (newRule.title || newRule.name) + " (copy)");
                        delete newRule.title;
                        this.selectedStyle.get("userStyle").addRules(
                            [newRule]);
                        legend.update();
                        this.updateRuleRemoveButton();
                    },
                    scope: this,
                    disabled: true
                }
            ]
        });
        this.add(rulesFieldSet, rulesToolbar);
        this.doLayout();
    },
    
    /** private: method[editRule]
     */
    editRule: function() {
        var origRule = this.selectedRule;
        var rule = origRule.clone();

        var wfsUrl = this.initialConfig.wfsUrl;
        if (!wfsUrl) {
            var wmsUrl = this.layerRecord.get("layer").url;
            var urlParts = wmsUrl.split("?");
            var params = Ext.urlDecode(urlParts[urlParts.length - 1]);
            delete params[""];
            Ext.apply(params, {
                "SERVICE": "WFS",
                "REQUEST": "DescribeFeatureType"
            });
            wfsUrl = Ext.urlAppend(urlParts[0], Ext.urlEncode(params));
        }
        
        var style = this.selectedStyle;
        var save = function() {
            var userStyle = style.get("userStyle");
            var i = userStyle.rules.indexOf(origRule);
            userStyle.rules[i] = rule;
            // clone the style, to make sure that stlye.set triggers an update
            // event.
            style.set("userStyle", userStyle.clone());
        }

        var ruleDlg = new Ext.Window({
            title: "Style Rule: " + (rule.title || rule.name),
            width: 340,
            autoHeight: true,
            modal: true,
            items: [{
                xtype: "gx_rulepanel",
                symbolType: this.symbolType,
                rule: rule,
                attributes: new GeoExt.data.AttributeStore({
                    url: wfsUrl
                }),
                bodyStyle: "padding: 10px",
                border: false,
                defaults: {
                    autoHeight: true,
                    hideMode: "offsets"
                }
            }],
            buttons: [{
                text: "Cancel",
                handler: function() {
                    ruleDlg.close();
                }
            }, {
                text: "Apply",
                handler: function() {
                    save();
                    origRule = rule;
                },
                scope: this
            }, {
                text: "Save",
                handler: function() {
                    save();
                    ruleDlg.close();
                },
                scope: this
            }]
        });
        ruleDlg.show();
    },
    
    /** private: method[removeRulesFieldSet[
     *  Removes rulesFieldSet when the legend image cannot be loaded
     */
    removeRulesFieldSet: function() {
        // remove the toolbar
        this.remove(this.items.get(3));
        // and the fieldset itself
        this.remove(this.items.get(2));
        this.doLayout();
    },

    /** private: method[parseSLD]
     *  :param response: ``Object``
     *  :param options: ``Object``
     *  
     *  Success handler for the GetStyles response. Includes a fallback
     *  to GetLegendGraphic if no valid SLD is returned.
     */
    parseSLD: function(response, options) {
        var data = response.responseXML;
        if (!data || !data.documentElement) {
            data = new OpenLayers.Format.XML().read(response.responseText);
        }
        var layerParams = this.layerRecord.get("layer").params;
        //TODO use the default style instead of the 1st one if layer has
        // no STYLES param
        if (layerParams.STYLES) {
            this.selectedStyle = this.stylesStore.getAt(
                this.stylesStore.findExact("name", layerParams.STYLES));
        }
        
        try {
            var sld = new OpenLayers.Format.SLD().read(data);
            
            // add userStyle objects to the stylesStore
            //TODO this only works if the LAYERS param contains one layer
            var userStyles = sld.namedLayers[layerParams.LAYERS].userStyles;
            
            // our stylesStore comes from the layerRecord's styles - clear it
            // and repopulate from GetStyles
            this.stylesStore.removeAll();
            var userStyle, record;
            for (var i=0, len=userStyles.length; i<len; ++i) {
                userStyle = userStyles[i];
                record = new this.stylesStore.recordType({
                    "name": userStyle.name,
                    "title": userStyle.title,
                    "abstract": userStyle.description,
                    "userStyle": userStyle
                });
                record.phantom = false;
                this.stylesStore.add(record);
                // set the default style if no STYLES param is set on the layer
                if (this.layerRecord.get("layer").params.STYLES ===
                            userStyle.name || userStyle.isDefault === true) {
                    this.selectedStyle = record;
                }
            }
            
            this.addRulesFieldSet();
            this.addVectorLegend(this.selectedStyle.get("userStyle").rules);
        }
        catch(e) {
            // disable styles toolbar
            this.items.get(1).disable();
            var legendImage = this.createLegendImage();
            this.addRulesFieldSet();
            this.items.get(2).add(legendImage);
            this.doLayout();
            // disable rules toolbar
            this.items.get(3).disable();
        }
        finally {
            this.stylesStoreReady();
        }
    },
    
    /** private: method[stylesStoreReady]
     *  Adds listeners and triggers the ``load`` event of the ``styleStore``.
     */
    stylesStoreReady: function() {
        // start with a clean store
        this.stylesStore.commitChanges();
        this.stylesStore.on({
            "load": function() {
                this.addStylesCombo();
                this.updateStyleRemoveButton();
            },
            "add": function(store, records, index) {
                this.updateStyleRemoveButton();
            },
            "remove": function(store, record, index) {
                var newIndex =  Math.min(index, store.getCount() - 1);
                this.selectedStyle = store.getAt(newIndex);
                this.updateStyleRemoveButton();
                // update the "Choose style" combo's value
                var combo = this.items.get(0).items.get(0);
                combo.setValue(this.selectedStyle.get("name"));
                combo.fireEvent("select", combo, this.selectedStyle, newIndex);
            },
            "update": function(store, record) {
                var userStyle = record.get("userStyle");
                var data = {
                    "name": userStyle.name,
                    "title": userStyle.title,
                    "abstract": userStyle.description
                };
                Ext.apply(record.data, data);
                // make sure that the legend gets updated
                this.changeStyle(record);
                // update the combo's value with the new name
                this.items.get(0).items.get(0).setValue(userStyle.name);
            },
            scope: this
        });

        this.stylesStore.fireEvent("load", this.stylesStore,
            this.stylesStore.getRange())
    },
    
    /** private: method[createStylesStore]
     */
    createStylesStore: function() {
        var styles = this.layerRecord.get("styles");
        this.stylesStore = new Ext.data.JsonStore({
            data: {
                styles: styles
            },
            idProperty: "name",
            root: "styles",
            // add a userStyle field (not included in styles from
            // GetCapabilities), which will be populated with the userStyle
            // object if GetStyles is supported by the WMS
            fields: ["name", "title", "abstract", "legend", "userStyle"]
        }); 
            
        var layer = this.layerRecord.get("layer");
        Ext.Ajax.request({
            method: "GET",
            url: layer.url,
            params: {
                request: "GetStyles",
                layers: layer.params.LAYERS
            },
            success: this.parseSLD,
            failure: this.stylesStoreReady,
            scope: this
        });
    },
    
    /** private: method[addStylesCombo]
     * 
     *  Adds a combo box with the available style names found for the layer
     *  in the capabilities document to this component's stylesFieldset.
     */
    addStylesCombo: function() {
        var store = this.stylesStore;
        var combo = new Ext.form.ComboBox({
            fieldLabel: "Choose style",
            store: store,
            displayField: "name",
            value: this.selectedStyle ?
                this.selectedStyle.get("name") :
                this.layerRecord.get("layer").params.STYLES || "default",
            disabled: !store.getCount(),
            mode: "local",
            typeAhead: true,
            triggerAction: "all",
            forceSelection: true,
            anchor: "100%",
            listeners: {
                "select": function(combo, record) {
                    this.changeStyle(record)
                },
                scope: this
            }
        });
        // add combo to the styles fieldset
        this.items.get(0).add(combo);
        this.doLayout();
    },
    
    /** private: method[createLegendImage]
     *  :return: ``GeoExt.LegendImage`` or undefined if none available.
     * 
     *  Creates a legend image for the first style of the current layer. This
     *  is used when GetStyles is not available from the layer's WMS.
     */
    createLegendImage: function() {
        var legend = new GeoExt.WMSLegend({
            showTitle: false,
            layerRecord: this.layerRecord,
            defaults: {
                listeners: {
                    "render": function() {
                        this.getEl().on({
                            "load": this.doLayout,
                            "error": this.removeRulesFieldSet,
                            scope: this
                        });
                    },
                    scope: this
                }
            }
        });
        return legend;
    },
    
    /** private: method[changeStyle]
     *  :param value: ``Ext.data.Record``
     * 
     *  Handler for the stylesCombo's ``select`` and the store's ``update``
     *  event. Updates the layer and the rules fieldset.
     */
    changeStyle: function(record) {
        this.selectedStyle = record;
        this.updateStyleRemoveButton();
        var styleName = record.get("name");
        
        //TODO remove when support for GeoServer < 2.0.2 is dropped. See
        // http://jira.codehaus.org/browse/GEOS-3921
        var legend = record.get("legend");
        if (legend) {
            var urlParts = legend.href.split("?");
            var params = Ext.urlDecode(urlParts[1]);
            params.STYLE = styleName;
            urlParts[1] = Ext.urlEncode(params);
            legend.href = urlParts.join("?");
        }
        //TODO end remove
        
        var userStyle = record.get("userStyle");
        var fieldset = this.items.get(2);
        if (userStyle) {
            // remove legend from rulesFieldSet
            fieldset.remove(fieldset.items.get(0));
            this.addVectorLegend(userStyle.rules);
        } else {
            // if GetStyles is not supported, we instantly update the layer
            this.layerRecord.get("layer").mergeNewParams(
                {styles: styleName});
        }
    },
    
    /** private: method[addVectorLegend]
     *  :param rules: ``Array``
     *
     *  Creates the vector legend for the provided rules and adds it to the
     *  rules fieldset.
     */
    addVectorLegend: function(rules) {
        // use the symbolizer type of the 1st rule
        for (var symbolType in rules[0].symbolizer) {
            break;
        }
        this.symbolType = symbolType;
        this.items.get(2).add({
            xtype: "gx_vectorlegend",
            showTitle: false,
            rules: rules,
            symbolType: symbolType,
            selectOnClick: true,
            enableDD: true,
            listeners: {
                "ruleselected": function(cmp, rule) {
                    this.selectedRule = rule;
                    // enable the Remove, Edit and Duplicate buttons
                    var tbItems = this.items.get(3).items;
                    this.updateRuleRemoveButton();
                    tbItems.get(2).enable();
                    tbItems.get(3).enable();
                },
                "ruleunselected": function(cmp, rule) {
                    this.selectedRule = null;
                    // disable the Remove, Edit and Duplicate buttons
                    var tbItems = this.items.get(3).items;
                    tbItems.get(1).disable();
                    tbItems.get(2).disable();
                    tbItems.get(3).disable();
                },
                scope: this
            }
        });
        this.doLayout();
    }
});

/** api: xtype = gx_wmsstylesdialog */
Ext.reg('gx_wmsstylesdialog', gxp.WMSStylesDialog);