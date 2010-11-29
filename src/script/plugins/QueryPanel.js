/**
 * @requires plugins/Tool.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.QueryPanel = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_querypanel */
    ptype: "gx_querypanel",

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
                handler: function() {
                    var filters = [];
                    if (queryPanel.spatialFieldset.collapsed !== true) {
                        filters.push(new OpenLayers.Filter.Spatial({
                            type: OpenLayers.Filter.Spatial.BBOX,
                            property: featureManager.featureStore.geometryName,
                            value: this.target.mapPanel.map.getExtent()
                        }));
                    }
                    if (queryPanel.attributeFieldset.collapsed !== true) {
                        var attributeFilter = queryPanel.filterBuilder.getFilter();
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
        var queryPanel = gxp.plugins.FeatureGrid.superclass.addOutput.call(this, config);
        
        featureManager.on("layerchange", function(mgr, rec, schema) {
            queryPanel.attributeFieldset.removeAll();
            queryPanel.setDisabled(!schema);
            if (schema) {
                queryPanel.attributeFieldset.add({
                    xtype: "gx_filterbuilder",
                    ref: "../filterBuilder",
                    attributes: schema,
                    allowBlank: true,
                    allowGroups: false
                });
                queryPanel.spatialFieldset.expand();
                queryPanel.attributeFieldset.expand();
            } else {
                queryPanel.attributeFieldset.collapse();
                queryPanel.spatialFieldset.collapse();
            }
            queryPanel.attributeFieldset.doLayout();
        }, this);
        
        this.target.mapPanel.map.events.register("moveend", this, function() {
            queryPanel.extent.setValue(this.getFormattedMapExtent());
        });
        
        return queryPanel;
    },
    
    getFormattedMapExtent: function() {
        var extent = this.target.mapPanel.map.getExtent();
        return extent && extent.toArray().join(", ");
    }
        
});

Ext.preg(gxp.plugins.QueryPanel.prototype.ptype, gxp.plugins.QueryPanel);
