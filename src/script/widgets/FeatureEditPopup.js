/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
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
    
    /** api: config[vertexRenderIntent]
     *  ``String`` renderIntent for feature vertices when modifying. Undefined
     *  by default.
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
    
    /** api: config[fields]
     *  ``Array``
     *  List of field config names corresponding to feature attributes.  If
     *  not provided, fields will be derived from attributes. If provided,
     *  the field order from this list will be used, and fields missing in the
     *  list will be excluded.
     */

    /** api: config[excludeFields]
     *  ``Array`` Optional list of field names (case sensitive) that are to be
     *  excluded from the property grid.
     */
    
    /** private: property[excludeFields]
     */
    
    /** api: config[readOnly]
     *  ``Boolean`` Set to true to disable editing. Default is false.
     */
    readOnly: false,
    
    /** api: config[allowDelete]
     *  ``Boolean`` Set to true to provide a Delete button for deleting the
     *  feature. Default is false.
     */
    allowDelete: false,
    
    /** api: config[editing]
     *  ``Boolean`` Set to true to open the popup in editing mode.
     *  Default is false.
     */
    
    /** api: config[dateFormat]
     *  ``String`` Date format. Default is the value of
     *  ``Ext.form.DateField.prototype.format``.
     */
        
    /** api: config[timeFormat]
     *  ``String`` Time format. Default is the value of
     *  ``Ext.form.TimeField.prototype.format``.
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
             *  * feature - ``OpenLayers.Feature`` The feature. Will be null
             *    if editing of a feature that was just inserted was cancelled.
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
        
        if (!this.dateFormat) {
            this.dateFormat = Ext.form.DateField.prototype.format;
        }
        if (!this.timeFormat) {
            this.timeFormat = Ext.form.TimeField.prototype.format;
        }
        var feature = this.feature;
        if (!this.location) {
            this.location = feature
        };
        
        this.anchored = !this.editing;
        
        var customEditors = {};
        var customRenderers = {};
        if(this.schema) {
            var attributes = {};
            if (this.fields) {
                if (!this.excludeFields) {
                    this.excludeFields = [];
                }
                // determine the order of attributes
                for (var i=0,ii=this.fields.length; i<ii; ++i) {
                    attributes[this.fields[i]] = null;
                }
            }
            this.schema.each(function(r) {
                var type = r.get("type");
                if (type.match(/^[^:]*:?((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry))/)) {
                    // exclude gml geometries
                    return;
                }
                var name = r.get("name");
                if (this.fields) {
                    if (this.fields.indexOf(name) == -1) {
                        this.excludeFields.push(name);
                    }
                }
                var value = feature.attributes[name];
                var listeners;
                if (typeof value == "string") {
                    var format;
                    switch(type.split(":").pop()) {
                        case "date":
                            format = this.dateFormat;
                        case "dateTime":
                            if (!format) {
                                format = this.dateFormat + " " + this.timeFormat;
                            }
                            listeners = {
                                "startedit": function(el, value) {
                                    if (!(value instanceof Date)) {
                                        var date = Date.parseDate(value.replace(/Z$/, ""), "c");
                                        if (date) {
                                            this.setValue(date);
                                        }
                                    }
                                }
                            };
                            customRenderers[name] = (function() {
                                return function(value) {
                                    var date = value;
                                    if (typeof value == "string") {
                                        date = Date.parseDate(value.replace(/Z$/, ""), "c");
                                    }
                                    return date ? date.format(format) : value;
                                }
                            })();
                            break;
                        case "boolean":
                            listeners.startedit = (function() {
                                return function(el, value) {
                                    this.setValue(Boolean(value));
                                }
                            })();
                            break;
                    }
                }
                customEditors[name] = new Ext.grid.GridEditor({
                    field: Ext.create(GeoExt.form.recordToField(r)),
                    listeners: listeners
                });
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
        
        var excludeFields = this.excludeFields;
        this.grid = new Ext.grid.PropertyGrid({
            border: false,
            source: feature.attributes,
            customEditors: customEditors,
            customRenderers: customRenderers,
            viewConfig: {
                forceFit: true,
                getRowClass: function(record) {
                    if (excludeFields && excludeFields.indexOf(record.get("name")) !== -1) {
                        return "x-hide-nosize";
                    }
                }
            },
            listeners: {
                "beforeedit": function() {
                    return this.editing;
                },
                "propertychange": function() {
                    this.setFeatureState(this.getDirtyState());
                },
                scope: this
            },
            initComponent: function() {
                //TODO This is a workaround for maintaining the order of the
                // feature attributes. Decide if this should be handled in
                // another way.
                var origSort = Ext.data.Store.prototype.sort;
                Ext.data.Store.prototype.sort = function() {};
                Ext.grid.PropertyGrid.prototype.initComponent.apply(this, arguments);
                Ext.data.Store.prototype.sort = origSort;
            }
        });
        
        /**
         * TODO: This is a workaround for getting attributes with undefined
         * values to show up in the property grid.  Decide if this should be 
         * handled in another way.
         */
        this.grid.propStore.isEditableValue = function() {return true;};

        this.items = [
            this.grid
        ];

        this.bbar = new Ext.Toolbar({
            hidden: this.readOnly,
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
                {standalone: true, vertexRenderIntent: this.vertexRenderIntent}
            );
            this.feature.layer.map.addControl(this.modifyControl);
            this.modifyControl.activate();
            this.modifyControl.selectFeature(this.feature);
        }
    },
    
    /** private: method[stopEditing]
     *  :arg save: ``Boolean`` If set to true, changes will be saved and the
     *      ``featuremodified`` event will be fired.
     */
    stopEditing: function(save) {
        if(this.editing) {
            //TODO remove the line below when
            // http://trac.openlayers.org/ticket/2210 is fixed.
            this.modifyControl.deactivate();
            this.modifyControl.destroy();
            
            var feature = this.feature;
            if (feature.state === this.getDirtyState()) {
                if (save === true) {
                    //TODO consider handling date types in the OpenLayers.Format
                    if (this.schema) {
                        var attribute, rec;
                        for (var i in feature.attributes) {
                            rec = this.schema.getAt(this.schema.findExact("name", i));
                            attribute = feature.attributes[i];
                            if (attribute instanceof Date) {
                                var type = rec.get("type").split(":").pop();
                                feature.attributes[i] = attribute.format(
                                    type == "date" ? "Y-m-d" : "c"
                                );
                            }
                        }
                    }
                    this.fireEvent("featuremodified", this, feature);
                } else if(feature.state === OpenLayers.State.INSERT) {
                    this.editing = false;
                    feature.layer.destroyFeatures([feature]);
                    this.fireEvent("canceledit", this, null);
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

            if (!this.isDestroyed) {
                this.cancelButton.hide();
                this.saveButton.hide();
                this.editButton.show();
                this.allowDelete && this.deleteButton.show();
            }
            
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

/** api: xtype = gxp_featureeditpopup */
Ext.reg('gxp_featureeditpopup', gxp.FeatureEditPopup);
