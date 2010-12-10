/**
 * @requires plugins/Tool.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.FeatureToField = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_featuretofield */
    ptype: "gx_featuretofield",
    
    /** api: config[featureManager]
     *  ``String`` :class:`FeatureManager` to use for this tool.
     */
     
    /** api: config[format]
     *  ``String`` The format to use for encoding the feature. Defaults to
     *  "GeoJSON", which means ``OpenLayers.Format.GeoJSON``. All
     *  OpenLayers.Format.* formats can be used here.
     */
    format: "GeoJSON",
    
    /** api: method[addActions]
     */
    addActions: function() {
        var featureManager = this.target.tools[this.featureManager];
        var featureInField;
        var format = new OpenLayers.Format[this.format];
        featureManager.featureLayer.events.on({
            "featureselected": function(evt) {
                this.target.field.setValue(format.write(evt.feature));
                featureInField = evt.feature;
            },
            "featureunselected": function() {
                this.target.field.setValue("");
                featureInField = null;
            },
            scope: this
        });
        featureManager.on("layerchange", function() {
            featureManager.featureStore && featureManager.featureStore.on("save", function(store, batch, data) {
                if (data.create) {
                    var i, feature;
                    for (i=data.create.length-1; i>=0; --i) {
                        //TODO check why the WFSFeatureStore returns an object
                        // here instead of a record
                        feature = data.create[i].feature;
                        if (feature == featureInField) {
                            this.target.field.setValue(format.write(feature));
                        }
                    }
                };
            }, this);
        });
        
        return gxp.plugins.FeatureToField.superclass.addActions.apply(this, arguments);
    }
        
});

Ext.preg(gxp.plugins.FeatureToField.prototype.ptype, gxp.plugins.FeatureToField);
