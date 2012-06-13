/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @include widgets/ScaleLimitPanel.js
 * @include widgets/TextSymbolizer.js
 * @include widgets/PolygonSymbolizer.js
 * @include widgets/LineSymbolizer.js
 * @include widgets/PointSymbolizer.js
 * @include widgets/FilterBuilder.js
 * @include widgets/grid/SymbolizerGrid.js
 */

/** api: (define)
 *  module = gxp
 *  class = RulePanel
 *  base_link = `Ext.TabPanel <http://extjs.com/deploy/dev/docs/?class=Ext.TabPanel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: RulePanel(config)
 *   
 *      Create a panel for assembling SLD rules.
 */
gxp.RulePanel = Ext.extend(Ext.TabPanel, {

    /** api: property[fonts]
     *  ``Array(String)`` List of fonts for the font combo.  If not set,
     *      defaults  to the list provided by the <Styler.FontComboBox>.
     */
    fonts: undefined,

    /** api: property[symbolType]
     *  ``String`` One of "Point", "Line", or "Polygon".  If no rule is 
     *  provided, default is "Point".
     */
    symbolType: "Point",

    /** api: config[rule]
     *  ``OpenLayers.Rule`` Optional rule provided in the initial
     *  configuration.  If a rule is provided and no `symbolType` is provided,
     *  the symbol type will be derived from the first symbolizer found in the
     *  rule.
     */
    rule: null,
    
    /** private: property[attributes]
     *  ``GeoExt.data.AttributeStore`` A configured attributes store for use
     *  in the filter property combo.
     */
    attributes: null,
    
    /** private: property[pointGraphics]
     *  ``Array`` A list of objects to be used as the root of the data for a
     *  JsonStore.  These will become records used in the selection of
     *  a point graphic.  If an object in the list has no "value" property,
     *  the user will be presented with an input to provide their own URL
     *  for an external graphic.  By default, names of well-known marks are
     *  provided.  In addition, the default list will produce a record with
     *  display of "external" that create an input for an external graphic
     *  URL.
     *
     *  Fields:
     * 
     *  * display - ``String`` The name to be displayed to the user.
     *  * preview - ``String`` URL to a graphic for preview.
     *  * value - ``String`` Value to be sent to the server.
     *  * mark - ``Boolean`` The value is a well-known name for a mark.  If
     *    false, the value will be assumed to be a url for an external graphic.
     */

    /** private: property[nestedFilters]
     *  ``Boolean`` Allow addition of nested logical filters.  This sets the
     *  allowGroups property of the filter builder.  Default is true.
     */
    nestedFilters: true,
    
    /** private: property[minScaleDenominatorLimit]
     *  ``Number`` Lower limit for scale denominators.  Default is what you get
     *  when  you assume 20 zoom levels starting with the world in Spherical
     *  Mercator on a single 256 x 256 tile at zoom 0 where the zoom factor is
     *  2.
     */
    minScaleDenominatorLimit: Math.pow(0.5, 19) * 40075016.68 * 39.3701 * OpenLayers.DOTS_PER_INCH / 256,

    /** private: property[maxScaleDenominatorLimit]
     *  ``Number`` Upper limit for scale denominators.  Default is what you get
     *  when you project the world in Spherical Mercator onto a single
     *  256 x 256 pixel tile and assume OpenLayers.DOTS_PER_INCH (this
     *  corresponds to zoom level 0 in Google Maps).
     */
    maxScaleDenominatorLimit: 40075016.68 * 39.3701 * OpenLayers.DOTS_PER_INCH / 256,
    
    /** private: property [scaleLevels]
     *  ``Number`` Number of scale levels to assume.  This is only for scaling
     *  values exponentially along the slider.  Scale values are not
     *  required to one of the discrete levels.  Default is 20.
     */
    scaleLevels: 20,
    
    /** private: property[scaleSliderTemplate]
     *  ``String`` Template for the tip displayed by the scale threshold slider.
     *
     *  Can be customized using the following keywords in curly braces:
     *  
     *  * zoom - the zoom level
     *  * scale - the scale denominator
     *  * type - "Max" or "Min" denominator
     *  * scaleType - "Min" or "Max" scale (sense is opposite of type)
     *
     *  Default is "{scaleType} Scale 1:{scale}".
     */
    scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
    
    /** private: method[modifyScaleTipContext]
     *  Called from the multi-slider tip's getText function.  The function
     *  will receive two arguments - a reference to the panel and a data
     *  object.  The data object will have scale, zoom, and type properties
     *  already calculated.  Other properties added to the data object
     *  are available to the <scaleSliderTemplate>.
     */
    modifyScaleTipContext: Ext.emptyFn,
    
    /** i18n */
    ruleText: "Rule",
    symbologyText: "Symbology",
    limitByScaleText: "Limit by scale",
    limitByConditionText: "Limit with filters",
    symbolText: "Preview",
    nameText: "Label",
    legendPropertiesText: "Legend properties",
    propertiesSuffix: "Properties",

    /** private */
    initComponent: function() {
        
        var defConfig = {
            plain: true,
            border: false
        };
        Ext.applyIf(this, defConfig);
        
        if(!this.rule) {
            this.rule = new OpenLayers.Rule({
                name: this.uniqueRuleName()
            });
        } else {
            if (!this.initialConfig.symbolType) {
                this.symbolType = this.getSymbolTypeFromRule(this.rule) || this.symbolType;
            }
        }
        
        this.activeTab = 0;
        
        /**
         * The interpretation here is that scale values of zero are equivalent to
         * no scale value.  If someone thinks that a scale value of zero should have
         * a different interpretation, this needs to be changed.
         */
        this.scaleLimitPanel = new gxp.ScaleLimitPanel({
            maxScaleDenominator: this.rule.maxScaleDenominator || undefined,
            limitMaxScaleDenominator: !!this.rule.maxScaleDenominator,
            maxScaleDenominatorLimit: this.maxScaleDenominatorLimit,
            minScaleDenominator: this.rule.minScaleDenominator || undefined,
            limitMinScaleDenominator: !!this.rule.minScaleDenominator,
            minScaleDenominatorLimit: this.minScaleDenominatorLimit,
            scaleLevels: this.scaleLevels,
            scaleSliderTemplate: this.scaleSliderTemplate,
            modifyScaleTipContext: this.modifyScaleTipContext,
            listeners: {
                change: function(comp, min, max) {
                    this.rule.minScaleDenominator = min;
                    this.rule.maxScaleDenominator = max;
                    this.fireEvent("change", this, this.rule);
                },
                scope: this
            }
        });
        
        this.filterBuilder = new gxp.FilterBuilder({
            allowGroups: this.nestedFilters,
            allowCQL: true,
            filter: this.rule && this.rule.filter && this.rule.filter.clone(),
            attributes: this.attributes,
            listeners: {
                change: function(builder) {
                    var filter = builder.getFilter(); 
                    this.rule.filter = filter;
                    this.fireEvent("change", this, this.rule);
                },
                scope: this
            }
        });
        
        if (this.getSymbolTypeFromRule(this.rule) || this.symbolType) {
            this.items = [
                this.createRulePanel(),
                this.createSymbolizerPanel()
            ];
        }

        this.addEvents(
            /** api: events[change]
             *  Fires when any rule property changes.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.RulePanel` This panel.
             *  * rule - ``OpenLayers.Rule`` The updated rule.
             */
            "change"
        ); 
        
        this.on({
            tabchange: function(panel, tab) {
                tab.doLayout();
            },
            scope: this
        });

        gxp.RulePanel.superclass.initComponent.call(this);
    },

    /** private: method[uniqueRuleName]
     *  Generate a unique rule name.  This name will only be unique for this
     *  session assuming other names are created by the same method.  If
     *  name needs to be unique given some other context, override it.
     */
    uniqueRuleName: function() {
        return OpenLayers.Util.createUniqueID("rule_");
    },
    
    /** private: method[createRulePanel]
     *  Creates a panel config containing rule name, limit with filters and
     *  limit by scale.
     */
    createRulePanel: function() {
        this.symbolizerSwatch = new GeoExt.FeatureRenderer({
            symbolType: this.symbolType,
            isFormField: true,
            width: 25
        });
        return {
            xtype: "form",
            title: this.ruleText,
            autoScroll: true,
            bodyStyle: {"padding": "10px"},
            border: false,
            items: [{
                xtype: "fieldset",
                title: this.legendPropertiesText,
                items: [{
                    xtype: "compositefield",
                    hideLabel: true,
                    items: [{
                        xtype: "label",
                        width: 75,
                        text: this.nameText + ": ",
                        cls: "gxp-layerproperties-label"
                    }, {
                        xtype: "textfield",
                        flex: 1,
                        value: this.rule && (this.rule.title || this.rule.name || ""),
                        listeners: {
                            change: function(el, value) {
                                this.rule.title = value;
                                this.fireEvent("change", this, this.rule);
                            },
                            scope: this
                        }
                    }, {
                        xtype: "label",
                        width: 75,
                        text: this.symbolText + ": ",
                        cls: "gxp-layerproperties-label"
                    }, this.symbolizerSwatch]
                }]
            }, {
                xtype: "fieldset",
                title: this.limitByConditionText,
                checkboxToggle: true,
                collapsed: !(this.rule && this.rule.filter),
                autoHeight: true,
                items: [this.filterBuilder],
                listeners: {
                    collapse: function(){
                        delete this.rule.filter;
                        this.fireEvent("change", this, this.rule);
                    },
                    expand: function(){
                        var changed = false;
                        this.rule.filter = this.filterBuilder.getFilter();
                        this.fireEvent("change", this, this.rule);
                    },
                    scope: this
                }
            }, {
                xtype: "fieldset",
                title: this.limitByScaleText,
                checkboxToggle: true,
                collapsed: !(this.rule && (this.rule.minScaleDenominator || this.rule.maxScaleDenominator)),
                autoHeight: true,
                items: [this.scaleLimitPanel],
                listeners: {
                    collapse: function() {
                        delete this.rule.minScaleDenominator;
                        delete this.rule.maxScaleDenominator;
                        this.fireEvent("change", this, this.rule);
                    },
                    expand: function() {
                        /**
                         * Start workaround for
                         * http://projects.opengeo.org/suite/ticket/676
                         */
                        var tab = this.getActiveTab();
                        this.activeTab = null;
                        this.setActiveTab(tab);
                        /**
                         * End workaround for
                         * http://projects.opengeo.org/suite/ticket/676
                         */
                        var changed = false;
                        if (this.scaleLimitPanel.limitMinScaleDenominator) {
                            this.rule.minScaleDenominator = this.scaleLimitPanel.minScaleDenominator;
                            changed = true;
                        }
                        if (this.scaleLimitPanel.limitMaxScaleDenominator) {
                            this.rule.maxScaleDenominator = this.scaleLimitPanel.maxScaleDenominator;
                            changed = true;
                        }
                        if (changed) {
                            this.fireEvent("change", this, this.rule);
                        }
                    },
                    scope: this
                }
            }]
        };
    },

    /** private: method[createSymbolizerPanel]
     */
    createSymbolizerPanel: function() {
        this.symbolizerSwatch.setSymbolizers(this.rule.symbolizers,
            {draw: this.symbolizerSwatch.rendered}
        );

        var cfg = {
            xtype: 'panel',
            layout: 'fit',
            title: this.symbologyText,
            items: [{
                xtype: 'container',
                height: 300,
                layout: 'vbox',
                layoutConfig: {
                    align: 'stretch',
                    pack: 'start'
                },
                items: [{
                    xtype: "gxp_symbolgrid",
                    ref: "../../grid",
                    symbolType: this.symbolType,
                    autoScroll: true,
                    symbolizers: this.rule.symbolizers,
                    height: 150,
                    listeners: {
                        click: function(node) {
                            this.properties.removeAll(true);
                            this.properties.setTitle('');
                            if (node.parentNode === this.grid.getRootNode()) {
                                return;
                            } 
                            var type = node.attributes.type;
                            this.properties.setTitle(node.parentNode.attributes.type + " " + type + " " + this.propertiesSuffix);
                            var config = {
                                symbolizer: node.attributes.symbolizer
                            };
                            var xtype = "gxp_" + type.toLowerCase() + "symbolizer";
                            if (type === 'Graphic' || type === 'Mark') {
                                xtype = "gxp_pointsymbolizer";
                                config.filter = gxp.PointSymbolizer[type.toUpperCase()];
                            }
                            if (type === 'Label') {
                                xtype = "gxp_textsymbolizer";
                            }
                            if (type === 'Fill' || type === 'Stroke') {
                                config.checkboxToggle = false;
                                config.titleText = '';
                            }
                            this.properties.add(Ext.apply({
                                listeners: {
                                    change: function(symbolizer) {
                                        node.getUI().toggleCheck(true);
                                        this.grid.updateSwatch(node, symbolizer);
                                    },
                                    scope: this
                                },
                                autoScroll: true,
                                attributes: this.attributes,
                                bodyStyle: {"padding": "5px"},
                                xtype: xtype
                            }, config));
                            this.properties.doLayout();
                        },
                        change: function(grid) {
                            var symbolizers = grid.getSymbolizers();
                            this.symbolizerSwatch.setSymbolizers(
                                symbolizers, {draw: this.symbolizerSwatch.rendered}
                            );
                            this.rule.symbolizers = symbolizers;
                            this.fireEvent("change", this, this.rule);
                        },
                        scope: this
                    }
                }, {
                    xtype: 'panel',
                    ref: "../../properties",
                    layout: 'fit',
                    title: '&nbsp;',
                    flex: 1
                }]
            }]
        };
        return cfg;
        
    },

    /** private: method[getSymbolTypeFromRule]
     *  :arg rule: `OpenLayers.Rule`
     *  :return: `String` "Point", "Line" or "Polygon" (or undefined if none
     *      of the three.
     *
     *  Determines the symbol type of the first symbolizer of a rule that is
     *  not a text symbolizer
     */
    getSymbolTypeFromRule: function(rule) {
        var candidate, type;
        for (var i=0, ii=rule.symbolizers.length; i<ii; ++i) {
            candidate = rule.symbolizers[i];
            if (!(candidate instanceof OpenLayers.Symbolizer.Text)) {
                type = candidate.CLASS_NAME.split(".").pop();
                break;
            }
        }
        return type;
    }

});

/** api: xtype = gxp_rulepanel */
Ext.reg('gxp_rulepanel', gxp.RulePanel); 
