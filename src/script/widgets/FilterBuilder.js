/**
 * Copyright (c) 2009 The Open Planning Project
 */

/**
 * @include widgets/FilterPanel.js
 */

/** api: (define)
 *  module = gxp
 *  class = FilterBuilder
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: FilterPanel(config)
 *   
 *      Create a panel for assembling a filter.
 */
gxp.FilterBuilder = Ext.extend(Ext.Panel, {

    /** api: config[builderTypeNames]
     *  ``Array``
     *  A list of labels for that correspond to builder type constants.
     *  These will be the option names available in the builder type combo.
     *  Default is ``["any", "all", "none", "not all"]``.
     */
    builderTypeNames: ["any", "all", "none", "not all"],
    
    /** api: config[allowedBuilderTypes]
     *  ``Array``
     *  List of builder type constants.  Default is
     *  ``[ANY_OF, ALL_OF, NONE_OF]``.
     */
    allowedBuilderTypes: null,
    
    /** api: config[preComboText]
     *  ``String``
     *  String to display before filter type combo.  Default is ``"Match"``.
     */
    preComboText: "Match",

    /** api: config[postComboText]
     *  ``String``
     *  String to display before filter type combo.  Default is
     *  ``"of the following:"``.
     */
    postComboText: "of the following:",

    /** api: config[cls]
     *  ``String``
     *  The CSS class to be added to this panel's element (defaults to
     *  ``"gx-filterbuilder"``).
     */
    cls: "gx-filterbuilder",

    /** private: property[builderType]
     */
    builderType: null,

    /** private: property[childFiltersPanel]
     */
    childFiltersPanel: null,
    
    /** private: property[customizeFilterOnInit]
     */
    customizeFilterOnInit: true,
    
    
    /** api: config[allowGroups]
     *  ``Boolean``
     *  Allow groups of conditions to be added.  Default is ``true``.
     *  If ``false``, only individual conditions (non-logical filters) can
     *  be added.
     */
    allowGroups: true,

    initComponent: function() {
        var defConfig = {
            plain: true,
            border: false,
            defaultBuilderType: gxp.FilterBuilder.ANY_OF
        };
        Ext.applyIf(this, defConfig);
        
        if(this.customizeFilterOnInit) {
            this.filter = this.customizeFilter(this.filter);
        }
        
        this.builderType = this.getBuilderType();
        
        this.items = [
            {
                xtype: "container",
                items: [{
                    xtype: "container",
                    layout: "column",
                    style: "margin-top: 0.25em;",
                    defaults: {
                        // make form fields behave in tabs and fieldsets
                        hideMode: "offsets"
                    },
                    items: [{
                        xtype: "label",
                        text: this.preComboText,
                        cls: "x-form-item",
                        style: "padding: 0.3em 0.3em 0;" // TODO: replace with css
                    }, this.createBuilderTypeCombo(), {
                        xtype: "label",
                        text: this.postComboText,
                        cls: "x-form-item",
                        style: "padding: 0.3em 0.3em 0;" // TODO: replace with css
                    }]
                }]
            }, this.createChildFiltersPanel()
        ];
        
        this.bbar = this.createToolBar();

        this.addEvents(
            /**
             * Event: change
             * Fires when the filter changes.
             *
             * Listener arguments:
             * builder - {gxp.FilterBuilder} This filter builder.  Call
             *     ``getFilter`` to get the updated filter.
             */
            "change"
        ); 

        gxp.FilterBuilder.superclass.initComponent.call(this);
    },
    
    /** private: method[createToolBar]
     */
    createToolBar: function() {
        var bar = [{
            text: "add condition",
            iconCls: "add",
            handler: function() {
                this.addCondition();
            },
            scope: this
        }];
        if(this.allowGroups) {
            bar.push({
                text: "add group",
                iconCls: "add",
                handler: function() {
                    this.addCondition(true);
                },
                scope: this
            });
        }
        return bar;
    },
    
    /** api: method[getFilter]
     *  :return: ``OpenLayers.Filter``
     *  
     *  Returns a filter that fits the model in the Filter Encoding
     *  specification.  Use this method instead of directly accessing
     *  the ``filter`` property.  Return will be ``false`` if any child
     *  filter does not have a type, property, or value.
     */
    getFilter: function() {
        var filter;
        if(this.filter) {
            filter = this.filter.clone();
            if(filter instanceof OpenLayers.Filter.Logical) {
                filter = this.cleanFilter(filter);
            }
        }
        return filter;
    },
    
    /** private: method[cleanFilter]
     *  :arg filter: ``OpenLayers.Filter.Logical``
     *  :return: ``OpenLayers.Filter`` An equivalent filter to the input, where
     *      all binary logical filters have more than one child filter.  Returns
     *      false if a filter doesn't have non-null type, property, or value.
     *  
     *  Ensures that binary logical filters have more than one child.
     */
    cleanFilter: function(filter) {
        if(filter instanceof OpenLayers.Filter.Logical) {
            if(filter.type !== OpenLayers.Filter.Logical.NOT &&
               filter.filters.length === 1) {
                filter = this.cleanFilter(filter.filters[0]);
            } else {
                var child;
                for(var i=0, len=filter.filters.length; i<len; ++i) {
                    child = filter.filters[i];
                    if(child instanceof OpenLayers.Filter.Logical) {
                        child = this.cleanFilter(child);
                        if(child) {
                            filter.filters[i] = child;
                        } else {
                            filter = child;
                            break;
                        }
                    } else if(!child || child.type === null ||
                              child.property === null || child.value === null) {
                        filter = false;
                        break;
                    }
                }
            }
        } else {
            if(!filter || filter.type === null || filter.property === null ||
               filter.value === null) {
                filter = false;
            }
        }
        return filter;
    },
    
    /** private: method[customizeFilter]
     *  :arg filter: ``OpenLayers.Filter``  This filter will not
     *      be modified.  Register for events to receive an updated filter, or
     *      call ``getFilter``.
     *  :return: ``OpenLayers.Filter``  A filter that fits the model used by
     *      this builder.
     *  
     *  Create a filter that fits the model for this filter builder.  This filter
     *  will not necessarily meet the Filter Encoding specification.  In
     *  particular, filters representing binary logical operators may not
     *  have two child filters.  Use the <getFilter> method to return a
     *  filter that meets the encoding spec.
     */
    customizeFilter: function(filter) {
        if(!filter) {
            filter = this.wrapFilter(this.createDefaultFilter());
        } else {
            filter = this.cleanFilter(filter);
            switch(filter.type) {
                case OpenLayers.Filter.Logical.AND:
                case OpenLayers.Filter.Logical.OR:
                    if(!filter.filters || filter.filters.length === 0) {
                        // give the filter children if it has none
                        filter.filters = [this.createDefaultFilter()];
                    } else {
                        var child;
                        for(var i=0, len=filter.filters.length; i<len; ++i) {
                            child = filter.filters[i];
                            if(child instanceof OpenLayers.Filter.Logical) {
                                filter.filters[i] = this.customizeFilter(child);
                            }
                        }
                    }
                    // wrap in a logical OR
                    filter = new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.OR,
                        filters: [filter]
                    });
                    break;
                case OpenLayers.Filter.Logical.NOT:
                    if(!filter.filters || filter.filters.length === 0) {
                        filter.filters = [
                            new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.OR,
                                filters: [this.createDefaultFilter()]
                            })
                        ];
                    } else {
                        // NOT filters should have one child only
                        var child = filter.filters[0];
                        if(child instanceof OpenLayers.Filter.Logical) {
                            if(child.type !== OpenLayers.Filter.Logical.NOT) {
                                // check children of AND and OR
                                var grandchild;
                                for(var i=0, len=child.filters.length; i<len; ++i) {
                                    grandchild = child.filters[i];
                                    if(grandchild instanceof OpenLayers.Filter.Logical) {
                                        child.filters[i] = this.customizeFilter(grandchild);
                                    }
                                }
                            } else {
                                // silly double negative
                                if(child.filters && child.filters.length > 0) {
                                    filter = this.customizeFilter(child.filters[0]);
                                } else {
                                    filter = this.wrapFilter(this.createDefaultFilter());
                                }
                            }
                        } else {
                            // non-logical child of NOT should be wrapped
                            var type;
                            if(this.defaultBuilderType === gxp.FilterBuilder.NOT_ALL_OF) {
                                type = OpenLayers.Logical.Filter.AND;
                            } else {
                                type = OpenLayers.Logical.Filter.OR;
                            }
                            filter.filters = [
                                new OpenLayers.Filter.Logical({
                                    type: type,
                                    filters: [child]
                                })
                            ];
                        }
                    }
                    break;
                default:
                    // non-logical filters get wrapped
                    filter = this.wrapFilter(filter);
            }
        }
        return filter;
    },
    
    createDefaultFilter: function() {
        return new OpenLayers.Filter.Comparison();
    },
    
    /** private: method[wrapFilter]
     *  :arg filter: ``OpenLayers.Filter`` A non-logical filter.
     *  :return: ``OpenLayers.Filter`` A wrapped version of the input filter.
     *  
     *  Given a non-logical filter, this creates parent filters depending on
     *  the ``defaultBuilderType``.
     */
    wrapFilter: function(filter) {
        var type;
        if(this.defaultBuilderType === gxp.FilterBuilder.ALL_OF) {
            type = OpenLayers.Filter.Logical.AND;
        } else {
            type = OpenLayers.Filter.Logical.OR;
        }
        return new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.OR,
            filters: [
                new OpenLayers.Filter.Logical({
                    type: type, filters: [filter]
                })
            ]
        });
    },
    
    /** private: method[addCondition]
     *  Add a new condition or group of conditions to the builder.  This
     *  modifies the filter and adds a panel representing the new condition
     *  or group of conditions.
     */
    addCondition: function(group) {
        var filter, type;
        if(group) {
            type = "gx_filterbuilder";
            filter = this.wrapFilter(this.createDefaultFilter());
        } else {
            type = "gx_filterpanel";
            filter = this.createDefaultFilter();
        }
        var newChild = this.newRow({
            xtype: type,
            filter: filter,
            attributes: this.attributes,
            customizeFilterOnInit: group && false,
            listeners: {
                change: function() {
                    this.fireEvent("change", this);
                },
                scope: this
            }
        });
        this.childFiltersPanel.add(newChild);
        this.filter.filters[0].filters.push(filter);
        this.childFiltersPanel.doLayout();
    },
    
    /** private: method[removeCondition]
     *  Remove a condition or group of conditions from the builder.  This
     *  modifies the filter and removes the panel representing the condition
     *  or group of conditions.
     */
    removeCondition: function(panel, filter) {
        var parent = this.filter.filters[0].filters;
        if(parent.length > 1) {
            parent.remove(filter);
            this.childFiltersPanel.remove(panel, true);
        }
        this.fireEvent("change", this);
    },
    
    createBuilderTypeCombo: function() {
        var types = this.allowedBuilderTypes || [
            gxp.FilterBuilder.ANY_OF, gxp.FilterBuilder.ALL_OF,
            gxp.FilterBuilder.NONE_OF
        ];
        var numTypes = types.length;
        var data = new Array(numTypes);
        var type;
        for(var i=0; i<numTypes; ++i) {
            type = types[i];
            data[i] = [type, this.builderTypeNames[type]];
        }
        return {
            xtype: "combo",
            store: new Ext.data.SimpleStore({
                data: data,
                fields: ["value", "name"]
            }),
            value: this.builderType,
            displayField: "name",
            valueField: "value",
            triggerAction: "all",
            mode: "local",
            listeners: {
                select: function(combo, record) {
                    this.changeBuilderType(record.get("value"));
                    this.fireEvent("change", this);
                },
                scope: this
            },
            width: 60 // TODO: move to css
        };
    },
    
    /** private: method[changeBuilderType]
     *  :arg type: ``Integer`` One of the filter type constants.
     *  
     *  Alter the filter types when the filter type combo changes.
     */
    changeBuilderType: function(type) {
        if(type !== this.builderType) {
            this.builderType = type;
            var child = this.filter.filters[0];
            switch(type) {
                case gxp.FilterBuilder.ANY_OF:
                    this.filter.type = OpenLayers.Filter.Logical.OR;
                    child.type = OpenLayers.Filter.Logical.OR;
                    break;
                case gxp.FilterBuilder.ALL_OF:
                    this.filter.type = OpenLayers.Filter.Logical.OR;
                    child.type = OpenLayers.Filter.Logical.AND;
                    break;
                case gxp.FilterBuilder.NONE_OF:
                    this.filter.type = OpenLayers.Filter.Logical.NOT;
                    child.type = OpenLayers.Filter.Logical.OR;
                    break;
                case gxp.FilterBuilder.NOT_ALL_OF:
                    this.filter.type = OpenLayers.Filter.Logical.NOT;
                    child.type = OpenLayers.Filter.Logical.AND;
                    break;
            }
        }
    },
    
    /** private: method[createChildFiltersPanel]
     *  :return: ``Ext.Container``
     *  
     *  Create the panel that holds all conditions and condition groups.  Since
     *  this is called after this filter has been customized, we always
     *  have a logical filter with one child filter - that child is also
     *  a logical filter.
     */
    createChildFiltersPanel: function() {
        this.childFiltersPanel = new Ext.Container();
        var grandchildren = this.filter.filters[0].filters;
        var grandchild;
        for(var i=0, len=grandchildren.length; i<len; ++i) {
            grandchild = grandchildren[i];
            this.childFiltersPanel.add(this.newRow({
                xtype: (grandchild instanceof OpenLayers.Filter.Logical) ?
                    "gx_filterbuilder" : "gx_filterpanel",
                filter: grandchild,
                attributes: this.attributes,
                listeners: {
                    change: function() {
                        this.fireEvent("change", this);
                    },
                    scope: this
                }
            }));
        }
        return this.childFiltersPanel;
    },

    /** private: method[newRow]
     *  :return: ``Ext.Container`` A container that serves as a row in a child
     *  filters panel.
     *  
     *  Generate a "row" for the child filters panel.  This couples another
     *  filter panel or filter builder with a component that allows for
     *  condition removal.
     */
    newRow: function(filterPanel) {
        var panel = new Ext.Container({
            layout: "column",
            style: "padding: 0.5em 0 0.3em 0;",
            items: [{
                xtype: "container",
                style: "padding: 0 0.5em 0 2px;",
                items: [{
                    xtype: "button",
                    tooltip: "remove condition",
                    iconCls: "delete",
                    /**
                     * Calling btn.destroy causes failures if quick tips are
                     * not initialized (see http://extjs.com/forum/showthread.php?t=59121).
                     * This happens in 2.2.1 and 3.0.0.
                     *
                     * TODO: remove the beforeDestroy override after 3.0.0.
                     */
                    beforeDestroy: function() {
                        if (this.rendered) {
                            var btnEl = this.el.child(this.buttonSelector);
                            if (btnEl) {
                                if (typeof this.tooltip == 'object') {
                                    Ext.QuickTips.unregister(btnEl);
                                }
                                btnEl.removeAllListeners();
                            }
                        }
                        if (this.menu) {
                            Ext.destroy(this.menu);
                        }
                    },
                    handler: function(btn) {
                        this.removeCondition(panel, filterPanel.filter);
                    },
                    scope: this
                }]
            }, {
                xtype: "container",
                columnWidth: 1,
                items: [filterPanel]
            }]
        });
        return panel;
    },

    /** private: method[getBuilderType]
     *  :return: ``Integer``  One of the builder type constants.
     *  Determine the builder type based on this filter.
     */
    getBuilderType: function() {
        var type = this.defaultBuilderType;
        if(this.filter) {
            var child = this.filter.filters[0];
            if(this.filter.type === OpenLayers.Filter.Logical.NOT) {
                switch(child.type) {
                    case OpenLayers.Filter.Logical.OR:
                        type = gxp.FilterBuilder.NONE_OF;
                        break;
                    case OpenLayers.Filter.Logical.AND:
                        type = gxp.FilterBuilder.NOT_ALL_OF;
                        break;
                }
            } else {
                switch(child.type) {
                    case OpenLayers.Filter.Logical.OR:
                        type = gxp.FilterBuilder.ANY_OF;
                        break;
                    case OpenLayers.Filter.Logical.AND:
                        type = gxp.FilterBuilder.ALL_OF;
                        break;
                }
            }
        }
        return type;
    }

});

/**
 * Builder Types
 */
gxp.FilterBuilder.ANY_OF = 0;
gxp.FilterBuilder.ALL_OF = 1;
gxp.FilterBuilder.NONE_OF = 2;
gxp.FilterBuilder.NOT_ALL_OF = 3;

/** api: xtype = gx_filterbuilder */
Ext.reg('gx_filterbuilder', gxp.FilterBuilder); 
