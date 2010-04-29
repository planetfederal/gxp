/**
 * Copyright (c) 2010 The Open Planning Project
 */

/** api: (define)
 *  module = gxp
 *  class = WMSStylesDialog
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Container>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: WMSStylesDialog(config)
 *   
 *      Create a dialog for selecting and modifying layer styles.
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
     *  to. Only required if the layer url does not provide ``SERVICE=WFS``
     */
    
    /** private: property[styles]
     *  ``Array(OpenLayers.Style)`` The style objects for the ``NamedLayer``
     *  of this ``layerRecord``. Only available if the WMS supports GetStyles.
     */
    styles: null,
    
    /** private: property[rulesFieldSet]
     *  ``Ext.form.FieldSet`` The fieldset with the rules. If GetStyles works
     *  on the WMS and we have an SLD, this will contain editable rules.
     *  Otherwise just a GetLegendGraphic image.
     */
    rulesFieldSet: null,
    
    /** private: property[rulesToolbar]
     *  ``Ext.Toolbar`` The toolbar for the ``rulesFieldSet``.
     */
    rulesToolbar: null,
    
    /** private: property[symbolType]
     *  ``Point`` or ``Line`` or ``Polygon`` - the primary symbol type for the
     *  layer. This is the symbolizer type of the first symbolizer of the
     *  first rule of the current layer style. Only available if the WMS
     *  supports GetStyles.
     */
    symbolType: null,
    
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
                style: "margin-bottom: 0;",
                items: this.createStylesCombo()
            }, {
                xtype: "toolbar",
                style: "border-width: 0 1px 1px 1px; margin-bottom: 10px;",
                items: [
                    {
                        xtype: "button",
                        iconCls: "add",
                        text: "Add"
                    }, {
                        xtype: "button",
                        iconCls: "delete",
                        text: "Remove"
                    }, {
                        xtype: "button",
                        iconCls: "edit",
                        text: "Edit"
                    }, {
                        xtype: "button",
                        iconCls: "duplicate",
                        text: "Duplicate"
                    }
                ]
            }]
        };
        Ext.applyIf(this, defConfig);
        
        gxp.WMSStylesDialog.superclass.initComponent.apply(this, arguments);
        
        // disable styles toolbar if we have no styles
        this.layerRecord.get("styles").length ||
            this.items.get(1).disable();

        var layer = this.layerRecord.get("layer");
        Ext.Ajax.request({
            method: "GET",
            url: layer.url,
            params: {
                request: "GetStyles",
                layers: layer.params.LAYERS
            },
            success: this.parseSLD,
            failure: this.createLegendImage,
            scope: this
        });
    },
    
    /** private: method[addRulesFieldSet]
     *  Creates the ``rulesFieldSet`` and adds it to this container.
     */
    addRulesFieldSet: function() {
        this.rulesFieldSet = new Ext.form.FieldSet({
            title: "Rules",
            autoScroll: true,
            style: "margin-bottom: 0;"
        });
        this.rulesToolbar = new Ext.Toolbar({
            style: "border-width: 0 1px 1px 1px;",
            items: [
                {
                    xtype: "button",
                    iconCls: "add",
                    text: "Add",
                    handler: function() {
                        var symbolizer = {};
                        symbolizer[this.symbolType] = {};
                        var legend = this.rulesFieldSet.items.get(0);
                        legend.rules.push(new OpenLayers.Rule({
                            name: gxp.RulePanel.prototype.uniqueRuleName.call(this),
                            symbolizer: symbolizer
                        }));
                        legend.update();
                    },
                    scope: this
                }, {
                    xtype: "button",
                    iconCls: "delete",
                    text: "Remove",
                    handler: function() {
                        var rule = this.selectedRule;
                        var legend = this.rulesFieldSet.items.get(0);
                        legend.unselect();
                        legend.rules.remove(rule);
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
                        var legend = this.rulesFieldSet.items.get(0);
                        legend.rules.push(this.selectedRule.clone());
                        legend.update();
                    },
                    scope: this,
                    disabled: true
                }
            ]
        });
        this.add(this.rulesFieldSet, this.rulesToolbar);
    },
    
    editRule: function() {
        var rule = this.selectedRule;
        var origRule = rule.clone();
        var saveOrigProperties = function() {
            origProperties = {
                title: rule.title,
                symbolizer: Ext.decode(Ext.encode(rule.symbolizer)),
                filter: rule.filter ? rule.filter.clone(): null,
                minScaleDenominator: rule.minScaleDenominator,
                maxScaleDenominator: rule.maxScaleDenominator
            };
        }
        saveOrigProperties();

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

        var ruleDlg = new Ext.Window({
            title: "Style Rule: " + (rule.title || rule.name),
            width: 340,
            autoHeight: true,
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
                    Ext.apply(rule, origProperties);
                    ruleDlg.close();
                }
            }, {
                text: "Apply",
                handler: function() {
                    this.rulesFieldSet.items.get(0).update();
                    saveOrigProperties();
                },
                scope: this
            }, {
                text: "Save",
                handler: function() {
                    this.rulesFieldSet.items.get(0).update();
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
        this.remove(this.rulesFieldSet);
        this.remove(this.rulesToolbar);
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
        try {
            var sld = new OpenLayers.Format.SLD().read(data);
            var layer = this.layerRecord.get("layer").params.LAYERS;
            
            this.styles = sld.namedLayers[layer].userStyles;
            
            //TODO use the default style instead of the 1st one
            var style = this.styles[0];
            
            this.addRulesFieldSet();
            this.addVectorLegend(style.rules);
        }
        catch(e) {
            var legendImage = this.createLegendImage();
            if (legendImage) {
                this.addRulesFieldSet();
                this.rulesFieldSet.add(legendImage);
                this.rulesToolbar.disable();
            }
        }
    },
    
    /** private: method[createStylesCombo]
     * 
     *  Returns a combo box with the available style names found for the layer
     *  in the capabilities document.
     */
    createStylesCombo: function() {
        var styles = this.layerRecord.get("styles");
        var store = new Ext.data.JsonStore({
            data: {
                styles: styles
            },
            root: "styles",
            idProperty: "name",
            fields: ["name", "title", "abstract", "legend"]
        });
        return new Ext.form.ComboBox({
            fieldLabel: "Choose style",
            store: store,
            displayField: "name",
            value: this.layerRecord.get("layer").params.STYLES ||
                styles.length ? styles[0].name : "default",
            disabled: !styles.length,
            mode: "local",
            typeAhead: true,
            triggerAction: "all",
            forceSelection: true,
            anchor: "100%",
            listeners: {
                "select": this.changeStyle,
                scope: this
            }
        });
    },
    
    /** private: method[createLegendImage]
     *  :return: ``GeoExt.LegendImage`` or undefined if none available.
     * 
     *  Creates a legend image for the first style of the current layer. This
     *  is used when GetStyles is not available from the layer's WMS.
     */
    createLegendImage: function() {
        var self = this;
        return new GeoExt.WMSLegend({
            showTitle: false,
            layerRecord: this.layerRecord,
            defaults: {
                listeners: {
                    "render": function() {
                        this.getEl().on({
                            "load": self.doLayout,
                            "error": self.removeRulesFieldSet,
                            scope: self
                        });
                    }
                }
            }
        });
    },
    
    /** private: method[changeStyle]
     *  :param field: ``Ext.form.Field``
     *  :param value: ``Ext.data.Record``
     * 
     *  Handler for the stylesCombo's ``select`` event. Updates the layer and
     *  the rulesFieldSet.
     */
    changeStyle: function(field, value) {
        var styleName = value.get("name");
        var layer = this.layerRecord.get("layer");
        
        //TODO remove when http://jira.codehaus.org/browse/GEOS-3921 is fixed
        var styles = this.layerRecord.get("styles");
        if (styles) {
            var style;
            for (var i=0, len=styles.length; i<len; ++i) {
                style = styles[i];
                if (style.name === styleName) {
                    break;
                }
            }
            var urlParts = value.get("legend").href.split("?");
            var params = Ext.urlDecode(urlParts[1]);
            params.STYLE = styleName;
            urlParts[1] = Ext.urlEncode(params);
            style.legend.href = urlParts.join("?");
        }
        //TODO end remove
        
        layer.mergeNewParams({styles: styleName});
        if (this.styles) {
            var style = this.styles[i];
            this.rulesFieldSet.remove(this.rulesFieldSet.items.get(0));
            this.addVectorLegend(style.rules);
        }
    },
    
    /** private: method[addVectorLegend]
     *  :param rules: ``Array``
     *
     *  Creates the vector legend for the provided rules and adds it to the
     *  ``rulesFieldSet``.
     */
    addVectorLegend: function(rules) {
        // use the symbolizer type of the 1st rule
        for (var symbolType in rules[0].symbolizer) {
            break;
        }
        this.symbolType = symbolType;
        this.rulesFieldSet.add({
            xtype: "gx_vectorlegend",
            showTitle: false,
            rules: rules,
            symbolType: symbolType,
            selectOnClick: true,
            enableDD: true,
            listeners: {
                "ruleselected": function(cmp, rule) {
                    var tbItems = this.rulesToolbar.items;
                    this.selectedRule = rule;
                    tbItems.get(1).enable();
                    tbItems.get(2).enable();
                    tbItems.get(3).enable();
                },
                "ruleunselected": function(cmp, rule) {
                    var tbItems = this.rulesToolbar.items;
                    this.selectedRule = null;
                    tbItems.get(1).disable();
                    tbItems.get(2).disable();
                    tbItems.get(3).disable();
                },
                scope: this
            }
        });
        this.rulesFieldSet.doLayout();
    }
});

/** api: xtype = gx_wmsstylesdialog */
Ext.reg('gx_wmsstylesdialog', gxp.WMSStylesDialog);