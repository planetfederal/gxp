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
        
    grid: null,
    
    modifyControl: null,
    
    layout: "fit",
    
    initComponent: function() {
        var feature = this.feature;
        
        if(!this.title && feature.fid) {
            this.title = feature.fid;
        }
        
        this.editButton = new Ext.Button({
            text: "Edit",
            tooltip: "Make this feature editable",
            handler: function() {
                this.startEditing();
            },
            scope: this
        });
        
        this.cancelButton = new Ext.Button({
            text: "Cancel",
            tooltip: "Stop editing, discard changes",
            hidden: true,
            handler: function() {
                this.stopEditing();
            },
            scope: this
        });
        
        this.grid = new Ext.grid.PropertyGrid({
            source: feature.attributes,
            listeners: {
                "beforeedit": function() {
                    return this.editing;
                },
                scope: this
            }
        });

        this.items = [
            this.grid
        ];

        this.bbar = new Ext.Toolbar({
            items: [
                "->",
                this.editButton,
                this.cancelButton
            ]
        });
        
        gxp.FeatureEditPopup.superclass.initComponent.call(this);
        
        this.on({
            "show": function() {
                if(this.editing) {
                    this.startEditing();
                }
            },
            "close": function() {
                this.stopEditing();
            },
            scope: this
        });
    },
    
    startEditing: function() {
        if(!this.editing) {
            this.editing = true;

            this.editButton.hide();
            this.cancelButton.show();
            
            this.geometry = this.feature.geometry.clone();
            this.attributes = Ext.apply({}, this.feature.attributes);

            this.modifyControl = new OpenLayers.Control.ModifyFeature(
                this.feature.layer);
            this.feature.layer.map.addControl(this.modifyControl);
            this.modifyControl.selectFeature(this.feature);
        }
    },
    
    stopEditing: function() {
        if(this.editing) {
            this.modifyControl.unselectFeature(this.feature);
            this.feature.layer.map.removeControl(this.modifyControl);
            this.modifyControl.destroy();
            
            var layer = this.feature.layer;
            layer.drawFeature(this.feature, {display: "none"});
            this.feature.geometry = this.geometry;
            this.feature.attributes = this.attributes;
            this.grid.setSource(this.feature.attributes);
            layer.drawFeature(this.feature);

            this.cancelButton.hide();
            this.editButton.show();
            
            this.editing = false;
        }
    }
});
