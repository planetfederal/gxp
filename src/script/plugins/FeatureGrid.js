/**
 * @requires plugins/Tool.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.FeatureGrid = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_featuregrid */
    ptype: "gx_featuregrid",

    /** api: config[featureManager]
     *  ``String`` The id of the :class:`gxp.plugins.FeatureManager` to use
     *  with this tool.
     */
    featureManager: null,
    
    /** private: property[schema]
     *  ``GeoExt.data.AttributeStore``
     */
    schema: null,
        
    /** private: method[onLayerChange]
     *  :arg mgr: :class:`gxp.plugins.FeatureManager`
     *  :arg layer: ``GeoExt.data.LayerRecord``
     *  :arg schema: ``GeoExt.data.AttributeStore``
     */
    onLayerChange: function(mgr, layer, schema) {
        this.schema = schema;
        this.actions[0].setDisabled(!schema);
        this.actions[1].setDisabled(!schema);

        var control = this.drawControl;
        var button = this.actions[0];
        var handlers = {
            "Point": OpenLayers.Handler.Point,
            "Line": OpenLayers.Handler.Path,
            "Curve": OpenLayers.Handler.Path,
            "Polygon": OpenLayers.Handler.Polygon,
            "Surface": OpenLayers.Handler.Polygon
        };        
        var simpleType = mgr.geometryType.replace("Multi", "");
        var Handler = handlers[simpleType];
        if (Handler) {
            var active = control.active;
            if(active) {
                control.deactivate();
            }
            control.handler = new Handler(
                control, control.callbacks,
                Ext.apply(control.handlerOptions, {multi: (simpleType != mgr.geometryType)})
            );
            if(active) {
                control.activate();
            }
            button.enable();
        } else {
            button.disable();
        }
    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var ref = this.outputTarget;
        var ct = ref ?
            ref == "map" ?
                this.target.mapPanel :
                (this.target.portal[ref] || Ext.getCmp(ref)) :
            this.target.portal;
        Ext.apply(config, this.outputConfig);
        var cmp = ct.add(config);
        cmp instanceof Ext.Window ? cmp.show() : ct.doLayout();
        return cmp;
    }
        
});

Ext.preg(gxp.plugins.FeatureGrid.prototype.ptype, gxp.plugins.FeatureGrid);
