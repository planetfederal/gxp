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
    
    /** private: property[sldStyle]
     *  ``OpenLayers.Style`` The style from the sld. Only available if the
     *  GetStyles request was successful.
     */
    sldStyle: null,
    
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
        
        this.add({
            xtype: "fieldset",
            title: "Styles",
            labelWidth: 75,
            items: this.createStylesCombo()
        });

        var layer = this.layerRecord.get("layer");
        Ext.Ajax.request({
            method: "GET",
            url: layer.url,
            params: {
                request: "GetStyles",
                layers: layer.params.LAYERS
            },
            success: this.parseSLD,
            failure: this.createLegendImage,
            scope: this
        });
    },
    
    createRulesFieldSet: function() {
        this.rulesFieldSet = new Ext.form.FieldSet({
            title: "Rules"
        });
        this.add(this.rulesFieldSet);
    },

    parseSLD: function(response, options) {
        var data = response.responseXML;
        if(!data || !data.documentElement) {
            data = new OpenLayers.Format.XML().read(response.responseText);
        }
        try {
            var sld = new OpenLayers.Format.SLD().read(data);
            var layer = this.layerRecord.get("layer").params.LAYERS;
            this.sldStyle = sld.namedLayers[layer].userStyles[0];
            this.createRulesFieldSet();
            // use the symbolizer type of the 1st rule
            //TODO make VectorLegend support multiple symbolTypes
            for(var symbolType in this.sldStyle.rules[0].symbolizer) {
                break;
            }
            var legend = new GeoExt.VectorLegend({
                rules: this.sldStyle.rules,
                symbolType: symbolType
            });
            this.rulesFieldSet.add(legend);
        }
        catch(e) {
            var legendImage = this.createLegendImage();
            if(legendImage) {
                this.createRulesFieldSet();
                this.rulesFieldSet.add(legendImage);
            }
        }
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
            value: this.layerRecord.get("layer").params.STYLES ||
                styles.length ? styles[0].name : "default",
            disabled: !styles.length,
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
     *  :return: ``GeoExt.LegendImage`` or undefined if none available.
     * 
     *  Creates a legend image for the first style of the current layer. This
     *  is used when GetStyles is not available from the layer's WMS.
     */
    createLegendImage: function() {
        var styleIndex = 0;
        var styleName = this.layerRecord.get("layer").params.STYLES;
        var styles = this.layerRecord.get("styles");
        if(styles.length) {
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
            this.createRulesFieldSet();
            return legendImage;
        }
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
        if(!this.sldStyle) {
            var url = value.get("legend").href +
                // workaround for incomplete legend url in geoserver capabilities
                "&style=" + styleName;
            this.rulesFieldSet.items.get(0).setUrl(url);
        }
    }
});

/** api: xtype = gx_wmsstylesdialog */
Ext.reg('gx_wmsstylesdialog', gxp.WMSStylesDialog);