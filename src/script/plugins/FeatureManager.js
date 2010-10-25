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
    
    featureLayer: null,
    
    selectedLayer: null,
    
    featureStore: null,
    
    toolsShowingLayer: null,
    
    /** api: method[init]
     */
    init: function(target) {
        gxp.plugins.FeatureEditor.superclass.init.apply(this, arguments);
        
        this.addEvents(
            "beforequery",
            "query"
        );
        
        this.toolsShowingLayer = 0;

        this.featureLayer = new OpenLayers.Layer.Vector(Ext.id(), Ext.apply({
            displayInLayerSwitcher: false,
            visible: false
        }, this.layerConfig));

        this.autoSetLayer && this.target.on("layerselectionchange",
            this.setLayer, this
        );
    },
    
    setLayer: function(rec) {
        if (rec !== this.selectedLayer) {
            this.selectedLayer = rec;
            if (rec) {
                this.autoLoadFeatures === true ?
                    this.loadFeatures() :
                    this.setFeatureStore();
            } else {
                this.clearFeatureStore();
            }
        }
    },
    
    showLayer: function(need) {
        if (need === true) {
            this.toolsShowingLayer++;
        } else {
            this.toolsShowingLayer--;
        }
        if (this.toolsShowingLayer == 0) {
            this.target.mapPanel.map.removeLayer(this.featureLayer);
        } else if (this.toolsShowingLayer == 1) {
            this.target.mapPanel.map.addLayer(this.featureLayer);
        }
    },
    
    /** api: method[loadFeatures]
     *  :param filter: ``OpenLayers.Filter`` Optional filter for the GetFeature
     *      request.
     *  :param callback: ``Function`` Optional callback to call when the
     *      features are loaded. This function will be called with the array
     *      of the laoded features (``OpenLayers.Feature.Vector``) as argument.
     *  :param scope: ``Object`` Optional scope for the callback function.
     */
    loadFeatures: function(filter, callback, scope) {
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
        if (this.fireEvent("beforequery", this, filter) !== false) {
            this._query = true;
            this.query(filter);
        }
    },
    
    query: function(filter) {
        if (!this.featureStore) {
            this.setFeatureStore(filter, true);
        } else {
            this.featureStore.setOgcFilter(filter);
            this.featureStore.load();
        };
    },
    
    setFeatureStore: function(filter, autoLoad) {
        var source = this.target.getSource(this.selectedLayer);
        source && source instanceof gxp.plugins.WMSSource && source.getSchema(
            this.selectedLayer, function(s) {
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
                            "save": function() {
                                this.selectedLayer.getLayer().redraw(true);
                            },
                            "load": function() {
                                this.fireEvent("query", this, this.featureStore);
                            },
                            scope: this
                        }
                    });
                }
            }, this
        );        
    },
    
    clearFeatureStore: function() {
        this.featureStore = null;
        this.fireEvent("query", this, null);
    }

});

Ext.preg(gxp.plugins.FeatureManager.prototype.ptype, gxp.plugins.FeatureManager);
