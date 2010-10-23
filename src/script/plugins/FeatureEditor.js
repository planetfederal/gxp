Ext.namespace("gxp.plugins");

gxp.plugins.FeatureEditor = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_featureeditor */
    ptype: "gx_featureeditor",

    /** api: config[featureManager]
     *  ``String`` The :class:`gxp.plugins.FeatureManager`` to use with this
     *  tool.
     */
    featureManager: null,
    
    /** private: property[selectedLayer]
     */
    selectedLayer: null,
    
    /** private: property[selectContrl]
     */
    selectControl: null,
    
    /** api: method[addActions]
     */
    addActions: function() {
        var popup;
        var featureLayer = this.target.tools[this.featureManager].featureLayer;
        
        // create a SelectFeature control
        // "fakeKey" will be ignord by the SelectFeature control, so only one
        // feature can be selected by clicking on the map, but allow for
        // multiple selection in the featureGrid
        this.selectControl = new OpenLayers.Control.SelectFeature(featureLayer, {
            clickout: false,
            multipleKey: "fakeKey",
            eventListeners: {
                "activate": function() {
                    this.target.tools[this.featureManager].showLayer(true);
                    this.selectControl.unselectAll(popup && popup.editing && {except: popup.feature});
                },
                "deactivate": function() {
                    if(popup) {
                        if(popup.editing) {
                            popup.on("cancelclose", function() {
                                this.selectControl.activate();
                            }, this, {single: true})
                        }
                        popup.close();
                    }
                    this.target.tools[this.featureManager].showLayer(false);
                },
                scope: this
            }
        });

        featureLayer.events.on({
            "featureunselected": function(evt) {
                if(popup) {
                    popup.close();
                }
            },
            "beforefeatureselected": function(evt) {
                //TODO decide if we want to allow feature selection while a
                // feature is being edited. If so, we have to revisit the
                // SelectFeature/ModifyFeature setup, because that would
                // require to have the SelectFeature control *always*
                // activated *after* the ModifyFeature control. Otherwise. we
                // must not configure the ModifyFeature control in standalone
                // mode, and use the SelectFeature control that comes with the
                // ModifyFeature control instead.
                if(popup) {
                    return !popup.editing;
                }
            },
            "featureselected": function(evt) {
                var feature = evt.feature;
                var featureStore = this.target.tools[this.featureManager].featureStore;
                if(this.selectControl.active) {
                    var source = this.target.layerSources[this.selectedLayer.get("source")];
                    source.getSchema(this.selectedLayer, function(schema) {
                        popup = new gxp.FeatureEditPopup(Ext.apply({
                            collapsible: true,
                            feature: feature,
                            editing: feature.state === OpenLayers.State.INSERT,
                            schema: schema,
                            allowDelete: true,
                            width: 200,
                            height: 250,
                            listeners: {
                                "close": function() {
                                    if(feature.layer && feature.layer.selectedFeatures.indexOf(feature) !== -1) {
                                        this.selectControl.unselect(feature);
                                    }
                                },
                                "featuremodified": function(popup, feature) {
                                    popup.disable();
                                    featureStore.on({
                                        write: {
                                            fn: function() {
                                                if (popup && popup.isVisible()) {
                                                    popup.enable();
                                                }
                                            },
                                            single: true
                                        },
                                        scope: this
                                    });                                
                                    if(feature.state === OpenLayers.State.DELETE) {                                    
                                        /**
                                         * If the feature state is delete, we need to
                                         * remove it from the store (so it is collected
                                         * in the store.removed list.  However, it should
                                         * not be removed from the layer.  Until
                                         * http://trac.geoext.org/ticket/141 is addressed
                                         * we need to stop the store from removing the
                                         * feature from the layer.
                                         */
                                        featureStore._removing = true; // TODO: remove after http://trac.geoext.org/ticket/141
                                        featureStore.remove(store.getRecordFromFeature(feature));
                                        delete featureStore._removing; // TODO: remove after http://trac.geoext.org/ticket/141
                                    }
                                    featureStore.save();
                                },
                                "canceledit": function(popup, feature) {
                                    featureStore.commitChanges();
                                },
                                scope: this
                            }
                        }, this.outputConfig));
                        popup.show();
                    }, this);
                }
            },
            "featuresadded": function(evt) {
                var feature = evt.features.length === 1 && evt.features[0];
                if(feature && feature.state === OpenLayers.State.INSERT) {
                    this.selectControl.activate();
                    this.selectControl.select(feature);
                }
            },
            scope: this
        });

        gxp.plugins.FeatureEditor.superclass.addActions.call(this, [new GeoExt.Action({
            tooltip: "Edit existing feature",
            iconCls: "gx-icon-editfeature",
            disabled: true,
            toggleGroup: this.toggleGroup,
            enableToggle: true,
            allowDepress: !this.toggleGroup,
            control: this.selectControl,
            map: this.target.mapPanel.map
        })]);

        this.target.on("layerselectionchange", this.onLayerSelectionChange, this);
    },
    
    onLayerSelectionChange: function(rec) {
        this.selectedLayer = rec;
        var source = this.target.getSource(rec);
        if (source && source instanceof gxp.plugins.WMSSource) {
            source.describeLayer(rec, function(r) {
                this.actions[0].setDisabled(r.get("owsType") != "WFS");
            }, this);
        } else {
            this.actions[0].disable();
        }
    }
    
});

Ext.preg(gxp.plugins.FeatureEditor.prototype.ptype, gxp.plugins.FeatureEditor);
