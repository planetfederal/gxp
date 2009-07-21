/**
 * Copyright (c) 2009 OpenGeo
 */

Ext.namespace("gxp");
gxp.WMSLayerPanel = Ext.extend(Ext.TabPanel, {
    
    /** api: config[layerRecord]
     *  ``GeoExt.data.LayerRecord``
     *  Show properties for this layer record.
     */
    layerRecord: null,
    
    /** api: config[activeTab]
     *  ``String or Number``
     *  A string id or the numeric index of the tab that should be initially
     *  activated on render.  Defaults to ``0``.
     */
    activeTab: 0,
    
    /** api: config[border]
     *  ``Boolean``
     *  Display a border around the panel.  Defaults to ``false``.
     */
    border: false,
    
    initComponent: function() {

        this.items = [{
            title: "About",
            defaults: {
                border: false
            },
            items: [{
                layout: "form",
                labelWidth: 70,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "Title",
                    anchor: "99%",
                    value: this.layerRecord.get("title"),
                    listeners: {
                        change: function(field) {
                            this.layerRecord.set("title", field.getValue());
                        },
                        scope: this
                    }
                }, {
                    xtype: "textfield",
                    fieldLabel: "Name",
                    anchor: "99%",
                    value: this.layerRecord.get("name"),
                    readOnly: true
                }]
            }, {
                layout: "form",
                labelAlign: "top",
                items: [{
                    xtype: "textarea",
                    fieldLabel: "Description",
                    grow: true,
                    growMax: 150,
                    anchor: "99%",
                    value: this.layerRecord.get("abstract"),
                    readOnly: true
                }]
            }]
        }, {
            title: "Display",
            html: "Display properties"
        }];
        
        this.addEvents(
            /** api: event[change]
             *  Fires when properties are updated.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.WMSLayerPanel` This panel.
             *  * layer - ``OpenLayers.Layer.WMS` The target layer.
             */
            "change"
        ); 

        gxp.WMSLayerPanel.superclass.initComponent.call(this);
    }
    

});

Ext.reg('gx_wmslayerpanel', gxp.WMSLayerPanel); 