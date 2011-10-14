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

    /** i18n */
    layersText: "Layers",
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        
        this.timelineContainer = new Ext.Container({
            region: "center"
        });

        this.tbar = [{
            text: this.layersText,
            iconCls: "gxp-icon-layer-switcher"
        }];
        
        this.items = [{
            region: "west",
            xtype: "container",
            margins: "10 5",
            width: 20,
            items: [{
                xtype: "slider",
                ref: "../rangeSlider",
                vertical: true,
                listeners: {
                    "changecomplete": function(slider, value) {
                        var src = this.eventSource;
                        if (src.getLatestDate() !== null && src.getEarliestDate() !== null) {
                            var range = src.getLatestDate() - src.getEarliestDate();
                            var center = new Date(src.getEarliestDate().getTime() + range/2);
                            var newRange = ((100-value)/100)*range;
                            var newBegin = new Date(center.getTime() - newRange/2);
                            var newEnd = new Date(center.getTime() + newRange/2);
                            for (var i = 0; i < this.timeline.getBandCount(); i++) {
                                var filterMatcher = function(evt) {
                                    var start = evt.getStart();
                                    return (start >= newBegin && start <= newEnd);
                                };
                                this.timeline.getBand(i).getEventPainter().setFilterMatcher(filterMatcher);
                            }
                            this.timeline.paint();
                        } else {
                            slider.setValue(0);
                        }
                    },
                    scope: this
                },
                height: 175
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

        var d = Timeline.DateTime.parseGregorianDateTime("1978");
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
                source.getWFSProtocol(record, function(protocol, schema) {
                    if (!protocol) {
                        // TODO: add logging to viewer
                        throw new Error("Failed to get protocol for record: " + record.get("name"));
                    }
                    this.addVectorLayer(record, protocol, schema);
                }, this);
            }
        }
    },
    
    /** private: method[addVectorLayer]
     */
    addVectorLayer: function(record, protocol, schema) {
        var key = record.get("source") + "/" + record.get("name");
        var layer = new OpenLayers.Layer.Vector(key, {
            strategies: [new OpenLayers.Strategy.BBOX({
                ratio: 1.1,
                resFactor: 1,
                autoActivate: false
            })],
            protocol: protocol,
            displayInLayerSwitcher: false,
            visibility: false
        });
        layer.events.on({
            featuresadded: this.onFeaturesAdded.createDelegate(this, [schema], 1),
            loadstart: this.onLoadStart,
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
        this.rangeSlider.setValue(0);
    },
    
    /** private: method[onLoadStart]
     *  Registered as a listener for layer loadstart.
     */
    onLoadStart: function() {
        // TODO: we should not be clearing once for each layer here
        this.eventSource.clear();
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
    
    onFeaturesAdded: function(event, schema) {
        // find the first string field for display
        var field = null;
        schema.each(function(record) {
            if (record.get('type') === 'xsd:string') {
                field = record.get('name');
                return false;
            }
        });
        var features = event.features;
        var num = features.length;
        var events = new Array(num);
        var attributes, str;
        for (var i=0; i<num; ++i) {
            attributes = features[i].attributes;
            events[i] = {
                start: OpenLayers.Date.parse(attributes["startdate2"]),
                title: attributes[field],
                durationEvent: false
            };
        }
        var feed = {
            dateTimeFormat: "javascriptnative", //"iso8601",
            events: events
        };
        this.eventSource.loadJSON(feed, "http://mapstory.org/");
    }
    
});

/** api: xtype = gxp_timelinepanel */
Ext.reg("gxp_timelinepanel", gxp.TimelinePanel);
