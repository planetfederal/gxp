/**
 * Copyright (c) 2009 The Open Planning Project
 */

/** api: (define)
 *  module = gxp
 *  class = FeatureEditPopup
 *  extends = GeoExt.Popup
 */

/** api: constructor
 *  .. class:: FeatureEditPopup(config)
 *
 *      Create a new popup which displays the attributes of a feature and
 *      makes the feature editable,
 *      using an ``OpenLayers.Control.MofidyFeature``.
 */
Ext.namespace("gxp");
gxp.FeatureEditPopup = Ext.extend(GeoExt.Popup, {
    
    editing: false,
    
    feature: null,
    
    layout: "fit",
    
    initComponent: function() {
        var feature = this.feature;
        
        if(!this.title && feature.fid) {
            this.title = feature.fid;
        }

        this.items = [
            new Ext.grid.PropertyGrid({
                source: feature.attributes,
                listeners: {
                    "beforeedit": function() {
                        return this.editing;
                    },
                    scope: this
                }
            })
        ];
        var modifyControl = new OpenLayers.Control.ModifyFeature(feature.layer);
        
        gxp.FeatureEditPopup.superclass.initComponent.call(this);
        
        this.on({
            "show": function() {
                if(this.editing) {
                    feature.layer.map.addControl(modifyControl);
                    modifyControl.selectFeature(feature);
                }
            },
            "close": function() {
                if(this.editing) {
                    modifyControl.unselectFeature(feature);
                    feature.layer.map.removeControl(modifyControl);
                    modifyControl.selectControl.select(feature);
                    modifyControl.destroy();
                }
            },
            scope: this
        });

    }
});
