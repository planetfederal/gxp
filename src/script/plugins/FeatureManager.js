/**
 * @requires plugins/Tool.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.FeatureManager = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_wmsgetfeatureinfo */
    ptype: "gx_featuremanager",
    
    /** api: config[maxFeatures]
     *  ``Number`` Default is 100
     */
    maxFeatures: 100,

    /** api: config[layerConfig]
     *  ``Object`` Optional configuration for the vector layer
     */
    layerConfig: null,
    
    /** api: config[autoSetLayer]
     *  ``Boolean`` Listen to the viewer's layerselectionchange event to
     *  automatically set the layer? Default is true.
     */
    autoSetLayer: true,

    /** api: config[autoLoadFeatures]
     *  ``Boolean`` Automatically load features after a new layer has been set?
     *  Default is false.
     */
    autoLoadFeatures: false,
    
    /** api: property[selectedLayer]
     *  ``GeoExt.data.LayerRecord`` The currently selected layer
     */
    selectedLayer: null,
    
    /** api: property[featureStore]
     *  :class:`gxp.data.WFSFeatureStore` The FeatureStore that this tool
     *  manages.
     */
    featureStore: null,
    
    /** api: property[featureLayer]
     *  ``OpenLayers.Layer.Vector`` The layer associated with this tool's
     *  featureStore.
     */
    featureLayer: null,
    
    /** api: property[geometryType]
     *  ``String`` The geometry type of the featureLayer
     */
    geometryType: null,
    
    /** private: property[toolsShowingLayer]
     *  ``Array`` of tool ids that currently need to show the layer.
    toolsShowingLayer: null,
    
    /** api: method[init]
     */
    init: function(target) {
        gxp.plugins.FeatureEditor.superclass.init.apply(this, arguments);
        
        this.addEvents(
            /** api: event[beforequery]
             *  Fired before a WFS GetFeature request is issued. This event
             *  can be used to abort the loadFeatures method before any action
             *  is performed, by having a listener return false.
             *
             *  Listener arguments:
             *  * tool   - :class:`gxp.plugins.FeatureManager` this tool
             *  * filter - ``OpenLayers.Filter`` the filter argument passed to
             *    the loadFeatures method
             *  * callback - ``Function`` the callback argument passed to the
             *    loadFeatures method
             *  * scope - ``Object`` the scope argument passed to the
             *    loadFeatures method
             */
            "beforequery",
            
            /** api: event[query]
             *  Fired after a WFS GetFeature query, when the results are
             *  available.
             *
             *  Listener arguments:
             *  * tool  - :class:`gxp.plugins.FeatureManager` this tool
             *  * store - :class:`gxp.data.WFSFeatureStore
             */
            "query",
            
            /** api: event[beforelayerchange]
             *  Fired before a layer change results in destruction of the
             *  current featureStore, and creation of a new one. This event
             *  can be used to abort the setLayer method before any action is
             *  performed, by having a listener return false.
             *
             *  Listener arguments:
             *  * tool  - :class:`gxp.plugins.FeatureManager` this tool
             *  * layer - ``GeoExt.data.LayerRecord`` the layerRecord argument
             *    passed to the setLayer method
             */
            "beforelayerchange",
            
            /** api: event[layerchange]
             *  Fired after a layer change, as soon as the layer's schema is
             *  available.
             *
             *  Listener arguments:
             *  * tool   - :class:`gxp.plugins.FeatureManager` this tool
             *  * layer  - ``GeoExt.data.LayerRecord`` the new layer
             *  * schema - ``GeoExt.data.AttributeStore`` or false if the
             *    layer has no associated WFS FeatureType.
             */
            "layerchange"
        );
        
        this.toolsShowingLayer = [];

        this.featureLayer = new OpenLayers.Layer.Vector(Ext.id(), Ext.apply({
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style(null, {
                    rules: [new OpenLayers.Rule({
                        symbolizer: {
                            "Point": {
                                pointRadius: 4,
                                graphicName: "square",
                                fillColor: "white",
                                fillOpacity: 1,
                                strokeWidth: 1,
                                strokeOpacity: 1,
                                strokeColor: "#333333"
                            },
                            "Line": {
                                strokeWidth: 4,
                                strokeOpacity: 1,
                                strokeColor: "#ff9933"
                            },
                            "Polygon": {
                                strokeWidth: 2,
                                strokeOpacity: 1,
                                strokeColor: "#ff6633",
                                fillColor: "white",
                                fillOpacity: 0.3
                            }
                        }
                    })]
                })
            })    
        }, this.layerConfig));

        this.autoSetLayer && this.target.on("layerselectionchange",
            this.setLayer, this
        );
    },
    
    /** api: method[setLayer]
     *  :arg layerRecord: ``GeoExt.data.LayerRecord``
     *
     *  Sets the layer for this tool
     */
    setLayer: function(layerRecord) {
        if (this.fireEvent("beforelayerchange", this, layerRecord) !== false) {
            if (layerRecord !== this.selectedLayer) {
                this.clearFeatureStore();
                this.selectedLayer = layerRecord;
                if (layerRecord) {
                    this.autoLoadFeatures === true ?
                        this.loadFeatures() :
                        this.setFeatureStore();
                }
            }
        }
    },
    
    /** api: method[showLayer]
     *  :arg id: ``String`` id of a tool that needs to show this tool's
     *      featureLayer.
     */
    showLayer: function(id) {
        if (this.toolsShowingLayer.indexOf(id) == -1) {
            this.toolsShowingLayer.push(id);
        }
        if (this.toolsShowingLayer.length > 0 && !this.featureLayer.map) {
            this.target.mapPanel.map.addLayer(this.featureLayer);
        }
    },
    
    /** api: method[hideLayer]
     *  :arg id: ``String`` id of a tool that no longer needs to show this
     *      tool's featureLayer. The layer will be hidden if no more tools need
     *      to show it.
     */
    hideLayer: function(id) {
        this.toolsShowingLayer.remove(id);
        if (this.toolsShowingLayer.length == 0 && this.featureLayer.map) {
            this.target.mapPanel.map.removeLayer(this.featureLayer);
        }
    },
    
    /** api: method[loadFeatures]
     *  :arg filter: ``OpenLayers.Filter`` Optional filter for the GetFeature
     *      request.
     *  :arg callback: ``Function`` Optional callback to call when the
     *      features are loaded. This function will be called with the array
     *      of the laoded features (``OpenLayers.Feature.Vector``) as argument.
     *  :arg scope: ``Object`` Optional scope for the callback function.
     */
    loadFeatures: function(filter, callback, scope) {
        if (this.fireEvent("beforequery", this, filter, callback, scope) !== false) {
            callback && this.featureLayer.events.register(
                "featuresadded", this, function(evt) {
                    if (this._query) {
                        delete this._query;
                        this.featureLayer.events.unregister(
                            "featuresadded", this, arguments.callee
                        );
                        callback.call(scope, evt.features);
                    }
                }
            );
            this._query = true;
            if (!this.featureStore) {
                this.setFeatureStore(filter, true);
            } else {
                this.featureStore.setOgcFilter(filter);
                this.featureStore.load();
            };
        }
    },
    
    /** private: method[setFeatureStore]
     *  :arg filter: ``OpenLayers.Filter``
     *  :arg autoLoad: ``Boolean``
     */
    setFeatureStore: function(filter, autoLoad) {
        var rec = this.selectedLayer;
        var source = this.target.getSource(rec);
        if (source && source instanceof gxp.plugins.WMSSource) {
            source.getSchema(rec, function(s) {
                if (s === false) {
                    this.clearFeatureStore();
                } else {
                    var fields = [];
                    s.each(function(r) {
                        fields.push({
                            name: r.get("name"),
                            type: ({
                                "xsd:boolean": "boolean",
                                "xsd:int": "int",
                                "xsd:integer": "int",
                                "xsd:short": "int",
                                "xsd:long": "int",
                                "xsd:date": "date",
                                "xsd:string": "string",
                                "xsd:float": "float",
                                "xsd:double": "float"
                            })[r.get("type")]
                        })
                    }, this);
                    this.featureStore = new gxp.data.WFSFeatureStore({
                        fields: fields,
                        srsName: this.target.mapPanel.map.getProjection(),
                        url: s.url,
                        featureType: s.reader.raw.featureTypes[0].typeName,
                        featureNS: s.reader.raw.targetNamespace,
                        maxFeatures: this.maxFeatures,
                        layer: this.featureLayer,
                        ogcFilter: filter,
                        autoLoad: autoLoad,
                        autoSave: false,
                        listeners: {
                            "write": function() {
                                rec.getLayer().redraw(true);
                            },
                            "load": function() {
                                this.fireEvent("query", this, this.featureStore);
                            },
                            scope: this
                        }
                    });
                    
                    // detect the geometry type
                    s.each(function(r) {
                        // TODO: To be more generic, we would look for GeometryPropertyType as well.
                        var match = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface)).*/.exec(r.get("type"));
                        if (match) {
                            this.geometryType = match[1];
                        }
                        return !match;
                    }, this);
                }
                this.fireEvent("layerchange", this, rec, s);
                }, this
            );
        } else {
            this.clearFeatureStore();
            this.fireEvent("layerchange", this, rec, false);
        }        
    },
    
    /** private: method[clearFeatureStore]
     */
    clearFeatureStore: function() {
        if (this.featureStore) {
            //TODO remove when http://trac.geoext.org/ticket/367 is resolved
            this.featureStore.removeAll();
            this.featureStore.unbind();
            // end remove
            this.featureStore.destroy();
            this.featureStore = null;
            this.geometryType = null;
        }
    }

});

Ext.preg(gxp.plugins.FeatureManager.prototype.ptype, gxp.plugins.FeatureManager);
