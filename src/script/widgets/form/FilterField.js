/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @include widgets/form/ComparisonComboBox.js
 * @requires GeoExt/data/AttributeStore.js
 */

/** api: (define)
 *  module = gxp.form
 *  class = FilterField
 *  base_link = `Ext.form.CompositeField <http://extjs.com/deploy/dev/docs/?class=Ext.form.CompositeField>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: FilterField(config)
 *   
 *      A form field representing a comparison filter.
 */
gxp.form.FilterField = Ext.extend(Ext.form.CompositeField, {
    
    /** api:config[lowerBoundaryTip]
     *  ``String`` tooltip for the lower boundary textfield (i18n)
     */
    lowerBoundaryTip: "lower boundary",
     
    /** api:config[upperBoundaryTip]
     *  ``String`` tooltip for the lower boundary textfield (i18n)
     */
    upperBoundaryTip: "upper boundary",
     
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

    /** api:config[comparisonComboConfig]
     *  ``Object`` Config object for comparison combobox.
     */

    /** api:config[attributesComboCfg]
     *  ``Object`` Config object for attributes combobox.
     */
    
    /**
     * Property: attributesComboConfig
     * {Object}
     */
    attributesComboConfig: null,

    initComponent: function() {
                
        if(!this.filter) {
            this.filter = this.createDefaultFilter();
        }
        // Maintain compatibility with QueryPanel, which relies on "remote"
        // mode and the filterBy filter applied in it's attributeStore's load
        // listener *after* the initial combo filtering.
        //TODO Assume that the AttributeStore is already loaded and always
        // create a new one without geometry fields.
        var mode = "remote", attributes = new GeoExt.data.AttributeStore();
        if (this.attributes) {
            if (this.attributes.getCount() != 0) {
                mode = "local";
                this.attributes.each(function(r) {
                    var match = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/.exec(r.get("type"));
                    match || attributes.add([r]);
                });
            } else {
                attributes = this.attributes;
            }
        }

        var defAttributesComboConfig = {
            xtype: "combo",
            store: attributes,
            editable: mode == "local",
            typeAhead: true,
            forceSelection: true,
            mode: mode,
            triggerAction: "all",
            ref: "property",
            allowBlank: this.allowBlank,
            displayField: "name",
            valueField: "name",
            value: this.filter.property,
            margins: '0 5 0 0',
            listeners: {
                select: function(combo, record) {
                    //create comparision and value field based on chosen attribute
                    //remove prev fields if they exist
                    
                    this.items.clear();
                    
                    var fieldsToRemove = this.innerCt.findBy(function(c) {
			            return c.isFormField && combo!=c;
			        }, this);
                    
                    for (var i = 0; i < fieldsToRemove.length; i++) {
                        this.innerCt.remove(fieldsToRemove[i],true);
                    }
                    
                    var cfg = this.createFilterItems(record);
                    this.innerCt.add(cfg);
                    
                    var fields = this.innerCt.findBy(function(c) {
                        return c.isFormField;
                    }, this);
                    
                    this.items.addAll(fields);
                    
                    this.doLayout();

                    this.filter.property = record.get("name");
                    this.fireEvent("change", this.filter, this);
                },
                // do not allow tab, it will skip select event 
                // after field was autocompleted with forceSelection
                afterrender:function(combo){
                    combo.keyNav.tab = function(e){
		                return false;
		            }
                },
                scope: this
            },
            width: 120
        };
        this.attributesComboCfg = this.attributesComboCfg || {};
        this.attributesComboConfig = this.attributesComboConfig || {};
        Ext.apply(this.attributesComboConfig, this.attributesComboCfg);
        Ext.applyIf(this.attributesComboConfig, defAttributesComboConfig);

        this.items = [this.attributesComboConfig];
        
        this.addEvents(
            /**
             * Event: change
             * Fires when the filter changes.
             *
             * Listener arguments:
             * filter - {OpenLayers.Filter} This filter.
             * this - {gxp.form.FilterField} (TODO change sequence of event parameters)
             */
            "change"
        ); 

        gxp.form.FilterField.superclass.initComponent.call(this);
    },

    /**
     * Method: validateValue
     * Performs validation checks on the filter field.
     *
     * Returns:
     * {Boolean} True if value is valid. 
     */
    validateValue: function(value, preventMark) {
        if (this.filter.type === OpenLayers.Filter.Comparison.BETWEEN) {
            return (this.filter.property !== null && this.filter.upperBoundary !== null &&
                this.filter.lowerBoundary !== null);
        } else {
            return (this.filter.property !== null &&
                this.filter.value !== null && this.filter.type !== null);
        }
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
    createFilterItems: function(rec) {
        var isBetween = this.filter.type === OpenLayers.Filter.Comparison.BETWEEN;
        var fieldCfg = GeoExt.form.recordToField(rec);
        return [
            Ext.applyIf({
                xtype: "gxp_comparisoncombo",
                ref: "type",
                allowBlank: this.allowBlank,
                value: this.filter.type,
                margins: '0 5 0 0',
                allowedTypes: this.getAllowedTypesByXtype(fieldCfg.xtype),
                listeners: {
                    select: function(combo, record) {
                        this.items.get(2).enable();
                        this.items.get(3).enable();
                        this.items.get(4).enable();
                        this.setFilterType(record.get("value"));
                        this.fireEvent("change", this.filter, this);
                    },
                    scope: this
                }
            }, this.comparisonComboConfig), Ext.apply(Ext.apply({}, fieldCfg),{
                disabled: this.filter.type == null,
                hidden: isBetween,
                ref: "value",
                value: this.filter.value,
                width: 80,
                grow: true,
                growMin: 80,
                anchor: "100%",
                allowBlank: this.allowBlank,
                listeners: {
                    "change": function(field, value) {
                        this.filter.value = value;
                        this.fireEvent("change", this.filter, this);
                    },
                    scope: this
                }
            }), Ext.apply(Ext.apply({},fieldCfg),{
                disabled: this.filter.type == null,
                hidden: !isBetween,
                value: this.filter.lowerBoundary,
                tooltip: this.lowerBoundaryTip,
                grow: true,
                growMin: 30,
                ref: "lowerBoundary",
                anchor: "100%",
                allowBlank: this.allowBlank,
                margins: '0 5 0 0',
                listeners: {
                    "change": function(field, value) {
                        this.filter.lowerBoundary = value;
                        this.fireEvent("change", this.filter, this);
                    },
                    "render": function(c) {
                        Ext.QuickTips.register({
                            target: c.getEl(),
                            text: this.lowerBoundaryTip
                        });
                    },
                    "autosize": function(field, width) {
                        field.setWidth(width);
                        field.ownerCt.doLayout();
                    },
                    scope: this
                }
            }), Ext.apply(Ext.apply({},fieldCfg),{
                disabled: this.filter.type == null,
                hidden: !isBetween,
                grow: true,
                growMin: 30,
                ref: "upperBoundary",
                value: this.filter.upperBoundary,
                allowBlank: this.allowBlank,
                listeners: {
                    "change": function(field, value) {
                        this.filter.upperBoundary = value;
                        this.fireEvent("change", this.filter, this);
                    },
                    "render": function(c) {
                        Ext.QuickTips.register({
                            target: c.getEl(),
                            text: this.upperBoundaryTip
                        });
                    },
                    scope: this
                }
            })
        ];
    },
    
    setFilterType: function(type) {
        this.filter.type = type;
        if (type === OpenLayers.Filter.Comparison.BETWEEN) {
            this.items.get(2).hide();
            this.items.get(3).show();
            this.items.get(4).show();
        } else {
            this.items.get(2).show();
            this.items.get(3).hide();
            this.items.get(4).hide();
        }
        this.doLayout();
    },

    /** api: method[setFilter]
     *  :arg filter: ``OpenLayers.Filter``` Change the filter object to be
     *  used.
     */
    setFilter: function(filter) {
        var previousType = this.filter.type;
        this.filter = filter;
        if (previousType !== filter.type) {
            this.setFilterType(filter.type);
        }
        this['property'].setValue(filter.property);
        this['type'].setValue(filter.type);
        if (filter.type === OpenLayers.Filter.Comparison.BETWEEN) {
            this['lowerBoundary'].setValue(filter.lowerBoundary);
            this['upperBoundary'].setValue(filter.upperBoundary);
        } else {
            this['value'].setValue(filter.value);
        }
        this.fireEvent("change", this.filter, this);
    },
    
    /** api: method[getAllowedTypesByXtype]
     *  :arg xtype: ``String``` Return camparision combobox gxp.form.ComparisonComboBox 
     *  allowed types based on field xtype.
     */
    getAllowedTypesByXtype: function(xtype){
        var allowedTypes = [
            [OpenLayers.Filter.Comparison.EQUAL_TO, "="],
            [OpenLayers.Filter.Comparison.NOT_EQUAL_TO, "<>"]
        ];
        if(xtype=='textfield'){
            allowedTypes.push([OpenLayers.Filter.Comparison.LIKE, gxp.form.ComparisonComboBox.prototype.likeFilterText]); 
        }else if(xtype=='numberfield' || xtype=='datefield'){
            allowedTypes.push([OpenLayers.Filter.Comparison.LESS_THAN, "<"]); 
            allowedTypes.push([OpenLayers.Filter.Comparison.GREATER_THAN, ">"]);
            allowedTypes.push([OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO, "<="]);
            allowedTypes.push([OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO, ">="]);
            allowedTypes.push([OpenLayers.Filter.Comparison.BETWEEN, gxp.form.ComparisonComboBox.prototype.betweenFilterText]);
        }
        return allowedTypes;
    }

});

Ext.reg('gxp_filterfield', gxp.form.FilterField);
