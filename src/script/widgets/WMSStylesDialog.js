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
    
    /** private: property[styles]
     *  ``Array``
     */
    styles: null,
    
    /** private: property[rulesFieldSet]
     *  ``Ext.form.FieldSet`` The fieldset with the rules. If GetStyles works
     *  on the WMS and we have an SLD, this will contain editable rules.
     *  Otherwise just a GetLegendGraphic image.
     */
    rulesFieldSet: null,
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        var defConfig = {
            layout: "form"
        };
        Ext.applyIf(this, defConfig);
        
        gxp.WMSStylesDialog.superclass.initComponent.apply(this, arguments);
        
        this.rulesFieldSet = new Ext.form.FieldSet({
            title: "Rules"
        });

        this.rulesFieldSet.add(this.createLegendImage());

        this.add({
            xtype: "fieldset",
            title: "Styles",
            labelWidth: 75,
            items: this.createStylesCombo()
        }, this.rulesFieldSet);
    },
    
    /** private: method[createStylesCombo]
     * 
     *  Returns a combo box with the available style names found for the layer
     *  in the capabilities document.
     */
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
    
    /** private: method[createLegendImage]
     * 
     *  Creates a legend image for the first style of the current layer. This
     *  is used when GetStyles is not available from the layer's WMS.
     */
    createLegendImage: function() {
        var styleIndex = 0;
        var styleName = this.layerRecord.get("layer").params.STYLES;
        var styles = this.layerRecord.get("styles");
        var style;
        for(var i=0, len=styles.length; i<len; ++i) {
            style = styles[i];
            if(style.name === styleName) {
                styleIndex = i;
                break;
            }
        }
        var legendImage = new GeoExt.LegendImage({
            url: this.layerRecord.get("styles")[styleIndex].legend.href +
                // workaround for incomplete legend url in geoserver caps
                "&style=" + styleName
        });
        return legendImage;
    },
    
    /** private: method[changeStyle]
     *  :param field: ``Ext.form.Field``
     *  :param value: ``Ext.data.Record``
     * 
     *  Handler for the stylesCombo's ``select`` event. Updates the layer and
     *  the rulesFieldSet.
     */
    changeStyle: function(field, value) {
        var styleName = value.get("name");
        this.layerRecord.get("layer").mergeNewParams({styles: styleName});
        var url = value.get("legend").href +
            // workaround for incomplete legend url in geoserver capabilities
            "&style=" + styleName;
        this.rulesFieldSet.items.get(0).setUrl(url);
    }
});

/** api: xtype = gx_wmsstylesdialog */
Ext.reg('gx_wmsstylesdialog', gxp.WMSStylesDialog);