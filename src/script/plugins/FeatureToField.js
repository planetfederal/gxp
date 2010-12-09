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

        var format = new OpenLayers.Format[this.format];
        featureManager.featureLayer.events.on({
            "featureselected": function(evt) {
                this.target.field.setValue(format.write(evt.feature));
            },
            "featureunselected": function() {
                this.target.field.setValue("");
            },
            scope: this
        });
        
        return gxp.plugins.FeatureToField.superclass.addActions.apply(this, arguments);
    }
        
});

Ext.preg(gxp.plugins.FeatureToField.prototype.ptype, gxp.plugins.FeatureToField);
