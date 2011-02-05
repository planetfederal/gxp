/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/FeatureEditPopup.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeatureEditor
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeatureEditor(config)
 *
 *    Plugin for feature editing. Requires a
 *    :class:`gxp.plugins.FeatureManager`.
 */   
gxp.plugins.FeatureEditor = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_featureeditor */
    ptype: "gxp_featureeditor",

    /** api: config[createFeatureActionTip]
     *  ``String``
     *  Tooltip string for create new feature action (i18n).
     */
    createFeatureActionTip: "Create a new feature",

    /** api: config[createFeatureActionText]
     *  ``String``
     *  Create new feature text.
     */
    
    /** api: config[editFeatureActionTip]
     *  ``String``
     *  Tooltip string for edit existing feature action (i18n).
     */
    editFeatureActionTip: "Edit existing feature",

    /** api: config[editFeatureActionText]
     *  ``String``
     *  Modify feature text.
     */

    /** api: config[outputTarget]
     *  ``String`` By default, the FeatureEditPopup will be added to the map.
     */
    outputTarget: "map",
    
    /** api: config[featureManager]
     *  ``String`` The id of the :class:`gxp.plugins.FeatureManager` to use
     *  with this tool.
     */
    featureManager: null,
    
    /** api: config[snappingAgent]
     *  ``String`` Optional id of the :class:`gxp.plugins.SnappingAgent` to use
     *  with this tool.
     */
    snappingAgent: null,
    
    /** api: config[readOnly]
     *  ``Boolean`` Set to true to use the FeatureEditor merely as a feature
     *  info tool, without editing capabilities. Default is false.
     */
    readOnly: false,
    
    /** api: config[autoLoadFeatures]
     *  ``Boolean`` Should this tool load features on click? If set to true,
     *  and if there is no loaded feature at the click position, this tool will
     *  call loadFeatures on the ``featureManager``, with a ``FeatureId``
     *  filter created from the id of a feature returned from a WMS
     *  GetFeatureInfo request at the click position. This feature will then be
     *  selected immediately. Default is false.
     */
    autoLoadFeatures: false,
    
    /** api: config[showSelectedOnly]
     *  ``Boolean`` If set to true, only selected features will be displayed
     *  on the layer. If set to false, all features (on the current page) will
     *  be. Default is true.
     */
    showSelectedOnly: true,
    
    /** api: config[fields]
     *  ``Array``
     *  List of field config names corresponding to feature attributes.  If
     *  not provided, fields will be derived from attributes. If provided,
     *  the field order from this list will be used, and fields missing in the
     *  list will be excluded.
     */

    /** api: config[excludeFields]
     *  ``Array`` Optional list of field names (case sensitive) that are to be
     *  excluded from the property grid of the FeatureEditPopup.
     */
    
    /** private: property[drawControl]
     *  ``OpenLayers.Control.DrawFeature``
     */
    drawControl: null,
    
    /** private: property[selectControl]
     *  ``OpenLayers.Control.SelectFeature``
     */
    selectControl: null,
    
    /** private: property[popup]
     *  :class:`gxp.FeatureEditPopup` FeatureEditPopup for this tool
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

        // optionally set up snapping
        var snapId = this.snappingAgent;
        if (snapId) {
            var snappingAgent = this.target.tools[snapId];
            if (snappingAgent) {
                snappingAgent.addSnappingControl(featureLayer);
            } else {
                throw new Error("Unable to locate snapping agent: " + snapId);
            }
        }

        // intercept calls to methods that change the feature store - allows us
        // to persist unsaved changes before calling the original function
        function intercept(mgr, fn) {
            var fnArgs = Array.prototype.slice.call(arguments);
            // remove mgr and fn, which will leave us with the original
            // arguments of the intercepted loadFeatures or setLayer function
            fnArgs.splice(0, 2);
            if (popup) {
                if (popup.editing) {
                    function doIt() {
                        unregisterDoIt.call(this);
                        if (fn === "setLayer") {
                            this.target.selectLayer(fnArgs[0]);
                        } else if (fn === "clearFeatures") {
                            // nothing asynchronous involved here, so let's
                            // finish the caller first before we do anything.
                            window.setTimeout(function() {mgr[fn].call(mgr);});
                        } else {
                            mgr[fn].apply(mgr, fnArgs);
                        }
                    };
                    function unregisterDoIt() {
                        featureManager.featureStore.un("write", doIt, this);
                        popup.un("canceledit", doIt, this);
                    }
                    featureManager.featureStore.on("write", doIt, this);
                    popup.on({
                        canceledit: doIt,
                        cancelclose: unregisterDoIt,
                        scope: this
                    });
                }
                popup.close();
                return !popup.editing;
            }
        };
        featureManager.on({
            "beforequery": intercept.createDelegate(this, "loadFeatures", 1),
            "beforelayerchange": intercept.createDelegate(this, "setLayer", 1),
            "beforesetpage": intercept.createDelegate(this, "setPage", 1),
            "beforeclearfeatures": intercept.createDelegate(this, "clearFeatures", 1),
            scope: this
        });
        
        this.drawControl = new OpenLayers.Control.DrawFeature(
            featureLayer,
            OpenLayers.Handler.Point, 
            {
                eventListeners: {
                    featureadded: function(evt) {
                        if (this.autoLoadFeatures === true) {
                            this.autoLoadedFeature = evt.feature;
                        }
                    },
                    activate: function() {
                        featureManager.showLayer(
                            this.id, this.showSelectedOnly && "selected"
                        );
                    },
                    deactivate: function() {
                        featureManager.hideLayer(this.id);
                    },
                    scope: this
                }
            }
        );
        
        // create a SelectFeature control
        // "fakeKey" will be ignord by the SelectFeature control, so only one
        // feature can be selected by clicking on the map, but allow for
        // multiple selection in the featureGrid
        this.selectControl = new OpenLayers.Control.SelectFeature(featureLayer, {
            clickout: false,
            multipleKey: "fakeKey",
            eventListeners: {
                "activate": function() {
                    if (this.autoLoadFeatures === true || featureManager.paging) {
                        this.target.mapPanel.map.events.register(
                            "click", this, this.noFeatureClick
                        );
                    }
                    featureManager.showLayer(
                        this.id, this.showSelectedOnly && "selected"
                    );
                    this.selectControl.unselectAll(
                        popup && popup.editing && {except: popup.feature}
                    );
                },
                "deactivate": function() {
                    if (this.autoLoadFeatures === true || featureManager.paging) {
                        this.target.mapPanel.map.events.unregister(
                            "click", this, this.noFeatureClick
                        );
                    }
                    if (popup) {
                        if (popup.editing) {
                            popup.on("cancelclose", function() {
                                this.selectControl.activate();
                            }, this, {single: true});
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
                var featureStore = featureManager.featureStore;
                if(this.selectControl.active) {
                    popup = this.addOutput({
                        xtype: "gxp_featureeditpopup",
                        collapsible: true,
                        feature: feature,
                        vertexRenderIntent: "vertex",
                        readOnly: this.readOnly,
                        fields: this.fields,
                        excludeFields: this.excludeFields,
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
                                    featureStore.remove(featureStore.getRecordFromFeature(feature));
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
                                    featureStore.remove(featureStore.getRecordFromFeature(feature));
                                    delete featureStore._removing; // TODO: remove after http://trac.geoext.org/ticket/141
                                }
                                featureStore.save();
                            },
                            "canceledit": function(popup, feature) {
                                featureStore.commitChanges();
                            },
                            scope: this
                        }
                    });
                    this.popup = popup;
                }
            },
            "sketchcomplete": function(evt) {
                // Why not register for featuresadded directly? We only want
                // to handle features here that were just added by a
                // DrawFeature control, and we need to make sure that our
                // featuresadded handler is executed after any FeatureStore's,
                // because otherwise our selectControl.select statement inside
                // this handler would trigger a featureselected event before
                // the feature row is added to a FeatureGrid. This, again,
                // would result in the new feature not being shown as selected
                // in the grid.
                featureManager.featureLayer.events.register("featuresadded", this, function(evt) {
                    featureManager.featureLayer.events.unregister("featuresadded", this, arguments.callee);
                    this.drawControl.deactivate();
                    this.selectControl.activate();
                    this.selectControl.select(evt.features[0]);
                });
            },
            scope: this
        });

        var toggleGroup = this.toggleGroup || Ext.id();
        var actions = gxp.plugins.FeatureEditor.superclass.addActions.call(this, [new GeoExt.Action({
            tooltip: this.createFeatureActionTip,
            text: this.createFeatureActionText,
            iconCls: "gxp-icon-addfeature",
            disabled: true,
            hidden: this.readOnly,
            toggleGroup: toggleGroup,
            enableToggle: true,
            allowDepress: true,
            control: this.drawControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        }), new GeoExt.Action({
            tooltip: this.editFeatureActionTip,
            text: this.editFeatureActionText,
            iconCls: "gxp-icon-editfeature",
            disabled: true,
            toggleGroup: toggleGroup,
            enableToggle: true,
            allowDepress: true,
            control: this.selectControl,
            deactivateOnDisable: true,
            map: this.target.mapPanel.map
        })]);

        featureManager.on("layerchange", this.onLayerChange, this);
        
        return actions;
    },
    
    /** private: method[noFeatureClick]
     *  :arg evt: ``Object``
     */
    noFeatureClick: function(evt) {
        var evtLL = this.target.mapPanel.map.getLonLatFromPixel(evt.xy);
        var featureManager = this.target.tools[this.featureManager];
        var page = featureManager.page;
        if (featureManager.visible() == "all" && featureManager.paging && page && page.extent.containsLonLat(evtLL)) {
            // no need to load a different page if the clicked location is
            // inside the current page bounds and all features are visible
            return;
        }

        var layer = featureManager.layerRecord && featureManager.layerRecord.getLayer();
        if (!layer) {
            // if the feature manager has no layer currently set, do nothing
            return;
        }
        
        // construct params for GetFeatureInfo request
        // layer is not added to map, so we do this manually
        var map = this.target.mapPanel.map;
        var size = map.getSize();
        var params = Ext.applyIf({
            REQUEST: "GetFeatureInfo",
            BBOX: map.getExtent().toBBOX(),
            WIDTH: size.w,
            HEIGHT: size.h,
            X: evt.xy.x,
            Y: evt.xy.y,
            QUERY_LAYERS: layer.params.LAYERS,
            INFO_FORMAT: "application/vnd.ogc.gml",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            FEATURE_COUNT: 1
        }, layer.params);
        var projectionCode = map.getProjection();
        if (parseFloat(layer.params.VERSION) >= 1.3) {
            params.CRS = projectionCode;
        } else {
            params.SRS = projectionCode;
        }
        
        var store = new GeoExt.data.FeatureStore({
            fields: {},
            proxy: new GeoExt.data.ProtocolProxy({
                protocol: new OpenLayers.Protocol.HTTP({
                    url: (typeof layer.url === "string") ? layer.url : layer.url[0],
                    params: params,
                    format: new OpenLayers.Format.WMSGetFeatureInfo()
                })
            }),
            autoLoad: true,
            listeners: {
                "load": function(store, records) {
                    if (records.length > 0) {
                        var fid = records[0].get("fid");
                        var filter = new OpenLayers.Filter.FeatureId({
                            fids: [fid] 
                        });

                        var autoLoad = function() {
                            featureManager.loadFeatures(
                                filter, function(features) {
                                    this.autoLoadedFeature = features[0];
                                    this.selectControl.select(features[0]);
                                }, this
                            );
                        }.createDelegate(this);
                        
                        var feature = featureManager.featureLayer.getFeatureByFid(fid);                        
                        if (feature) {
                            var popup = this.popup;
                            this.selectControl.unselectAll(
                                popup && popup.editing && {except: popup.feature});
                            this.selectControl.select(feature);
                        } else if (featureManager.paging) {
                            var lonLat = this.target.mapPanel.map.getLonLatFromPixel(evt.xy);
                            featureManager.setPage({lonLat: lonLat}, function() {
                                var feature = featureManager.featureLayer.getFeatureByFid(fid);
                                if (feature) {
                                    this.selectControl.select(feature);
                                } else if (this.autoLoadFeatures === true) {
                                    autoLoad();
                                }
                            }, this);
                        } else {
                            autoLoad();
                        }
                    }
                },
                scope: this
            }
        });
    },
    
    /** private: method[onLayerChange]
     *  :arg mgr: :class:`gxp.plugins.FeatureManager`
     *  :arg layer: ``GeoExt.data.LayerRecord``
     *  :arg schema: ``GeoExt.data.AttributeStore``
     */
    onLayerChange: function(mgr, layer, schema) {
        this.schema = schema;
        this.actions[0].setDisabled(!schema);
        this.actions[1].setDisabled(!schema);
        if (!schema) {
            // not a wfs capable layer
            return;
        }

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
    }
    
});

Ext.preg(gxp.plugins.FeatureEditor.prototype.ptype, gxp.plugins.FeatureEditor);
