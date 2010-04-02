/**
 * Copyright (c) 2010 The Open Planning Project
 */

/** api: (define)
 *  module = gxp
 *  class = WMSStylesDialog
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Container>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: WMSStylesDialog(config)
 *   
 *      Create a dialog for selecting and modifying feature styles.
 */
gxp.WMSStylesDialog = Ext.extend(Ext.Container, {
    
    /** api: config[layerRecord]
     *  ``GeoExt.data.LayerRecord`` The layer to edit/select styles for.
     */
    
    /** private: property[layerRecord]
     *  ``GeoExt.data.LayerRecord`` The layer to edit/select styles for.
     */
    layerRecord: null,
    
    legendImage: null,
    
    /** private: property[styles]
     *  ``Array``
     */
    styles: null,
    
    layout: "form",
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        gxp.WMSStylesDialog.superclass.initComponent.apply(this, arguments);

        //TODO For now we assume that the 1st style in the styles block of
        // the layer capabilities is the default style

        this.legendImage = new GeoExt.LegendImage({
            url: this.layerRecord.get("styles")[0].legend.href
        });
        
        this.add({
            xtype: "fieldset",
            title: "SLD",
            labelWidth: 75,
            items: this.createStylesCombo()
        }, {
            xtype: "fieldset",
            title: "Rules",
            items: this.legendImage
        });
    },
    
    createStylesCombo: function() {
        var styles = this.layerRecord.get("styles");
        var store = new Ext.data.JsonStore({
            data: {
                styles: styles
            },
            root: "styles",
            idProperty: "name",
            fields: ["name", "title", "abstract", "legend"]
        });
        return new Ext.form.ComboBox({
            fieldLabel: "Choose style",
            store: store,
            displayField: "name",
            value: this.layerRecord.get("layer").styles ||
                styles[0].name,
            mode: "local",
            typeAhead: true,
            triggerAction: "all",
            forceSelection: true,
            anchor: "100%",
            listeners: {
                "select": this.changeStyle,
                scope: this
            }
        });
    },
    
    changeStyle: function(field, value) {
        var styleName = value.get("name");
        var url = value.get("legend").href +
            // workaround for incomplete legend url in geoserver capabilities
            "&style=" + styleName;
        this.legendImage.setUrl(url);
        this.layerRecord.get("layer").mergeNewParams({styles: styleName});
    }
});

Ext.reg('gx_wmsstylesdialog', gxp.WMSStylesDialog);