/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */


/**
 * @require OpenLayers/Renderer.js
 * @require
 */


/** api: (define)
 *  module = gxp
 *  class = ClassificationPanel
 *  base_link = `Ext.TabPanel <http://extjs.com/deploy/dev/docs/?class=Ext.TabPanel>`_
 */
Ext.namespace("gxp");


/** api: constructor
 *  .. class:: ClassificationPanel(config)
 *
 *      Create a dialog for generating a classified styling for a layer,
 *      with options for specifying the number of classes,
 *      classification method, and choice of color ramps.
 */
gxp.ClassificationPanel = Ext.extend(Ext.Panel, {

    hidden: false,
    rulePanel: null,
    customRamp: "Custom",

    classNumberText: 'Classes',
    classifyText: "Classify",
    rampBlueText: "Blue",
    rampRedText: "Red",
    rampOrangeText: "Orange",
    rampJetText: "Blue-Red",
    rampGrayText: "Gray",
    rampRandomText: "Random",
    rampCustomText: "Custom",
    selectColorText: "Select colors",
    colorStartText: "Start Color",
    colorEndText: "End Color",
    colorRampText: 'Color Ramp',
    methodText: "Method",
    methodUniqueText: "Unique Values",
    methodQuantileText: "Quantile",
    methodEqualText: "Equal Intervals",
    methodJenksText: "Jenks Natural Breaks",
    selectMethodText: "Select method",
    standardDeviationText: "Standard Deviations",
    attributeText: "Attribute",
    selectAttributeText: "Select attribute",
    startColor: "#FEE5D9",
    endColor: "#A50F15",
    generateRulesText: "Apply",
    reverseColorsText: "Reverse colors",


    initComponent: function() {
        var colorFieldPlugins;
        if (this.rulePanel.colorManager) {
            colorFieldPlugins = [new this.rulePanel.colorManager];
        }

        var colorPanel =    new Ext.Panel({
            hidden: true,
            layout: 'form',
            bodyStyle: {padding: "10px"},
            border: false,
            labelWidth: 70,
            defaults: {
                labelWidth: 70
            },
            items: [
                {
                    xtype: "gxp_colorfield",
                    id: "choropleth_color_start",
                    name: "color_start",
                    fieldLabel: this.colorStartText,
                    emptyText: OpenLayers.Renderer.defaultSymbolizer.strokeColor,
                    value: this.startColor,
                    defaultBackground: this.startColor,
                    plugins: colorFieldPlugins,
                    listeners: {
                        valid: function(field) {
                            this.rulePanel.rule[field.name] = field.getValue();
                        },
                        scope: this
                    }
                },
                {   xtype: "gxp_colorfield",
                    id: "choropleth_color_end",
                    name: "color_end",
                    fieldLabel: this.colorEndText,
                    emptyText: OpenLayers.Renderer.defaultSymbolizer.strokeColor,
                    value: this.endColor,
                    defaultBackground: this.endColor,
                    plugins: colorFieldPlugins,
                    listeners: {
                        valid: function(field) {
                            this.rulePanel.rule[field.name] = field.getValue();
                        },
                        scope: this
                    }
                }
            ]
        });

        var classNumSelector = new Ext.ux.form.SpinnerField({
            fieldLabel: this.classNumberText,
            id: "choropleth_classes",
            minValue: 2,
            name: 'intervals',
            defaultValue: 5,
            width: 110,
            listeners: {
                'change':function(spinner, value){
                    this.rulePanel.rule[classNumSelector.name] = value;
                },
                scope: this
            }
        });

        this.rulePanel.rule[classNumSelector.name] = classNumSelector.defaultValue;

        var colorDropdown = new Ext.form.ComboBox({
            id: 'choropleth_colorramp',
            name: 'ramp',
            fieldLabel: this.colorRampText,
            store:  new Ext.data.ArrayStore({
                id: 0,
                fields: [
                    'colorramp',
                    'label'
                ],
                data: [
                    ['Blue',this.rampBlueText],
                    ['Red', this.rampRedText],
                    ['Orange', this.rampOrangeText],
                    ['Jet', this.rampJetText],
                    ['Gray', this.rampGrayText],
                    ['Random', this.rampRandomText],
                    ['Custom', this.rampCustomText]]
            }),
            mode: 'local',
            width: 110,
            displayField: "label",
            valueField: "colorramp",
            editable: false,
            emptyText: this.selectColorText,
            triggerAction: 'all',
            disabled: false,
            listeners: {
                'select': function(cmb, data, idx) {
                    //If Custom: display start, end, middle color picker;
                    colorPanel.setVisible(cmb.value == this.customRamp);

                    switch(cmb.value) {
                        case "Blue":
                            this.rulePanel.rule["color_start"] = "#f7fbff";
                            this.rulePanel.rule["color_end"] = "#08306b";
                            this.rulePanel.rule[cmb.name] = this.customRamp;
                            break;
                        case "Red":
                            this.rulePanel.rule["color_start"] = "#fff5f0";
                            this.rulePanel.rule["color_end"] = "#67000d";
                            this.rulePanel.rule[cmb.name] = this.customRamp;
                            break;
                        case "Orange":
                            this.rulePanel.rule["color_start"] = "#fff5eb";
                            this.rulePanel.rule["color_end"] = "#f16913";
                            this.rulePanel.rule[cmb.name] = this.customRamp;
                            break;
                        case "Jet":
                            this.rulePanel.rule[cmb.name] = "Jet";
                            break;
                        default:
                            this.rulePanel.rule["color_mid"] = "";
                            this.rulePanel.rule[cmb.name] = cmb.value;
                    }

                },
                scope: this
            }
        });

        var methodDropdown = new Ext.form.ComboBox({
            id: 'choropleth_method',
            name: 'method',
            fieldLabel: this.methodText,
            store:  new Ext.data.ArrayStore({
                id: 0,
                mode: 'local',
                autoDestroy: true,
                storeId: 'method_array_store',
                fields: [
                    'value', 'label'
                ],
                data: [
                    ['uniqueInterval', this.methodUniqueText],
                    ['quantile', this.methodQuantileText],
                    ['equalInterval', this.methodEqualText],
                    ['jenks', this.methodJenksText]
                ]
            }),
            displayField: 'label',
            valueField: 'value',
            mode: 'local',
            width: 110,
            editable: false,
            emptyText: this.selectMethodText,
            triggerAction: 'all',
            disabled: false,
            listeners: {
                'select': function(cmb, data, idx) {

                    //If uniqueInterval: disable # classes
                    classNumSelector.setDisabled(cmb.value == "uniqueInterval");
                    this.rulePanel.rule[cmb.name] = cmb.value;
                },
                scope: this
            }
        });

        var attributeDropdown =  new Ext.form.ComboBox({
            id: 'choropleth_attribute',
            name: 'attribute',
            fieldLabel: this.attributeText,
            store: this.rulePanel.attributes,
            displayField: 'name',
            valueField: 'name',
            triggerAction: 'all',
            mode: 'local',
            width: 110,
            editable: false,
            emptyText: this.selectAttributeText,
            disabled: false,
            listeners: {
                'select': function(cmb, data, idx) {
                    this.rulePanel.rule[cmb.name] = cmb.value;
                    methodDropdown.clearValue();
                    var methodStore =   methodDropdown.getStore();
                    for (var i = 0, ii=methodStore.data.length; i <ii ; i++) {
                        methodStore.getAt(i).disabled = (cmb.getStore().getAt(idx).get("type") == "xsd:string" ? methodStore.getAt(i).get("value") != "uniqueInterval": false);
                    }
                    methodStore.loadData(cmb.getStore().getAt(idx).get("type") == "xsd:string" ?
                        [['uniqueInterval',this.methodUniqueText]]
                        :[['uniqueInterval',this.methodUniqueText],
                        ['quantile', this.methodQuantileText],
                        ['equalInterval',this.methodEqualText],
                        ['jenks', this.methodJenksText]]
                    );
                },
                scope: this
            }
        });

        this.items = [
            {
                xtype:"fieldset",
                title:this.classifyText,
                labelWidth:85,
                style:"margin-bottom: 0;",
                items: [
                    //Dropdown: attributes
                    attributeDropdown,
                    //Dropdown: classification mode
                    methodDropdown,
                    //Classes, use http://dev.sencha.com/deploy/ext-3.4.0/examples/spinner/spinner.html
                    classNumSelector,
                    //Dropdown: color ramp
                    colorDropdown,
                    //Checkbox: Generate classification rules
                    {
                        xtype: 'checkbox',
                        name: 'reverse',
                        checked: false,
                        ctCls: 'x-checkbox-inline',
                        hideLabel: true,
                        labelSeparator: '',
                        labelStyle: 'display:inline;',
                        boxLabel: this.reverseColorsText,
                        handler: function(item, e)
                        {
                            this.rulePanel.rule['reverse'] = item.checked;
                        },
                        scope: this
                    },
                    //Text field /  Ext.menu.ColorMenu: start color
                    colorPanel,
                    {
                        xtype: 'button',
                        name: 'apply',
                        text: this.generateRulesText,
                        fieldLabel: '&nbsp;',
                        style: 'margin-top:10px;',
                        labelSeparator: '',
                        handler: function (item, e) {
                            this.rulePanel.fireEvent("change", this.rulePanel, this.rulePanel.rule);
                        },
                        scope: this
                    }
                ]
            }
        ]
        gxp.ClassificationPanel.superclass.initComponent.call(this);
    }

});

/** api: xtype = gxp_classificationpanel */
Ext.reg('gxp_classificationpanel', gxp.ClassificationPanel);