Ext.namespace("gxp.plugins");

gxp.plugins.FeatureEditor = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_featureeditor */
    ptype: "gx_featureeditor",

    /** api: config[featureManager]
     *  ``String`` The :class:`gxp.plugins.FeatureManager`` to use with this
     *  tool.
     */
    featureManager: null,
    
    /** api: config[autoLoadFeatures]
     *  ``Boolean`` Should this tool load features on click? If set to true,
     *  and if there is no loaded feature at the click position, this tool will
     *  call loadFeatures on the ``featureManager``, with a ``FeatureId``
     *  filter created from the id of a feature returned from a WMS
     *  GetFeatureInfo request at the click position. This feature will then be
     *  selected immediately. Default is false.
     */
    autoLoadFeatures: false,
    
    /** private: property[selectContrl]
     *  ``OpenLayers.Control.SelectFeature``
     */
    selectControl: null,
    
    /** private: property[popup]
     *  ``GeoExt.Popup`` FeatureEditPopup for this tool
     */
    popup: null,
    
    /** private: property[autoLoadedFeature]
     *  ``OpenLayers.Feature`` the auto-loaded feature when autoLoadFeatures is
     *  true.
     */
    autoLoadedFeature: null,
    
    /** private: property[schema]
     *  ``GeoExt.data.AttributeStore``
     */
    schema: null,
    
    /** api: method[addActions]
     */
    addActions: function() {
        var popup;
        var featureManager = this.target.tools[this.featureManager];
        var featureLayer = featureManager.featureLayer;
        featureManager.on("beforequery", function(mgr, filter) {
            if (popup) {
                if (popup.editing) {
                    function query() {
                        featureManager.featureStore.un("write", query, this);
                        popup.un("canceledit", query, this);
                        mgr.query(filter);
                    };
                    featureManager.featureStore.on("write", query, this);
                    popup.on("canceledit", query, this);
                }
                popup.close();
                return !popup.editing;
            }
        }, this);
        
        // create a SelectFeature control
        // "fakeKey" will be ignord by the SelectFeature control, so only one
        // feature can be selected by clicking on the map, but allow for
        // multiple selection in the featureGrid
        this.selectControl = new OpenLayers.Control.SelectFeature(featureLayer, {
            clickout: false,
            multipleKey: "fakeKey",
            eventListeners: {
                "activate": function() {
                    this.autoLoadFeatures === true &&
                        this.target.mapPanel.map.events.register("click", this,
                            this.noFeatureClick
                        );
                    this.target.tools[this.featureManager].showLayer(this.id);
                    this.selectControl.unselectAll(popup && popup.editing && {except: popup.feature});
                },
                "deactivate": function() {
                    this.autoLoadFeatures === true &&
                        this.target.mapPanel.map.events.unregister("click",
                            this, this.noFeatureClick
                        );
                    var featureManager = this.target.tools[this.featureManager];
                    if (popup) {
                        if (popup.editing) {
                            popup.on("cancelclose", function() {
                                this.selectControl.activate();
                            }, this, {single: true})
                        }
                        popup.on("close", function() {
                            featureManager.hideLayer(this.id);
                        }, this, {single: true});
                        popup.close();
                    } else {
                        featureManager.hideLayer(this.id);
                    }
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
                var featureManager = this.target.tools[this.featureManager];
                var featureStore = featureManager.featureStore;
                if(this.selectControl.active) {
                    popup = new gxp.FeatureEditPopup(Ext.apply({
                        collapsible: true,
                        feature: feature,
                        editing: feature.state === OpenLayers.State.INSERT,
                        schema: this.schema,
                        allowDelete: true,
                        width: 200,
                        height: 250,
                        listeners: {
                            "close": function() {
                                if(feature.layer && feature.layer.selectedFeatures.indexOf(feature) !== -1) {
                                    this.selectControl.unselect(feature);
                                }
                                if (feature === this.autoLoadedFeature) {
                                    featureStore.removeAll();
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
                    this.popup = popup;
                    popup.show();
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

        featureManager.on("layerchange", this.onLayerChange, this);
    },
    
    noFeatureClick: function(evt) {
        var size = this.target.mapPanel.map.getSize();
        var layer = this.target.tools[this.featureManager].selectedLayer.getLayer();
        var store = new GeoExt.data.FeatureStore({
            fields: {},
            proxy: new GeoExt.data.ProtocolProxy({
                protocol: new OpenLayers.Protocol.HTTP({
                    url: layer.getFullRequestString({
                        REQUEST: "GetFeatureInfo",
                        BBOX: this.target.mapPanel.map.getExtent().toBBOX(),
                        WIDTH: size.w,
                        HEIGHT: size.h,
                        X: evt.xy.x,
                        Y: evt.xy.y,
                        QUERY_LAYERS: layer.params.LAYERS,
                        INFO_FORMAT: "application/vnd.ogc.gml",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        FEATURE_COUNT: 1
                    }),
                    format: new OpenLayers.Format.WMSGetFeatureInfo()
                })
            }),
            autoLoad: true,
            listeners: {
                "load": function(store, records) {
                    if (records.length > 0) {
                        var filter = new OpenLayers.Filter.FeatureId({
                            fids: [records[0].get("fid")] 
                        });
                        this.target.tools[this.featureManager].loadFeatures(
                            filter, function(features) {
                                this.autoLoadedFeature = features[0];
                                this.selectControl.select(features[0]);
                            }, this
                        );
                    }
                },
                scope: this
            }
        });
    },
    
    onLayerChange: function(mgr, layer, schema) {
        this.schema = schema;
        this.actions[0].setDisabled(!schema);
        !schema && this.selectControl.deactivate(); 
    }
    
});

Ext.preg(gxp.plugins.FeatureEditor.prototype.ptype, gxp.plugins.FeatureEditor);
