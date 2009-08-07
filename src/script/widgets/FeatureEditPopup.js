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
    
    /** i18n **/
    closeMsgTitle: 'Save Changes?',
    closeMsg: 'This feature has unsaved changes. Would you like to save your changes?',
    deleteMsgTitle: 'Delete Feature?',
    deleteMsg: 'Are you sure you want to delete this feature?',
    editButtonText: 'Edit',
    editButtonTooltip: 'Make this feature editable',
    deleteButtonText: 'Delete',
    deleteButtonTooltip: 'Delete this feature',
    cancelButtonText: 'Cancel',
    cancelButtonTooltip: 'Stop editing, discard changes',
    saveButtonText: 'Save',
    saveButtonTooltip: 'Save changes',
    
    /** private config overrides **/
    layout: "fit",
    
    /** api: config[feature]
     *  ``OpenLayers.Feature.Vector`` The feature to edit and display.
     */
    
    /** api: property[feature]
     *  ``OpenLayers.Feature.Vector`` The feature being edited/displayed.
     */
    feature: null,
    
    /** api: config[schema]
     *  ``GeoExt.data.AttributeStore`` Optional. If provided, available
     *  feature attributes will be determined from the schema instead of using
     *  the attributes that the feature has currently set.
     */
    schema: null,
    
    /** api: config[allowDelete]
     *  ``Boolean`` Set to true to provide a Delete button for deleting the
     *  feature. Default is false.
     */
    allowDelete: false,
    
    /** api: config[editing]
     *  ``Boolean`` Set to true to open the popup in editing mode.
     *  Default is false.
     */
        
    /** private: property[editing]
     *  ``Boolean`` If we are in editing mode, this will be true.
     */
    editing: false,
    
    /** private: property[grid]
     *  ``Ext.grid.PropertyGrid``
     */
    grid: null,
    
    /** private: property[modifyControl]
     *  ``OpenLayers.Control.ModifyFeature`` If in editing mode, we will have
     *  this control for editing the geometry.
     */
    modifyControl: null,
    
    /** private: property[geometry]
     *  ``OpenLayers.Geometry`` The original geometry of the feature we are
     *  editing.
     */
    geometry: null,
    
    /** private: property[attributes]
     *  ``Object`` The original attributes of the feature we are editing.
     */
    attributes: null,
    
    /** private: property[cancelButton]
     *  ``Ext.Button``
     */
    cancelButton: null,
    
    /** private: property[saveButton]
     *  ``Ext.Button``
     */
    saveButton: null,
    
    /** private: property[editButton]
     *  ``Ext.Button``
     */
    editButton: null,
    
    /** private: property[deleteButton]
     *  ``Ext.Button``
     */
    deleteButton: null,
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        this.addEvents(
            /** api: events[featuremodified]
             *  Fires when the feature associated with this popup has been
             *  modified (i.e. when the user clicks "Save" on the popup) or
             *  deleted (i.e. when the user clicks "Delete" on the popup).
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.FeatureEditPopup` This popup.
             *  * feature - ``OpenLayers.Feature`` The modified feature.
             */
            "featuremodified",
            
            /** api: events[canceledit]
             *  Fires when the user exits the editing mode by pressing the
             *  "Cancel" button or selecting "No" in the popup's close dialog.
             *  
             *  Listener arguments:
             *  * panel - :class:`gxp.FeatureEditPopup` This popup.
             *  * feature - ``OpenLayers.Feature`` The feature.
             */
            "canceledit",
            
            /** api: events[cancelclose]
             *  Fires when the user answers "Cancel" to the dialog that
             *  appears when a popup with unsaved changes is closed.
             *  
             *  Listener arguments:
             *  * panel - :class:`gxp.FeatureEditPopup` This popup.
             */
            "cancelclose"
        );
        
        var feature = this.feature;
        
        this.anchored = !this.editing;
        
        var customEditors = {};
        if(this.schema) {
            var attributes = {};
            var name, type, value;
            this.schema.each(function(r) {
                type = this.getFieldType(r.get("type"));
                name = r.get("name");
                value = feature.attributes[name];
                switch(type) {
                    case "string":
                        break;
                    case "boolean":
                        //TODO nodata handling for Boolean
                        value = Boolean(value);
                    default:
                        // Ext.PropertyGrid determines the appropriate editor
                        // with a typeof check. This means if we would set
                        // value to Number(value) here, the value would be 0
                        // (which we don't want for nodata values). If we
                        // would set value to Number(value || undefined) we
                        // would have NaN, which would look ugly in the
                        // editor. So instead, we set a custom editor with a
                        // plain NumberField.
                        customEditors[name] = new Ext.grid.GridEditor(
                            new Ext.form.NumberField({
                                selectOnFocus: true,
                                style: 'text-align:left;'
                            })
                        );
                }
                attributes[name] = value;
            }, this);
            feature.attributes = attributes;
        }
        
        if(!this.title && feature.fid) {
            this.title = feature.fid;
        }
        
        this.editButton = new Ext.Button({
            text: this.editButtonText,
            tooltip: this.editButtonTooltip,
            iconCls: "edit",
            handler: this.startEditing,
            scope: this
        });
        
        this.deleteButton = new Ext.Button({
            text: this.deleteButtonText,
            tooltip: this.deleteButtonTooltip,
            iconCls: "delete",
            hidden: !this.allowDelete,
            handler: this.deleteFeature,
            scope: this
        });
        
        this.cancelButton = new Ext.Button({
            text: this.cancelButtonText,
            tooltip: this.cancelButtonTooltip,
            iconCls: "cancel",
            hidden: true,
            handler: function() {
                this.stopEditing(false);
            },
            scope: this
        });
        
        this.saveButton = new Ext.Button({
            text: this.saveButtonText,
            tooltip: this.saveButtonTooltip,
            iconCls: "save",
            hidden: true,
            handler: function() {
                this.stopEditing(true);
            },
            scope: this
        });
        
        this.grid = new Ext.grid.PropertyGrid({
            border: false,
            source: feature.attributes,
            customEditors: customEditors,
            listeners: {
                "beforeedit": function() {
                    return this.editing;
                },
                "propertychange": function() {
                    this.setFeatureState(this.getDirtyState());
                },
                scope: this
            }
        });

        this.items = [
            this.grid
        ];

        this.bbar = new Ext.Toolbar({
            items: [
                this.editButton,
                this.deleteButton,
                this.saveButton,
                this.cancelButton
            ]
        });
        
        gxp.FeatureEditPopup.superclass.initComponent.call(this);
        
        this.on({
            "show": function() {
                if(this.editing) {
                    this.editing = null;
                    this.startEditing();
                }
            },
            "beforeclose": function() {
                if(!this.editing) {
                    return;
                }
                if(this.feature.state === this.getDirtyState()) {
                    Ext.Msg.show({
                        title: this.closeMsgTitle,
                        msg: this.closeMsg,
                        buttons: Ext.Msg.YESNOCANCEL,
                        fn: function(button) {
                            if(button && button !== "cancel") {
                                this.stopEditing(button === "yes");
                                this.close();
                            } else {
                                this.fireEvent("cancelclose", this);
                            }
                        },
                        scope: this,
                        icon: Ext.MessageBox.QUESTION,
                        animEl: this.getEl()
                    });
                    return false;
                } else {
                    this.stopEditing(false);
                }
            },
            scope: this
        });
    },
    
    /** private: method[getDirtyState]
     *  Get the appropriate OpenLayers.State value to indicate a dirty feature.
     *  We don't cache this value because the popup may remain open through
     *  several state changes.
     */
    getDirtyState: function() {
        return this.feature.state === OpenLayers.State.INSERT ?
            this.feature.state : OpenLayers.State.UPDATE;
    },
    
    /** private: method[getFieldType]
     *  :param attrType: ``String`` Attribute type.
     *  :returns: ``String`` Field type
     *
     *  Given a feature attribute type, return an Ext field type if possible.
     *  Note that there are many unhandled xsd types here.
     *  
     *  TODO: this should go elsewhere (AttributeReader)
     */
    getFieldType: function(attrType) {
        return ({
            "xsd:boolean": "boolean",
            "xsd:int": "int",
            "xsd:integer": "int",
            "xsd:short": "int",
            "xsd:long": "int",
            "xsd:date": "date",
            "xsd:string": "string",
            "xsd:float": "float",
            "xsd:double": "float"
        })[attrType];
    },

    /** private: method[startEditing]
     */
    startEditing: function() {
        if(!this.editing) {
            this.editing = true;
            this.anc && this.unanchorPopup();

            this.editButton.hide();
            this.deleteButton.hide();
            this.saveButton.show();
            this.cancelButton.show();
            
            this.geometry = this.feature.geometry.clone();
            this.attributes = Ext.apply({}, this.feature.attributes);

            this.modifyControl = new OpenLayers.Control.ModifyFeature(
                this.feature.layer,
                {standalone: true}
            );
            this.feature.layer.map.addControl(this.modifyControl);
            this.modifyControl.activate();
            this.modifyControl.selectFeature(this.feature);
        }
    },
    
    /** private: method[stopEditing]
     *  :param save: ``Boolean`` If set to true, changes will be saved and the
     *      ``featuremodified`` event will be fired.
     */
    stopEditing: function(save) {
        if(this.editing) {
            //TODO remove the line below when
            // http://trac.openlayers.org/ticket/2210 is fixed.
            this.modifyControl.deactivate();
            this.modifyControl.destroy();
            
            var feature = this.feature;
            if(feature.state === this.getDirtyState()) {
                if(save === true) {
                    this.fireEvent("featuremodified", this, feature);
                } else if(feature.state === OpenLayers.State.INSERT) {
                    this.editing = false;
                    feature.layer.destroyFeatures([feature]);
                    this.close();
                } else {
                    var layer = feature.layer;
                    layer.drawFeature(feature, {display: "none"});
                    feature.geometry = this.geometry;
                    feature.attributes = this.attributes;
                    this.setFeatureState(null);
                    this.grid.setSource(feature.attributes);
                    layer.drawFeature(feature);
                    this.fireEvent("canceledit", this, feature);
                }
            }

            this.cancelButton.hide();
            this.saveButton.hide();
            this.editButton.show();
            this.allowDelete && this.deleteButton.show();
            
            this.editing = false;
        }
    },
    
    deleteFeature: function() {
        Ext.Msg.show({
            title: this.deleteMsgTitle,
            msg: this.deleteMsg,
            buttons: Ext.Msg.YESNO,
            fn: function(button) {
                if(button === "yes") {
                    this.setFeatureState(OpenLayers.State.DELETE);
                    this.fireEvent("featuremodified", this, this.feature);
                    this.close();
                }
            },
            scope: this,
            icon: Ext.MessageBox.QUESTION,
            animEl: this.getEl()
        });
    },
    
    /** private: method[setFeatureState]
     *  Set the state of this popup's feature and trigger a featuremodified
     *  event on the feature's layer.
     */
    setFeatureState: function(state) {
        this.feature.state = state;
        var layer = this.feature.layer;
        layer && layer.events.triggerEvent("featuremodified", {
            feature: this.feature
        });
    }
});
