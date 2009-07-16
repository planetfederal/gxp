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
gxp.QueryPanel = Ext.extend(Ext.Panel, {

    /** api: config[layers]
     *  ``Ext.Store``
     *  A store with records representing each WFS layer to be queried. Records
     *  must have ``schema`` (schema url), ``title``, ``name`` (feature type),
     *  and ``namespace`` (namespace URI) fields.
     */    
    
    /** api: config[layout]
     *  ``String``
     *  Defaults to "form."
     */
    layout: "form",
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        
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

        this.items = [{
            xtype: "combo",
            name: "layer",
            fieldLabel: "Layer",
            store: this.layers,
            value: this.layers.getAt(0).get("name"),
            displayField: "title",
            valueField: "name",
            mode: "local",
            allowBlank: true,
            editable: false,
            triggerAction: "all"
        }, {
            xtype: "fieldset",
            title: "Query by location",
            checkboxToggle: true,
            autoHeight: true,
            items: [this.mapExtentField]
        }, {
            xtype: "fieldset",
            title: "Query by attributes",
            checkboxToggle: true,
            autoHeight: true,
            items: [{
                xtype: "gxp_filterbuilder",
                allowGroups: false,
                attributes: this.attributes // this will change with layer selection
            }]
        }];

        gxp.QueryPanel.superclass.initComponent.apply(this, arguments);

    },
    
    getFormattedMapExtent: function() {
        return this.map &&
            this.map.getExtent() &&
            this.map.getExtent().toBBOX().replace(/\.(\d)\d*/g, ".$1").replace(/,/g, ", ");
    },
    
    updateMapExtent: function() {
        this.mapExtentField.setValue(this.getFormattedMapExtent());
    },
    
    /** private: method[beforeDestroy]
     *  Private method called during the destroy sequence.
     */
    beforeDestroy: function() {
        if(this.map && this.map.events) {
            this.map.events.un({
                moveend: this.updateMapExtent,
                scope: this
            });
        }
        gxp.QueryPanel.superclass.beforeDestroy.apply(this, arguments);
    }

});

/** api: xtype = gxp_querypanel */
Ext.reg('gxp_querypanel', gxp.QueryPanel); 