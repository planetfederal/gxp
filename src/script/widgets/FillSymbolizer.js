/**
 * Copyright (c) 2008-2010 The Open Planning Project
 * 
 * @include widgets/form/ColorField.js
 */

/** api: (define)
 *  module = gxp
 *  class = FillSymbolizer
 *  base_link = `Ext.FormPanel <http://extjs.com/deploy/dev/docs/?class=Ext.FormPanel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: FillSymbolizer(config)
 *   
 *      Form for configuring a symbolizer fill.
 */
gxp.FillSymbolizer = Ext.extend(Ext.FormPanel, {
    
    /** api: config[symbolizer]
     *  ``Object``
     *  A symbolizer object that will be used to fill in form values.
     *  This object will be modified when values change.  Clone first if
     *  you do not want your symbolizer modified.
     */
    symbolizer: null,
    
    /** api: config[colorManager]
     *  ``Function``
     *  Optional color manager constructor to be used as a plugin for the color
     *  field.
     */
    colorManager: null,
    
    /** api: config[checkboxToggle]
     *  ``Boolean`` Set to false if the "Fill" fieldset should not be
     *  toggleable. Default is true.
     */
    checkboxToggle: true,
    
    /** api: config[defaultColor]
     *  ``String`` Default background color for the Color field. This
     *  color will be displayed when no fillColor value for the symbolizer
     *  is available. Defaults to the ``fillColor`` property of
     *  ``OpenLayers.Renderer.defaultSymbolizer``.
     */
    defaultColor: null,

    border: false,
    
    initComponent: function() {
        
        if(!this.symbolizer) {
            this.symbolizer = {};
        }
        
        var colorFieldPlugins;
        if (this.colorManager) {
            colorFieldPlugins = [new this.colorManager];
        }
        
        this.items = [{
            xtype: "fieldset",
            title: "Fill",
            autoHeight: true,
            checkboxToggle: this.checkboxToggle,
            collapsed: this.checkboxToggle === true &&
                this.symbolizer.fill === false,
            hideMode: "offsets",
            defaults: {
                width: 100 // TODO: move to css
            },
            items: [{
                xtype: "gx_colorfield",
                fieldLabel: "Color",
                name: "color",
                value: ("fillColor" in this.symbolizer) ? this.symbolizer.fillColor : OpenLayers.Renderer.defaultSymbolizer.fillColor,
                defaultBackground: this.defaultColor ||
                    OpenLayers.Renderer.defaultSymbolizer.fillColor,
                plugins: colorFieldPlugins,
                listeners: {
                    valid: function(field) {
                        this.symbolizer.fillColor = field.getValue();
                        this.fireEvent("change", this.symbolizer);
                    },
                    scope: this
                }
            }, {
                xtype: "slider",
                fieldLabel: "Opacity",
                name: "opacity",
                values: [(("fillOpacity" in this.symbolizer) ? this.symbolizer.fillOpacity : OpenLayers.Renderer.defaultSymbolizer.fillOpacity) * 100],
                isFormField: true,
                listeners: {
                    changecomplete: function(slider, value) {
                        this.symbolizer.fillOpacity = value / 100;
                        this.fireEvent("change", this.symbolizer);
                    },
                    scope: this
                },
                plugins: [
                    new GeoExt.SliderTip({
                        getText: function(slider) {
                            return slider.getValue() + "%";
                        }
                    })
                ]
            }],
            listeners: {
                "collapse": function() {
                    this.symbolizer.fill = false;
                    this.fireEvent("change", this.symbolizer);
                },
                "expand": function() {
                    this.symbolizer.fill = true;
                    this.fireEvent("change", this.symbolizer);
                },
                scope: this
            }
        }];

        this.addEvents(
            /**
             * Event: change
             * Fires before any field blurs if the field value has changed.
             *
             * Listener arguments:
             * symbolizer - {Object} A symbolizer with fill related properties
             *     updated.
             */
            "change"
        ); 

        gxp.FillSymbolizer.superclass.initComponent.call(this);
        
    }
    
    
});

/** api: xtype = gx_fillsymbolizer */
Ext.reg('gx_fillsymbolizer', gxp.FillSymbolizer);
