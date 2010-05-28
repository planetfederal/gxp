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

        this.loadConfig(config, this.applyConfig);
        gxp.Viewer.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[loadConfig]
     *  :arg config: ``Object`` The config object passed to the constructor.
     *
     *  Subclasses that load config asynchronously can override this to load
     *  any configuration before applyConfig is called.
     */
    loadConfig: function(config) {
        this.applyConfig(config);
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
        var config, queue = [];
        for (var key in this.sources) {
            queue.push(this.createSourceLoader(key));
        }
        
        // create portal when dom is ready
        queue.push(function(done) {
            Ext.onReady(function() {
                this.initPortal();
                done();
            }, this);
        });
        
        gxp.util.dispatch(queue, this.activate, this);
        
    },
    
    createSourceLoader: function(key) {
        return function(done) {
            var config = this.sources[key];
            this.addLayerSource({
                id: key,
                config: config,
                callback: done,
                fallback: function() {
                    // TODO: log these issues somewhere that the app can display
                    // them after loading.
                    // console.log(arguments);
                    done();
                },
                scope: this
            });
        };
    },
    
    addLayerSource: function(options) {
        var id = options.id || OpenLayers.Util.createUniqueID("source");
        var source = Ext.ComponentMgr.createPlugin(
            options.config, this.defaultSourceType
        );
        source.on({
            ready: function() {
                var callback = options.callback || Ext.emptyFn;
                callback.call(this, id);
            },
            failure: function() {
                var fallback = options.fallback || Ext.emptyFn;
                delete this.layerSources[id];
                fallback.apply(this, arguments);
            },
            scope: options.scope || this
        })
        this.layerSources[id] = source;
        source.init(this);
    },
    
    initMapPanel: function() {
        
        var mapConfig = this.initialConfig.map || {};

        this.mapPanel = new GeoExt.MapPanel({
            map: {
                theme: mapConfig.theme || null,
                controls: [
                    new OpenLayers.Control.Navigation({zoomWheelEnabled: false}),
                    new OpenLayers.Control.PanPanel(),
                    new OpenLayers.Control.ZoomPanel(),
                    new OpenLayers.Control.Attribution()
                ],
                projection: mapConfig.projection,
                units: mapConfig.units,
                maxExtent: mapConfig.maxExtent && OpenLayers.Bounds.fromArray(mapConfig.maxExtent),
                maxResolution: mapConfig.maxResolution,
                numZoomLevels: mapConfig.numZoomLevels || 20
            },
            center: mapConfig.center && new OpenLayers.LonLat(mapConfig.center[0], mapConfig.center[1]),
            zoom: mapConfig.zoom,
            items: this.mapItems
        });

    },

    initPortal: function() {
        
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
        // add any layers from config
        this.addLayers();

        // initialize tooltips
        Ext.QuickTips.init();
        
        this.fireEvent("ready");
    },
    
    addLayers: function() {
        var mapConfig = this.initialConfig.map;
        if(mapConfig && mapConfig.layers) {
            var conf, source, record, baseRecords = [], overlayRecords = [];
            for (var i=0; i<mapConfig.layers.length; ++i) {
                conf = mapConfig.layers[i];
                source = this.layerSources[conf.source];
                // source may not have loaded properly (failure handled elsewhere)
                if (source) {
                    record = source.createLayerRecord(conf);
                    if (record) {
                        if (record.get("group") === "background") {
                            baseRecords.push(record);
                        } else {
                            overlayRecords.push(record);
                        }
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
    },

    /** private: method[getState]
     *  :returns: ``Object`` Representation of the app's current state.
     */ 
    getState: function() {

        // start with what was originally given
        var state = Ext.apply({}, this.initialConfig);
        
        // update anything that can change
        var center = this.mapPanel.map.getCenter();
        Ext.apply(state.map, {
            center: [center.lon, center.lat],
            zoom: this.mapPanel.map.zoom,
            layers: []
        });
        
        this.mapPanel.layers.each(function(record){
            var layer = record.get("layer");
            if (layer.displayInLayerSwitcher) {
                var id = record.get("source");
                var source = this.layerSources[id];
                if (!source) {
                    throw new Error("Could not find source for layer '" + record.get("name") + "'");
                }
                // add layer
                state.map.layers.push(source.getConfigForRecord(record));                
            }
        }, this);
        
        return state;
    }
    
});
