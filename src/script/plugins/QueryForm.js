/**
 * @requires plugins/Tool.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.QueryForm = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_QueryForm */
    ptype: "gx_queryform",

    /** api: config[featureManager]
     *  ``String`` The id of the :class:`gxp.plugins.FeatureManager` to use
     *  with this tool.
     */
    featureManager: null,
    
    /** private: property[schema]
     *  ``GeoExt.data.AttributeStore``
     */
    schema: null,
        
    /** api: method[addActions]
     */
    addActions: function() {
        this.addOutput(this.outputConfig);
        return gxp.plugins.FeatureGrid.superclass.addActions.apply(this, arguments);
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var featureManager = this.target.tools[this.featureManager];

        config = Ext.apply({
            bodyStyle: "padding: 10px",
            layout: "form",
            autoScroll: true,
            items: [{
                xtype: "fieldset",
                ref: "spatialFieldset",
                title: "Query by location",
                checkboxToggle: true,
                items: [{
                    xtype: "textfield",
                    ref: "../extent",
                    anchor: "100%",
                    fieldLabel: "Current extent",
                    value: this.getFormattedMapExtent(),
                    readOnly: true
                }]
            }, {
                xtype: "fieldset",
                ref: "attributeFieldset",
                title: "Query by attributes",
                checkboxToggle: true
            }],
            bbar: ["->", {
                text: "Query",
                iconCls: "gx-icon-find",
                handler: function() {
                    var filters = [];
                    if (QueryForm.spatialFieldset.collapsed !== true) {
                        filters.push(new OpenLayers.Filter.Spatial({
                            type: OpenLayers.Filter.Spatial.BBOX,
                            property: featureManager.featureStore.geometryName,
                            value: this.target.mapPanel.map.getExtent()
                        }));
                    }
                    if (QueryForm.attributeFieldset.collapsed !== true) {
                        var attributeFilter = QueryForm.filterBuilder.getFilter();
                        attributeFilter && filters.push(attributeFilter);
                    }
                    featureManager.loadFeatures(filters.length > 1 ?
                        new OpenLayers.Filter.Logical({
                            type: OpenLayers.Filter.Logical.AND,
                            filters: filters
                        }) :
                        filters[0]
                    );
                },
                scope: this
            }]
        }, config || {});
        var QueryForm = gxp.plugins.FeatureGrid.superclass.addOutput.call(this, config);
        
        featureManager.on("layerchange", function(mgr, rec, schema) {
            QueryForm.attributeFieldset.removeAll();
            QueryForm.setDisabled(!schema);
            if (schema) {
                QueryForm.attributeFieldset.add({
                    xtype: "gx_filterbuilder",
                    ref: "../filterBuilder",
                    attributes: schema,
                    allowBlank: true,
                    allowGroups: false
                });
                QueryForm.spatialFieldset.expand();
                QueryForm.attributeFieldset.expand();
            } else {
                QueryForm.attributeFieldset.collapse();
                QueryForm.spatialFieldset.collapse();
            }
            QueryForm.attributeFieldset.doLayout();
        }, this);
        
        this.target.mapPanel.map.events.register("moveend", this, function() {
            QueryForm.extent.setValue(this.getFormattedMapExtent());
        });
        
        return QueryForm;
    },
    
    getFormattedMapExtent: function() {
        var extent = this.target.mapPanel.map.getExtent();
        return extent && extent.toArray().join(", ");
    }
        
});

Ext.preg(gxp.plugins.QueryForm.prototype.ptype, gxp.plugins.QueryForm);
