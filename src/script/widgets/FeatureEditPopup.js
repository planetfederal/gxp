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
    editButtonText: 'Edit',
    editButtonTooltip: 'Make this feature editable',
    cancelButtonText: 'Cancel',
    cancelButtonTooltip: 'Stop editing, discard changes',
    saveButtonText: 'Save',
    saveButtonTooltip: 'Save changes',
    
    /** private config overrides **/
    layout: "fit",
    
    /** api: config[featureStore]
     *  ``GeoExt.data.FeatureStore``
     *  Optional store that contains a reference to the feature.  If provided,
     *  the appropriate record will be updated when the use clicks the save
     *  button.
     */

    /** api: config[feature]
     *  ``OpenLayers.Feature.Vector`` The feature to edit and display.
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
    
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        this.addEvents(
            /** api: events[featuremodified]
             *  Fires when the feature associated witht this popup has been
             *  modified (i.e. when the user clicks "Save" on the popup).
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.FeatureEditPopup` This popup.
             *  * feature - ``OpenLayers.Feature`` The modified feature.
             */
            "featuremodified"
        );
        
        var feature = this.feature;
        
        if(!this.title && feature.fid) {
            this.title = feature.fid;
        }
        
        this.editButton = new Ext.Button({
            text: this.editButtonText,
            tooltip: this.editButtonTooltip,
            iconCls: "edit",
            handler: function() {
                this.startEditing();
            },
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
            listeners: {
                "beforeedit": function() {
                    return this.editing;
                },
                "propertychange": function() {
                    this.feature.state = OpenLayers.State.UPDATE;
                },
                scope: this
            }
        });

        this.items = [
            this.grid
        ];

        this.bbar = new Ext.Toolbar({
            items: [
                this.saveButton,
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
            "beforeclose": function() {
                if(!this.editing) {
                    return;
                }
                if(this.feature.state === OpenLayers.State.UPDATE) {
                    Ext.Msg.show({
                        title: this.closeMsgTitle,
                        msg: this.closeMsg,
                        buttons: Ext.Msg.YESNOCANCEL,
                        fn: function(button) {
                            if(button && button !== "cancel") {
                                this.stopEditing(button === "yes");
                                this.close();
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
    
    /** private: method[startEditing]
     */
    startEditing: function() {
        if(!this.editing) {
            this.editing = true;
            this.anc && this.unanchorPopup();

            this.editButton.hide();
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
            this.modifyControl.destroy();
            
            if(this.feature.state === OpenLayers.State.UPDATE) {
                if(save === true) {
                    if(this.featureStore) {
                        var index = this.featureStore.findBy(function(r) {
                            return r.get("feature") === this.feature;
                        }, this);
                        if(index > -1) {
                            var record = this.featureStore.getAt(index);
                            /**
                             * TODO: remove the _updating flag when
                             * http://trac.geoext.org/ticket/132 is closed.
                             */
                            this.featureStore._updating = true;
                            record.beginEdit();
                            for(var key in this.feature.attributes) {
                                record.set(key, this.feature.attributes[key]);
                            }
                            record.endEdit();
                            /**
                             * TODO: remove the _updating flag when
                             * http://trac.geoext.org/ticket/132 is closed.
                             */
                            delete this.featureStore._updating;
                        }
                    }
                    this.fireEvent("featuremodified", this, this.feature);
                } else {
                    var layer = this.feature.layer;
                    layer.drawFeature(this.feature, {display: "none"});
                    this.feature.geometry = this.geometry;
                    this.feature.attributes = this.attributes;
                    this.feature.state = null;
                    this.grid.setSource(this.feature.attributes);
                    layer.drawFeature(this.feature);
                }
            }

            this.cancelButton.hide();
            this.saveButton.hide();
            this.editButton.show();
            
            this.editing = false;
        }
    }
});
