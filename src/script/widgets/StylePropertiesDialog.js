/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = StylePropertiesDialog
 *  base_link = `Ext.Container <http://extjs.com/deploy/dev/docs/?class=Ext.Container>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: StylePropertiesDialog(config)
 *   
 *      Create a dialog for editing properties of a UserStyle.
 */
gxp.StylePropertiesDialog = Ext.extend(Ext.Container, {
    
    /** api: config[userStyle]
     *  ``OpenLayers.Style``
     */
    
    /** api: property[userStyle]
     *  ``OpenLayers.Style``
     */
    userStyle: null,
    
    /** api: config[nameEditable]
     *  ``Boolean`` Set to false if the name of the style should not be
     *  editable.
     */
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        var listeners = {
            "change": function(field, value) {
                this.userStyle[field.name] = value;
                this.fireEvent("change", this, this.userStyle);
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
                    value: this.userStyle.name,
                    disabled: this.initialConfig.nameEditable === false,
                    maskRe: /[A-Za-z0-9_]/
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
        
        this.addEvents(
            /** api: events[change]
             *  Fires when any style property changes.
             *
             *  Listener arguments:
             *  * component - ``gxp.StylePropertiesDialog`` This dialog.
             *  * userStyle - ``OpenLayers.Style`` The updated style.
             */
            "change"
        ); 

        gxp.StylePropertiesDialog.superclass.initComponent.apply(this, arguments);
    }
});

/** api: xtype = gxp_styleproperties */
Ext.reg('gxp_stylepropertiesdialog', gxp.StylePropertiesDialog);