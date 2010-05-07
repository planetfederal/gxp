/**
 * Copyright (c) 2010 OpenPlans
 */

/** api: (define)
 *  module = gxp
 *  class = StyleProperties
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Container>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: StyleProperties(config)
 *   
 *      Create a dialog for editing properties of a UserStyle.
 */
gxp.StyleProperties = Ext.extend(Ext.Container, {
    
    /** api: config[userStyle]
     *  ``OpenLayers.Style``
     */
    
    /** api: property[userStyle]
     *  ``OpenLayers.Style``
     */
    userStyle: null,
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        var listeners = {
            "change": function(field, value) {
                this.userStyle[field.name] = value;
            },
            scope: this
        };
        var defConfig = {
            layout: "form",
            items: [{
                xtype: "fieldset",
                title: "General",
                labelWidth: 75,
                defaults: {
                    xtype: "textfield",
                    anchor: "100%",
                    listeners: listeners
                },
                items: [{
                    fieldLabel: "Name",
                    name: "name",
                    value: this.userStyle.name
                }, {
                    fieldLabel: "Title",
                    name: "title",
                    value: this.userStyle.title
                }, {
                    xtype: "textarea",
                    fieldLabel: "Abstract",
                    name: "description",
                    value: this.userStyle.description
                }]
            }]
        };
        Ext.applyIf(this, defConfig);
        
        gxp.StyleProperties.superclass.initComponent.apply(this, arguments);
    }
});

/** api: xtype = gx_styleproperties */
Ext.reg('gx_styleproperties', gxp.StyleProperties);