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
 *      Create a dialog for selecting and modifying layer styles.
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
     *  ``Array(OpenLayers.Style)`` The style objects for the ``NamedLayer``
     *  of this ``layerRecord``
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
            layout: "form",
            items: [{
                xtype: "fieldset",
                title: "Styles",
                labelWidth: 75,
                style: "margin-bottom: 0;",
                items: this.createStylesCombo()
            }, {
                xtype: "toolbar",
                style: "border-width: 0 1px 1px 1px; margin-bottom: 10px;",
                items: [
                    {
                        xtype: "button",
                        iconCls: "add",
                        text: "Add"
                    }, {
                        xtype: "button",
                        iconCls: "delete",
                        text: "Remove"
                    }, {
                        xtype: "button",
                        iconCls: "edit",
                        text: "Edit"
                    }, {
                        xtype: "button",
                        iconCls: "duplicate",
                        text: "Duplicate"
                    }
                ]
            }]
        };
        Ext.applyIf(this, defConfig);
        
        gxp.WMSStylesDialog.superclass.initComponent.apply(this, arguments);
        
        // disable styles toolbar if we have no styles
        this.layerRecord.get("styles").length ||
            this.items.get(1).disable();

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
    
    /** private: method[addRulesFieldSet]
     *  Creates the ``rulesFieldSet`` and adds it to this container.
     */
    addRulesFieldSet: function() {
        this.rulesFieldSet = new Ext.form.FieldSet({
            title: "Rules",
            autoScroll: true,
            style: "margin-bottom: 0;"
        });
        this.add(this.rulesFieldSet, {
            xtype: "toolbar",
            style: "border-width: 0 1px 1px 1px;",
            items: [
                {
                    xtype: "button",
                    iconCls: "add",
                    text: "Add"
                }, {
                    xtype: "button",
                    iconCls: "delete",
                    text: "Remove"
                }, {
                    xtype: "button",
                    iconCls: "edit",
                    text: "Edit"
                }, {
                    xtype: "button",
                    iconCls: "duplicate",
                    text: "Duplicate"
                }
            ]
        });
    },
    
    /** private: method[removeRulesFieldSet[
     */
    removeRulesFieldSet: function() {
        this.remove(this.rulesFieldSet);
        this.remove(this.items.get(2));
        this.doLayout();
    },

    /** private: method[parseSLD]
     *  :param response: ``Object``
     *  :param options: ``Object``
     *  
     *  Success handler for the GetStyles response. Includes a fallback
     *  to GetLegendGraphic if no valid SLD is returned.
     */
    parseSLD: function(response, options) {
        var data = response.responseXML;
        if(!data || !data.documentElement) {
            data = new OpenLayers.Format.XML().read(response.responseText);
        }
        try {
            var sld = new OpenLayers.Format.SLD().read(data);
            var layer = this.layerRecord.get("layer").params.LAYERS;
            
            this.styles = sld.namedLayers[layer].userStyles;
            
            //TODO use the default style instead of the 1st one
            var style = this.styles[0];
            
            this.addRulesFieldSet();
            this.addVectorLegend(style.rules);
        }
        catch(e) {
            var legendImage = this.createLegendImage();
            if(legendImage) {
                this.addRulesFieldSet();
                this.rulesFieldSet.add(legendImage);
                // disable the rules toolbar
                this.items.get(3).disable();
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
        var self = this;
        return new GeoExt.WMSLegend({
            showTitle: false,
            layerRecord: this.layerRecord,
            defaults: {
                listeners: {
                    // remove rulesFieldSet if legend image cannot be loaded
                    "render": function() {
                        this.getEl().on("error", self.removeRulesFieldSet, self);
                    }
                }
            }
        });
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
        var layer = this.layerRecord.get("layer");
        
        //TODO remove when http://jira.codehaus.org/browse/GEOS-3921 is fixed
        var styles = this.layerRecord.get("styles");
        if(styles) {
            var style;
            for(var i=0, len=styles.length; i<len; ++i) {
                style = styles[i];
                if(style.name === styleName) {
                    break;
                }
            }
            var urlParts = value.get("legend").href.split("?");
            var params = Ext.urlDecode(urlParts[1]);
            params.STYLE = styleName;
            urlParts[1] = Ext.urlEncode(params);
            style.legend.href = urlParts.join("?");
        }
        //TODO end remove
        
        layer.mergeNewParams({styles: styleName});
        if(this.styles) {
            var style = this.styles[i];
            this.rulesFieldSet.remove(this.rulesFieldSet.items.get(0));
            this.addVectorLegend(style.rules);
        }
    },
    
    /** private: method[addVectorLegend]
     *  :param rules: ``Array``
     *
     *  Creates the vector legend for the provided rules and adds it to the
     *  ``rulesFieldSet``.
     */
    addVectorLegend: function(rules) {
        // use the symbolizer type of the 1st rule
        for(var symbolType in rules[0].symbolizer) {
            break;
        }
        this.rulesFieldSet.add({
            xtype: "gx_vectorlegend",
            showTitle: false,
            rules: rules,
            symbolType: symbolType
        });
        this.rulesFieldSet.doLayout();
    }
});

/** api: xtype = gx_wmsstylesdialog */
Ext.reg('gx_wmsstylesdialog', gxp.WMSStylesDialog);