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
     */
    autoLoadFeatures: true,
    
    featureLayer: null,
    
    selectedLayer: null,
    
    featureStore: null,
    
    toolsShowingLayer: null,
    
    /** api: method[init]
     */
    init: function(target) {
        gxp.plugins.FeatureEditor.superclass.init.apply(this, arguments);
        
        this.toolsShowingLayer = 0;

        this.featureLayer = new OpenLayers.Layer.Vector(Ext.id(), Ext.apply({
            displayInLayerSwitcher: false,
            visible: false
        }, this.layerConfig));

        this.autoSetLayer && this.target.on("layerselectionchange", this.setLayer, this);
    },
    
    setLayer: function(rec) {
        if (rec !== this.selectedLayer) {
            this.selectedLayer = rec;
            if (this.autoLoadFeatures) {
                if (rec) {
                    this.loadFeatures();
                } else {
                    this.featureStore && this.featureStore.destroy();
                }
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
    
    loadFeatures: function(filter) {
        var source = this.target.getSource(this.selectedLayer);
        source && source instanceof gxp.plugins.WMSSource && source.getSchema(this.selectedLayer, function(s) {
            if (s === false) {
                this.featureStore && this.featureStore.destroy();
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
                    ogcFilter: filter,
                    maxFeatures: this.maxFeatures,
                    layer: this.featureLayer,
                    autoLoad: true,
                    autoSave: false,
                    listeners: {
                        "save": function() {
                            this.selectedLayer.getLayer().redraw(true);
                        },
                        scope: this
                    }
                });
            }
        }, this);        
    }

});

Ext.preg(gxp.plugins.FeatureManager.prototype.ptype, gxp.plugins.FeatureManager);
