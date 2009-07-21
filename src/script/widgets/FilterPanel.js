/**
 * Copyright (c) 2009 OpenGeo
 */

/**
 * @include widgets/form/ComparisonComboBox.js
 */

Ext.namespace("gxp");
gxp.FilterPanel = Ext.extend(Ext.Panel, {
    
    /**
     * Property: filter
     * {OpenLayers.Filter} Optional non-logical filter provided in the initial
     *     configuration.  To retreive the filter, use <getFilter> instead
     *     of accessing this property directly.
     */
    filter: null,
    
    /**
     * Property: attributes
     * {gxp.data.AttributeStore} A configured attributes store for use in
     *     the filter property combo.
     */
    attributes: null,
    
    /**
     * Property: attributesComboConfig
     * {Object}
     */
    attributesComboConfig: null,

    initComponent: function() {
        
        var defConfig = {
            plain: true,
            border: false
        };
        Ext.applyIf(this, defConfig);
        
        if(!this.filter) {
            this.filter = this.createDefaultFilter();
        }
        if(!this.attributes) {
            this.attributes = new gxp.data.AttributeStore();
        }

        var defAttributesComboConfig = {
            xtype: "combo",
            store: this.attributes,
            editable: false,
            triggerAction: "all",
            hideLabel: true,
            allowBlank: false,
            displayField: "name",
            valueField: "name",
            value: this.filter.property,
            listeners: {
                select: function(combo, record) {
                    this.filter.property = record.get("name");
                    this.fireEvent("change", this.filter);
                },
                scope: this
            },
            width: 120
        };
        this.attributesComboConfig = this.attributesComboConfig || {};
        Ext.applyIf(this.attributesComboConfig, defAttributesComboConfig);

        this.items = this.createFilterItems();
        
        this.addEvents(
            /**
             * Event: change
             * Fires when the filter changes.
             *
             * Listener arguments:
             * filter - {OpenLayers.Filter} This filter.
             */
            "change"
        ); 

        gxp.FilterPanel.superclass.initComponent.call(this);
    },
    
    /**
     * Method: createDefaultFilter
     * May be overridden to change the default filter.
     *
     * Returns:
     * {OpenLayers.Filter} By default, returns a comarison filter.
     */
    createDefaultFilter: function() {
        return new OpenLayers.Filter.Comparison();
    },
    
    /**
     * Method: createFilterItems
     * Creates a panel config containing filter parts.
     */
    createFilterItems: function() {
        
        return [{
            layout: "column",
            border: false,
            defaults: {border: false},
            items: [{
                width: this.attributesComboConfig.width, 
                items: [this.attributesComboConfig]
            }, {
                items: [{
                    xtype: "gxp_comparisoncombo",
                    value: this.filter.type,
                    listeners: {
                        select: function(combo, record) {
                            this.filter.type = record.get("value");
                            this.fireEvent("change", this.filter);
                        },
                        scope: this
                    }
                }]
            }, {
                items: [{
                    xtype: "textfield",
                    width: 120,
                    value: this.filter.value,
                    allowBlank: false,
                    listeners: {
                        change: function(el, value) {
                            this.filter.value = value;
                            this.fireEvent("change", this.filter);
                        },
                        scope: this
                    }
                }]
            }]
        }];
    }

});

Ext.reg('gxp_filterpanel', gxp.FilterPanel); 