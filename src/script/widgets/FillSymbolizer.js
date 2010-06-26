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
            defaults: {
                width: 100 // TODO: move to css
            },
            items: [{
                xtype: "gx_colorfield",
                fieldLabel: "Color",
                name: "color",
                value: this.symbolizer["fillColor"],
                plugins: colorFieldPlugins,
                listeners: {
                    valid: function(field) {
                        this.symbolizer["fillColor"] = field.getValue();
                        this.fireEvent("change", this.symbolizer);
                    },
                    scope: this
                }
            }, {
                xtype: "slider",
                fieldLabel: "Opacity",
                name: "opacity",
                values: [(this.symbolizer["fillOpacity"] == null) ? 100 : this.symbolizer["fillOpacity"] * 100],
                isFormField: true,
                listeners: {
                    changecomplete: function(slider, value) {
                        this.symbolizer["fillOpacity"] = value / 100;
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
            }]
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
