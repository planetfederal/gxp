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
        
        this.createMapPanel();
        
        // initialize all layer source plugins
        var config, plugin;
        for (var key in this.sources) {
            config = this.sources[key];
            plugin = Ext.ComponentMgr.createPlugin(config, this.defaultSourceType)
            this.layerSources[key] = plugin.init(this);
        }
        
        // create stores for all services
        var queue = [];
        for (var key in this.layerSource) {
            queue.push(this.createServiceCallback(this.layerSource[key]));
        }
        
        // create portal when dom is ready
        queue.push(function(done) {
            Ext.onReady(function() {
                this.createPortal();
                done();
            }, this);
        })
        
        gxp.util.dispatch(queue, this.activate, this);
        
    },
    
    createServiceCallback: function(service) {
        var serviceType = this.serviceTypes[service.type];
        return function(done) {
            serviceType.createStore(Ext.apply({
                callback: function(store) {
                    service.store = store;
                    done();
                }
            }, service));
        };
    },
    
    createMapPanel: function() {
        
        var mapConfig = this.initialConfig.map || {};

        this.mapPanel = new GeoExt.MapPanel({
            map: {
                theme: null,
                allOverlays: true,
                controls: [
                    new OpenLayers.Control.PanPanel(),
                    new OpenLayers.Control.ZoomPanel()
                ],
                projection: mapConfig.projection,
                units: mapConfig.units,
                maxResolution: mapConfig.maxResolution
            },
            // TODO: update the OpenLayers.Map constructor to accept an initial center
            center: mapConfig.center && new OpenLayers.LonLat(mapConfig.center[0], mapConfig.center[1]),
            // TODO: update the OpenLayers.Map constructor to accept an initial zoom
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
            var projection = mapConfig.projection || "EPSG:4326";
            var records = [];
            
            for (var i=0; i<mapConfig.layers.length; ++i) {
                var conf = mapConfig.layers[i];
                var serviceType = this.serviceType[conf.type];                
                records.push(serviceType.createLayer(conf));
                
                // load wms layers
                
                var index = this.layerSources.find("identifier", conf.wms);
                
                if (index == -1) {
                    continue;
                }
                
                var storeRecord = this.layerSources.getAt(index);
                var store = storeRecord.data.store;

                var id = store.find("name", conf.name);
                
                var record;
                var base;
                if (id >= 0) {
                    /**
                     * If the same layer is added twice, it will get replaced
                     * unless we give each record a unique id.  In addition, we
                     * need to clone the layer so that the map doesn't assume
                     * the layer has already been added.  Finally, we can't
                     * simply set the record layer to the cloned layer because
                     * record.set compares String(value) to determine equality.
                     * 
                     * TODO: suggest record.clone
                     */
                    Ext.data.Record.AUTO_ID++;
                    record = store.getAt(id).copy(Ext.data.Record.AUTO_ID);
                    layer = record.get("layer").clone();
                    record.set("layer", null);
                    record.set("layer", layer);
                    
                    // set layer max extent from capabilities
                    //TODO SRS handling should be done in WMSCapabilitiesReader
                    layer.restrictedExtent = OpenLayers.Bounds.fromArray(record.get("llbbox")).transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection(projection)
                    );
                    
                    if (this.alignToGrid) {
                        layer.maxExtent = new OpenLayers.Bounds(-180, -90, 180, 90).transform(
                            new OpenLayers.Projection("EPSG:4326"),
                            new OpenLayers.Projection(projection)
                        );
                    } else {
                        layer.maxExtent = layer.restrictedExtent;
                    }


                    // set layer visibility from config
                    layer.visibility = ("visibility" in conf) ? conf.visibility : true;
                    
                    // set layer title from config
                    if (conf.title) {
                        /**
                         * Because the layer title data is duplicated, we have
                         * to set it in both places.  After records have been
                         * added to the store, the store handles this
                         * synchronization.
                         */
                        layer.setName(conf.title);
                        record.set("title", conf.title);
                    }

                    record.set("group", conf.group);
                    
                    // set any other layer configuration

                    records.push(record);
                }
            }
            
            // ensures that background layers are on the bottom
            records.sort(function(a, b) {
                var aGroup = a.get("group");
                var bGroup = b.get("group");
                return (aGroup == bGroup) ? 0 : 
                    (aGroup == "background" ? -1 : 1);
            });
            
            this.layers.add(records);

            // set map center
            if(this.mapPanel.center) {
                // zoom does not have to be defined
                this.map.setCenter(this.mapPanel.center, this.mapPanel.zoom);
            } else if (this.mapPanel.extent) {
                this.map.zoomToExtent(this.mapPanel.extent);
            } else {
                this.map.zoomToMaxExtent();
            }
            
        
    }
    
});
