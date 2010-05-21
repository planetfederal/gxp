Ext.namespace("gxp");

gxp.Viewer = Ext.extend(Ext.util.Observable, {
    
    /** private: property[mapPanel]
     *  ``GeoExt.MapPanel``
     */
    
    /** api: config[mapItems]
     *  ``Array(Ext.Component)``
     *  Any items to be added to the map panel.
     */
     
    /** api: config[defaultSourceType]
     *  ``String``
     *  The default layer source plugin type.
     */
     
    /** api: property[portalItems]
     *  ``Array(Ext.Component)``
     *  Items that make up the portal.
     */
     
    /** private: method[constructor]
     *  Construct the viewer.
     */
    constructor: function(config) {

        // add any custom application events
        this.addEvents(
            /** api: event[ready]
             *  Fires when application is ready for user interaction.
             */
            "ready"
        );
        
        Ext.apply(this, {
            layerSources: {},
            portalItems: []
        });

        this.applyConfig(config);
        gxp.Viewer.superclass.constructor.apply(this, arguments);
    },
    
    applyConfig: function(config) {
        this.initialConfig = Ext.apply({}, config);
        Ext.apply(this, this.initialConfig);
        this.load();
    },
    
    load: function() {

        // pass on any proxy config to OpenLayers
        if (this.proxy) {
            OpenLayers.ProxyHost = this.proxy;
        }
        
        this.initMapPanel();
        
        // initialize all layer source plugins
        var queue = [];
        for (var key in this.sources) {
            queue.push(this.createSourceLoader(key));
        }
        
        // create portal when dom is ready
        queue.push(function(done) {
            Ext.onReady(function() {
                this.createPortal();
                done();
            }, this);
        });
        
        gxp.util.dispatch(queue, this.activate, this);
        
    },
    
    createSourceLoader: function(key) {
        return function(done) {
            var config = this.sources[key];
            var source = Ext.ComponentMgr.createPlugin(config, this.defaultSourceType);
            source.on({
                "ready": done
            })
            this.layerSources[key] = source;
            source.init(this);
        };
    },
    
    initMapPanel: function() {
        
        var mapConfig = this.initialConfig.map || {};

        this.mapPanel = new GeoExt.MapPanel({
            map: {
                theme: mapConfig.theme || null,
                controls: [
                    new OpenLayers.Control.Navigation({zoomWheelEnabled: false}),
                    new OpenLayers.Control.PanPanel(),
                    new OpenLayers.Control.ZoomPanel()
                ],
                projection: mapConfig.projection,
                units: mapConfig.units,
                maxResolution: mapConfig.maxResolution,
                numZoomLevels: mapConfig.numZoomLevels || 20
            },
            center: mapConfig.center && new OpenLayers.LonLat(mapConfig.center[0], mapConfig.center[1]),
            zoom: mapConfig.zoom,
            items: this.mapItems
        });

    },

    createPortal: function() {
        
        var config = this.portalConfig || {};
        var Constructor = config.renderTo ? Ext.Panel : Ext.Viewport;
        
        if (this.portalItems.length === 0) {
            this.mapPanel.region = "center";
            this.portalItems.push(this.mapPanel);
        }
        
        this.portal = new Constructor(Ext.applyIf(this.portalConfig || {}, {
            layout: "fit",
            hideBorders: true,
            items: {
                layout: "border",
                deferredRender: false,
                items: this.portalItems
            }
        }));
        
    },
    
    activate: function() {
        this.addLayers();
    },
    
    addLayers: function() {
        var mapConfig = this.initialConfig.map;
        if(mapConfig && mapConfig.layers) {
            var conf, source, record, baseRecords = [], overlayRecords = [];
            for (var i=0; i<mapConfig.layers.length; ++i) {
                conf = mapConfig.layers[i];
                source = this.layerSources[conf.source];
                // TODO: deal with required record fields (e.g. "group")                 
                record = source.createLayerRecord(conf);
                if (record) {
                    if (record.get("group") === "background") {
                        baseRecords.push(record);
                    } else {
                        overlayRecords.push(record);
                    }
                }
            }
            
            var panel = this.mapPanel;
            var map = panel.map;
            
            var records = baseRecords.concat(overlayRecords);
            if (records.length) {
                panel.layers.add(records);

                // set map center
                if(panel.center) {
                    // zoom does not have to be defined
                    map.setCenter(panel.center, panel.zoom);
                } else if (panel.extent) {
                    map.zoomToExtent(panel.extent);
                } else {
                    map.zoomToMaxExtent();
                }
            }
            
        }        
    }
    
});
