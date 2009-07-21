/**
 * Copyright (c) 2009 The Open Planning Project
 */

/**
 * @include widgets/FilterBuilder.js
 */

/** api: (define)
 *  module = gxp
 *  class = QueryPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: QueryPanel(config)
 *   
 *      Create a panel for assembling and issuing feature requests.
 */
gxp.QueryPanel = Ext.extend(Ext.Panel, {

    /** api: config[layerStore]
     *  ``Ext.data.Store``
     *  A store with records representing each WFS layer to be queried. Records
     *  must have ``title``, ``name`` (feature type), ``namespace`` (namespace
     *  URI), ``url`` (wfs url), and ``schema`` (schema url) fields.
     */    
    
    /** api: config[layout]
     *  ``String``
     *  Defaults to "form."
     */
    layout: "form",
    
    /** api: config[spatialQuery]
     *  ``Boolean``
     *  Initial state of "query by location" checkbox.  Default is true.
     */
    
    /** api: property[spatialQuery]
     *  ``Boolean``
     *  Query by extent.
     */
    spatialQuery: true,
    
    /** api: config[attributeQuery]
     *  ``Boolean``
     *  Initial state of "query by attribute" checkbox.  Default is false.
     *  
     *  TODO: If false, the filter builder is not rendered until the fieldset
     *  is collapsed.  An Ext bug keeps the combos from propertly rendering when
     *  this happens.  If we are going to support attributeQuery false in the
     *  config, this needs to be addressed.
     */
    
    /** api: property[attributeQuery]
     *  ``Boolean``
     *  Query by attributes.
     */
    attributeQuery: true,
    
    /** private: property[selectedLayer]
     *  ``Ext.data.Record``
     *  The currently selected record in the layers combo.
     */
    selectedLayer: null,
    
    /** private: property[featureStore]
     *  ``GeoExt.data.FeatureStore``
     *  After a query has been issued, this will be a store with records based
     *  on the return from the query.
     */
    featureStore: null,
    
    /** private: property[attributeStore]
     *  ``gxp.data.AttributeStore``
     *  The attributes associated with the currently selected layer.
     */
    attributeStore: null,

    /** private: property[geometryName]
     *  ``String``
     *  Name of the first geometry attribute found when the attributes store
     *  loads.
     */
    geometryName: null,
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        
        this.addEvents(

            /** api: events[layerchange]
             *  Fires when a new layer is selected.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             *  * record - ``Ext.data.Record`` Record representing the selected
             *      layer.
             */
            "layerchange",

            /** api: events[beforequery]
             *  Fires before a query for features is issued.  If any listener
             *  returns false, the query will not be issued.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             */
            "query",

            /** api: events[query]
             *  Fires when a query for features is issued.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             *  * store - ``GeoExt.data.FeatureStore`` The feature store.
             */
            "query",

            /** api: events[storeload]
             *  Fires when the feature store loads.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             *  * store - ``GeoExt.data.FeatureStore`` The feature store.
             *  * records - ``Array(Ext.data.Record)`` The records that were
             *      loaded.
             *  * options - ``Object`` The loading options that were specified.
             */
            "storeload"

        );        
        
        this.mapExtentField = new Ext.form.TextField({
            fieldLabel: "Current extent",
            disabled: true,
            anchor: "95%",
            value: this.getFormattedMapExtent()
        });
        this.map.events.on({
            moveend: this.updateMapExtent,
            scope: this
        });
        
        this.createFilterBuilder(this.layerStore.getAt(0));
        
        this.items = [{
            xtype: "combo",
            name: "layer",
            fieldLabel: "Layer",
            store: this.layerStore,
            value: this.layerStore.getAt(0).get("name"),
            displayField: "title",
            valueField: "name",
            mode: "local",
            allowBlank: true,
            editable: false,
            triggerAction: "all",
            listeners: {
                select: function(combo, record, index) {
                    this.createFilterBuilder(record);
                },
                scope: this
            }
        }, {
            xtype: "fieldset",
            title: "Query by location",
            checkboxToggle: true,
            collapsed: !this.spatialQuery,
            autoHeight: true,
            items: [this.mapExtentField],
            listeners: {
                collapse: function() {
                    this.spatialQuery = false;
                },
                expand: function() {
                    this.spatialQuery = true;
                },
                scope: this
            }
        }, {
            xtype: "fieldset",
            title: "Query by attributes",
            checkboxToggle: true,
            collapsed: !this.attributeQuery,
            autoHeight: true,
            items: [this.filterBuilder],
            listeners: {
                collapse: function() {
                    this.attributeQuery = false;
                },
                expand: function() {
                    this.attributeQuery = true;
                },
                scope: this
            }            
        }];

        gxp.QueryPanel.superclass.initComponent.apply(this, arguments);

    },
    
    /** private: method[createFilterBuilder]
     *  :param record: ``Ext.data.Record``  A record representing the feature
     *      type.
     *  
     *  Remove any existing filter builder and create a new one.  This method
     *  also sets the currently selected layer and stores the name for the
     *  first geometry attribute found when the attribute store loads.
     */
    createFilterBuilder: function(record) {
        this.fireEvent("layerchange", this, record);
        this.selectedLayer = record;
        var owner = this.filterBuilder && this.filterBuilder.ownerCt;
        if (owner) {
            owner.remove(this.filterBuilder, true);
        }

        this.attributeStore = new gxp.data.AttributeStore({
            url: record.get("schema"),
            listeners: {
                load: function(store) {
                    this.geometryName = null;
                    store.filterBy(function(r) {
                        var match = /gml:.*(Point|Line|Polygon|Curve|Surface).*/.test(r.get("type"));
                        if (match && !this.geometryName) {
                            this.geometryName = r.get("name");
                        }
                        return !match;
                    }, this);
                }
            },
            autoLoad: true
        });

        this.filterBuilder = new gxp.FilterBuilder({
            attributes: this.attributeStore,
            allowGroups: false
        });
        
        if (owner) {
            owner.add(this.filterBuilder);
            owner.doLayout();
        }
        
    },
    
    getFormattedMapExtent: function() {
        return this.map &&
            this.map.getExtent() &&
            this.map.getExtent().toBBOX().replace(/\.(\d)\d*/g, ".$1").replace(/,/g, ", ");
    },
    
    updateMapExtent: function() {
        this.mapExtentField.setValue(this.getFormattedMapExtent());
    },
    
    /** api: method[getFilter]
     *  Get the filter representing the conditions in the panel.  Returns false
     *  if neither spatial nor attribute query is checked.
     */
    getFilter: function() {
        var attributeFilter = this.attributeQuery && this.filterBuilder.getFilter();
        var spatialFilter = this.spatialQuery && new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.BBOX,
            value: this.map.getExtent()
        });
        var filter;
        if (attributeFilter && spatialFilter) {
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [spatialFilter, attributeFilter]
            });
        } else {
            filter = attributeFilter || spatialFilter;
        }
        return filter;
    },
    
    /** private: method[getFieldType]
     *  :param attrType: ``String`` Attribute type.
     *  :returns: ``String`` Field type
     *
     *  Given a feature attribute type, return an Ext field type if possible.
     *  
     *  TODO: this should go elsewhere (AttributeReader)
     */
    getFieldType: function(attrType) {
        return ({
            "xsd:string": "string",
            "xsd:double": "float"
        })[attrType];
    },
    
    /** api: method[query]
     *  Issue a request for features.
     */
    query: function() {
        
        if (this.fireEvent("beforequery", this) !== false) {
        
            var fields = [];
            this.attributeStore.each(function(record) {
                fields.push({
                    name: record.get("name"),
                    type: this.getFieldType(record.get("type"))
                });
            }, this);
            
            var layer = this.selectedLayer;
            
            this.featureStore = new GeoExt.data.FeatureStore({
                fields: fields,
                proxy: new GeoExt.data.ProtocolProxy({
                    protocol: new OpenLayers.Protocol.WFS({
                        version: "1.1.0",
                        srsName: this.map.getProjection(),
                        url: this.selectedLayer.get("url"),
                        featureType: layer.get("name"),
                        featureNS :  layer.get("namespace"),
                        geometryName: this.geometryName,
                        schema: layer.get("schema"),
                        filter: this.getFilter()
                    })
                }),
                autoLoad: true,
                listeners: {
                    load: function(store, records, options) {
                        this.fireEvent("storeload", this, store, records, options);
                    },
                    scope: this
                }
            });
    
            this.fireEvent("query", this, this.featureStore);
            
        }
        
    },

    /** private: method[beforeDestroy]
     *  Private method called during the destroy sequence.
     */
    beforeDestroy: function() {
        if (this.map && this.map.events) {
            this.map.events.un({
                moveend: this.updateMapExtent,
                scope: this
            });
        }
        gxp.QueryPanel.superclass.beforeDestroy.apply(this, arguments);
    }

});

/** api: xtype = gx_querypanel */
Ext.reg('gx_querypanel', gxp.QueryPanel); 