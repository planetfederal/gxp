/**
 * Copyright (c) 2009 The Open Planning Project
 */

/**
 * @requires widgets/form/ComparisonComboBox.js
 */

Ext.namespace("gxp.form");
gxp.form.FilterField = Ext.extend(Ext.form.CompositeField, {

    /**
     * Property: allowBlank
     * {boolean} Specify <code>false</code> to validate that the value's length is > 0
     * (defaults to <code>true</code>)
     */
    allowBlank: true,

    /**
     * Property: filter
     * {OpenLayers.Filter} Optional non-logical filter provided in the initial
     *     configuration.  To retreive the filter, use <getFilter> instead
     *     of accessing this property directly.
     */
    filter: null,
    
    /**
     * Property: attributes
     * {GeoExt.data.AttributeStore} A configured attributes store for use in
     *     the filter property combo.
     */
    attributes: null,
    
    /**
     * Property: attributesComboConfig
     * {Object}
     */
    attributesComboConfig: null,

    initComponent: function() {
        if(!this.filter) {
            this.filter = this.createDefaultFilter();
        }
        if(!this.filter.type) {
            this.filter.type = OpenLayers.Filter.Comparison.EQUAL_TO;
        }
        if(!this.attributes) {
            this.attributes = new GeoExt.data.AttributeStore();
        }

        var defAttributesComboConfig = {
            xtype: "combo",
            mode: "local",
            store: this.attributes,
            editable: false,
            triggerAction: "all",
            allowBlank: this.allowBlank,
            displayField: "name",
            valueField: "name",
            value: this.filter.property,
            listeners: {
                select: this.attributeSelected,
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

        gxp.form.FilterField.superclass.initComponent.call(this);
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
        var idx = this.attributes.find("name", this.filter.property);
        var type = idx != -1 ? this.getFieldType(this.attributes.getAt(idx).get("type")) : null;
        return [
            this.attributesComboConfig, {
                xtype: "gx_comparisoncombo",
                value: this.filter.type,
                allowBlank: this.allowBlank,
                listeners: {
                    select: function(combo, record) {
                        this.filter.type = record.get("value");
                        this.fireEvent("change", this.filter);
                    },
                    scope: this
                }
            }, this.createValueFieldConfig(type, this.filter.value)
        ];
    },

    /**
     * Method: createValueFieldConfig
     * Creates a config object for the value field based upon the
     * attribute type
     */
    createValueFieldConfig: function(attrType, value) {
        switch(attrType) {
        case "date":
            return {
                xtype: "datefield",
                value: value,
                width: 90,
                format: "d-m-Y",
                altFormats: Ext.form.DateField.prototype.altFormats + "|Y-m-d\\TH:i:sP",
                allowBlank: this.allowBlank,
                listeners: {
                    change: function(el, value) {
                        this.filter.value = value.format("Y-m-d\\TH:i:sP");
                        this.fireEvent("change", this.filter);
                    },
                    scope: this
                }
            };
        default:
            return {
                xtype: "textfield",
                value: value,
                width: 90,
                anchor: "100%",
                allowBlank: this.allowBlank,
                listeners: {
                    change: function(el, value) {
                        this.filter.value = value;
                        this.fireEvent("change", this.filter);
                    },
                    scope: this
                }
            };
        }
    },

    /** 
     *  Method: attributeSelected
     *  Called when the value of the attribute combo box changes
     */
    attributeSelected: function(combo, record) {
        this.filter.property = record.get("name");

        var type = this.getFieldType(record.get("type"));
        var config = this.createValueFieldConfig(type);

        this.innerCt.remove(this.innerCt.get(2), true);
        this.innerCt.insert(2, config);
        this.innerCt.doLayout();

        this.fireEvent("change", this.filter);
    },

    /** private: method[getFieldType]
     *  :param attrType: ``String`` Attribute type.
     *  :returns: ``String`` Field type
     *
     *  Given a feature attribute type, return an Ext field type if possible.
     *  Note that there are many unhandled xsd types here.
     *  
     *  TODO: this should go elsewhere (AttributeReader)
     */
    getFieldType: function(attrType) {
        return ({
            "xsd:boolean": "boolean",
            "xsd:int": "int",
            "xsd:integer": "int",
            "xsd:short": "int",
            "xsd:long": "int",
            "xsd:date": "date",
            "xsd:dateTime": "date",
            "xsd:string": "string",
            "xsd:float": "float",
            "xsd:double": "float"
        })[attrType];
    }

});

Ext.reg('gx_filterfield', gxp.form.FilterField);
