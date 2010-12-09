/**
 * @requires plugins/Tool.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.SelectFeature = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_selectfeature */
    ptype: "gx_selectfeature",

    /** api: config[createFeatureActionTip]
     * ``String``
     * Tooltip string for select feature action (i18n).
     */
    selectFeatureActionTip: "Select a feature",
    
    /** api: config[featureManager]
     *  ``String`` The id of the :class:`gxp.plugins.FeatureManager` to use
     *  with this tool.
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
    
    /** api: config[showSelectedOnly]
     *  ``Boolean`` If set to true, only selected features will be displayed
     *  on the layer. If set to false, all features (on the current page) will
     *  be. Default is true.
     */
    showSelectedOnly: true,
    
    /** private: property[selectControl]
     *  ``OpenLayers.Control.SelectFeature``
     */
    selectControl: null,
    
    /** api: method[addActions]
     */
    addActions: function() {
        var featureManager = this.target.tools[this.featureManager];
        var featureLayer = featureManager.featureLayer;

        // create a SelectFeature control
        // "fakeKey" will be ignord by the SelectFeature control, so only one
        // feature can be selected by clicking on the map, but allow for
        // multiple selection in the featureGrid
        this.selectControl = new OpenLayers.Control.SelectFeature(featureLayer, {
            clickout: false,
            multipleKey: "fakeKey",
            eventListeners: {
                "activate": function() {
                    (this.autoLoadFeatures === true || featureManager.paging) &&
                        this.target.mapPanel.map.events.register("click", this,
                            this.noFeatureClick
                        );
                    featureManager.showLayer(
                        this.id, this.showSelectedOnly && "selected"
                    );
                    this.selectControl.unselectAll();
                },
                "deactivate": function() {
                    (this.autoLoadFeatures === true || featureManager.paging) &&
                        this.target.mapPanel.map.events.unregister("click",
                            this, this.noFeatureClick
                        );
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
        
        var toggleGroup = this.toggleGroup || Ext.id();
        var actions = gxp.plugins.SelectFeature.superclass.addActions.call(this, [new GeoExt.Action({
            tooltip: this.selectFeatureActionTip,
            iconCls: "gx-icon-selectfeature",
            disabled: true,
            toggleGroup: toggleGroup,
            enableToggle: true,
            allowDepress: true,
            control: this.selectControl,
            map: this.target.mapPanel.map
        })]);

        featureManager.on("layerchange", this.onLayerChange, this);
        
        return actions;
    },
    
    /** private: method[noFeatureClick]
     *  :arg evt: ``Object``
     */
    noFeatureClick: function(evt) {
        var featureManager = this.target.tools[this.featureManager];
        var size = this.target.mapPanel.map.getSize();
        var layer = this.target.selectedLayer.getLayer();
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
                        var fid = records[0].get("fid");
                        var filter = new OpenLayers.Filter.FeatureId({
                            fids: [fid] 
                        });

                        autoLoad = function() {
                            featureManager.loadFeatures(
                                filter, function(features) {
                                    this.selectControl.select(features[0]);
                                }, this
                            );
                        }.createDelegate(this);
                        
                        var feature = featureManager.featureLayer.getFeatureByFid(fid);                        
                        if (feature) {
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
        this.actions[0].setDisabled(!schema);
        if (!schema) {
            // not a wfs capable layer
            return;
        }
    }
    
});

Ext.preg(gxp.plugins.SelectFeature.prototype.ptype, gxp.plugins.SelectFeature);
