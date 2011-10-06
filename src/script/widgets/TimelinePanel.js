/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = TimelinePanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: TimelinePanel(config)
 *   
 *      A panel for displaying a Similie Timeline.
 */
gxp.TimelinePanel = Ext.extend(Ext.Panel, {
    
    /** api: config[viewer]
     *  ``gxp.Viewer``
     */

    /** private: property[timeline]
     *  ``Timeline``
     */
    
    /** private: property[timelineContainer]
     *  ``Ext.Container``
     */
    
    /** private: property[eventSource]
     *  ``Object``
     *  Timeline event source.
     */
    
    /** private: property[vectorLayers]
     *  ``Object``
     *  Object mapping store/layer names to vector layers.
     */
    
    layout: "border",
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        
        this.timelineContainer = new Ext.Container({
            region: "center"
        });
        
        this.items = [{
            region: "west",
            xtype: "container",
            margins: "10 5",
            width: 20,
            items: [{
                xtype: "slider",
                vertical: true,
                height: 200
            }]
        }, this.timelineContainer
        ];

        this.addEvents(
            /**
             * Event: change
             * Fires when time changes.
             *
             * Listener arguments:
             * panel - {<gxp.TimesliderPanel} This panel.
             */
            "change"
        );
        
        if (this.initialConfig.viewer) {
            delete this.viewer;
            this.bindViewer(this.initialConfig.viewer);
        }

        gxp.TimelinePanel.superclass.initComponent.call(this);
        
    },

    /** private: method[onLayout]
     *  Private method called after the panel has been rendered.
     */
    onLayout: function() {
        gxp.TimelinePanel.superclass.onLayout.apply(this, arguments);

        var eventSource = new Timeline.DefaultEventSource(0);

        var theme = Timeline.ClassicTheme.create();

        var d = Timeline.DateTime.parseGregorianDateTime("1978")
        var bandInfos = [
            Timeline.createBandInfo({
                width: "80%", 
                intervalUnit: Timeline.DateTime.DECADE, 
                intervalPixels: 200,
                eventSource: eventSource,
                date: d,
                theme: theme,
                layout: "original"
            }),
            Timeline.createBandInfo({
                width: "20%", 
                intervalUnit: Timeline.DateTime.CENTURY, 
                intervalPixels: 200,
                eventSource: eventSource,
                date: d,
                theme: theme,
                layout: "overview"
            })
        ];
        bandInfos[1].syncWith = 0;
        bandInfos[1].highlight = true;

        this.timeline = Timeline.create(
            this.timelineContainer.el.dom, 
            bandInfos, 
            Timeline.HORIZONTAL
        );
        this.eventSource = eventSource;
        
    },
    
    /** private: method[bindViewer]
     */
    bindViewer: function(viewer) {
        if (this.viewer) {
            this.unbindViewer();
        }
        this.viewer = viewer;
        this.vectorLayers = {};
        var layerStore = viewer.mapPanel.layers;
        if (layerStore.getCount() > 0) {
            this.onLayerStoreAdd(layerStore, layerStore.getRange());
        }
        layerStore.on({
            add: this.onLayerStoreAdd,
            scope: this
        });
        viewer.mapPanel.map.events.on({
            moveend: this.onMapMoveEnd,
            scope: this
        });

    },
    
    /** private: method[unbindViewer]
     */
    unbindViewer: function() {
        var mapPanel = this.viewer.mapPanel;
        if (mapPanel) {
            mapPanel.layers.unregister("add", this.onLayerStoreAdd, this);
            mapPanel.map.un({
                moveend: this.onMapMoveEnd,
                scope: this
            });
        }
        delete this.viewer;
        delete this.vectorLayers;
    },
    
    /** private: method[onLayerStoreAdd]
     */
    onLayerStoreAdd: function(store, records) {
        var record;
        for (var i=0, ii=records.length; i<ii; ++i) {
            record = records[i];
            var source = this.viewer.getSource(record);
            if (gxp.plugins.WMSSource && (source instanceof gxp.plugins.WMSSource)) {
                source.getWFSProtocol(record, function(protocol) {
                    if (!protocol) {
                        // TODO: add logging to viewer
                        throw new Error("Failed to get protocol for record: " + record.get("name"));
                    }
                    this.addVectorLayer(record, protocol);
                }, this);
            }
        }
    },
    
    /** private: method[addVectorLayer]
     */
    addVectorLayer: function(record, protocol) {
        var key = record.get("source") + "/" + record.get("name");
        var layer = new OpenLayers.Layer.Vector(key, {
            strategies: [new OpenLayers.Strategy.BBOX({
                ratio: 1.5,
                resFactor: 1,
                autoActivate: false
            })],
            protocol: protocol,
            displayInLayerSwitcher: false,
            visibility: false,
        });
        layer.events.on({
            featuresadded: this.onFeaturesAdded,
            scope: this
        });
        this.vectorLayers[key] = layer;
        this.viewer.mapPanel.map.addLayer(layer);
    },

    /** private: method[onMapMoveEnd]
     *  Registered as a listener for map moveend.
     */
    onMapMoveEnd: function() {
        this.updateTimelineEvents();
    },
    
    /** private: method[updateTimelineEvents]
     *  :arg options: `Object` First arg to OpenLayers.Strategy.BBOX::update.
     */
    updateTimelineEvents: function(options) {
        // TODO: keep track of pending updates
        for (var key in this.vectorLayers) {
            this.vectorLayers[key].strategies[0].update(options);
        }
    },
    
    onFeaturesAdded: function(event) {
        var features = event.features;
        var num = features.length;
        var events = new Array(num);
        var attributes;
        for (var i=0; i<num; ++i) {
            attributes = features[i].attributes;
            events[i] = {
                start: attributes["StartDate2"],
                title: attributes["SideA"] + " v. " + attributes["SideB"],
                durationEvent: false
            };
        }
        var feed = {
            dateTimeFormat: "iso8601",
            events: events
        };
        this.eventSource.loadJSON(feed, "http://mapstory.org/");
    }
    
});

/** api: xtype = gxp_timelinepanel */
Ext.reg("gxp_timelinepanel", gxp.TimelinePanel);
