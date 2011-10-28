/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires menu/TimelineMenu.js
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

    /** api: config[playbackTool]
     *  ``gxp.plugins.Playback``
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
    
    /** private: property[layerLookup]
     *  ``Object``
     *  Mapping of store/layer names (e.g. "local/foo") to objects storing data
     *  related to layers.  The values of each member are objects with the 
     *  following properties:
     *
     *   * layer - {OpenLayers.Layer.Vector}
     *   * titleAttr - {String}
     *   * timeAttr - {String}
     *  
     */
    
    /** private: property[clearOnLoad]
     *  ``Boolean``
     *  Indicates that timeline events should be cleared before new features are
     *  added.
     */

    /** private: property[currentRange]
     *  ``Array`` The current range used in the WFS time filter
     */

    /**
     * api: config[maxFeatures]
     * ``Integer``
     * The maximum number of features on a per layer basis. Defaults to 100.
     */
    maxFeatures: 100,

    /**
     * api: config[bufferFraction]
     * ``Float``
     * The fraction to take around on both sides of a time filter. Defaults to 0.1.
     */
    bufferFraction: 0.1,

    layout: "border",

    /** i18n */
    layersText: "Layers",
    notesText: "Notes",
    
    /** private: method[initComponent]
     */
    initComponent: function() {

        Timeline.OriginalEventPainter.prototype._showBubble = 
            this.handleEventClick.createDelegate(this);

        this.timelineContainer = new Ext.Container({
            region: "center"
        });

        var me = this;
        this.tbar = [{
            text: this.layersText,
            iconCls: "gxp-icon-layer-switcher",
            menu: new gxp.menu.TimelineMenu({
                layers: this.viewer.mapPanel.layers,
                property: 'timevisible',
                onCheckChange: function(item, checked, record) {
                    record.set('timevisible', checked);
                    var filterMatcher = function(evt) {
                        var key = evt.getProperty('key');
                        if (key === me.getKey(record)) {
                            return checked;
                        }
                    };
                    me.timeline.getBand(0).getEventPainter().setFilterMatcher(filterMatcher);
                    me.timeline.paint();
                }
            })
        }, {
            text: this.notesText,
            iconCls: "gxp-icon-note"
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
                value: 25,
                listeners: {
                    "changecomplete": function(slider, value) {
                        // TODO consider whether or not it makes sense to use OpenLayers.Strategy.Filter
                        var range = this.playbackTool.playbackToolbar.control.range;
                        range = this.calculateNewRange(range, value);
                        for (var key in this.layerLookup) {
                            var layer = this.layerLookup[key].layer;
                            layer.filter = this.createTimeFilter(range, key, 0);
                        }
                        this.updateTimelineEvents({maxFeatures: this.maxFeatures});
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

        if (this.initialConfig.playbackTool) {
            delete this.playbackTool;
            this.bindPlaybackTool(this.initialConfig.playbackTool);
        }

        gxp.TimelinePanel.superclass.initComponent.call(this);
        
    },

    handleEventClick: function(x, y, evt) {
        var fid = evt.getProperty("fid");
        var key = evt.getProperty("key");
        var layer = this.layerLookup[key].layer;
        var feature = layer.getFeatureByFid(fid);
        var centroid = feature.geometry.getCentroid();
        var map = this.viewer.mapPanel.map;
        map.setCenter(new OpenLayers.LonLat(centroid.x, centroid.y));
    },

    bindPlaybackTool: function(playbackTool) {
        this.playbackTool = playbackTool;
        this.playbackTool.on("timechange", this.onTimeChange, this);
        this.playbackTool.on("rangemodified", this.onRangeModify, this);
    },

    /**
     * private: method[onTimeChange]
     *  :arg toolbar: ``gxp.plugin.PlaybackToolbar``
     *  :arg currentTime: ``Date``
     */
    onTimeChange: function(toolbar, currentTime) {
        this.setCenterDate(currentTime);
    },

    /** private: method[onRangeModify]
     *  :arg toolbar: ``gxp.plugin.PlaybackToolbar``
     *  :arg range: ``Array(Date)``
     */
    onRangeModify: function(toolbar, range) {
        this.setRange(range);
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
        // since the bands are linked we need to listen to one band only
        this.timeline.getBand(0).addOnScrollListener(
            this.setPlaybackCenter.createDelegate(this)
        );
        this.eventSource = eventSource;
        
    },

    setPlaybackCenter: function(band) {
        this.playbackTool && this.playbackTool.setTime(band.getCenterVisibleDate());
    },
    
    /** private: method[bindViewer]
     */
    bindViewer: function(viewer) {
        if (this.viewer) {
            this.unbindViewer();
        }
        this.viewer = viewer;
        this.layerLookup = {};
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
        delete this.layerLookup;
    },

    /** private: method[getKey]
     */
    getKey: function(record) {
        return record.get("source") + "/" + record.get("name");
    },

    /** private: method[getTimeAttribute]
     */
    getTimeAttribute: function(record, protocol, schema) {
        var key = this.getKey(record);
        Ext.Ajax.request({
            method: "GET",
            url: "/maps/time_info.json?",
            params: {layer: record.get('name')},
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result && result.attribute) {
                    this.layerLookup[key] = {
                        timeAttr: result.attribute
                    };
                    this.addVectorLayer(record, protocol, schema);
                }
            },
            scope: this
        });
    },

    /** private: method[onLayerStoreAdd]
     */
    onLayerStoreAdd: function(store, records) {
        var record;
        for (var i=0, ii=records.length; i<ii; ++i) {
            record = records[i];
            var layer = record.getLayer();
            if (layer.dimensions && layer.dimensions.time) {
                var source = this.viewer.getSource(record);
                if (gxp.plugins.WMSSource && (source instanceof gxp.plugins.WMSSource)) {
                    source.getWFSProtocol(record, function(protocol, schema, record) {
                        if (!protocol) {
                            // TODO: add logging to viewer
                            throw new Error("Failed to get protocol for record: " + record.get("name"));
                        }
                        record.set('timevisible', true);
                        this.getTimeAttribute(record, protocol, schema);
                    }, this);
                }
            }
        }
    },

    setRange: function(range) {
        var firstBand = this.timeline.getBand(0);
        firstBand.setMinVisibleDate(range[0]);
        firstBand.setMaxVisibleDate(range[1]);
        var secondBand = this.timeline.getBand(1);
        secondBand.getEtherPainter().setHighlight(range[0], range[1]);
    },

    setCenterDate: function(time) {
        this.timeline.getBand(0).setCenterVisibleDate(time);
        // check if time is outside of current range, if so request new data
        if (this.currentRange) {
            if (time < this.currentRange[0] || time > this.currentRange[1]) {
                var span = this.currentRange[1] - this.currentRange[0];
                var start = new Date(time.getTime() - span/2);
                var end = new Date(time.getTime() + span/2);
                for (var key in this.layerLookup) {
                    var layer = this.layerLookup[key].layer; 
                    layer.filter = this.createTimeFilter([start, end], key, 0);
                }
                this.updateTimelineEvents({maxFeatures: this.maxFeatures});                
            }
        }
    },

    calculateNewRange: function(range, percentage) {
        if (percentage === undefined) {
            percentage = this.rangeSlider.getValue();
        }
        var end = new Date(range[0].getTime() + ((percentage/100) * (range[1] - range[0])));
        return [range[0], end];
    },

    createTimeFilter: function(range, key, fraction) {
        var start = new Date(range[0].getTime() - fraction * (range[1] - range[0]));
        var end = new Date(range[1].getTime() + fraction * (range[1] - range[0]));
        this.currentRange = [start, end];
        return new OpenLayers.Filter({
            type: OpenLayers.Filter.Comparison.BETWEEN,
            property: this.layerLookup[key].timeAttr,
            lowerBoundary: OpenLayers.Date.toISOString(start),
            upperBoundary: OpenLayers.Date.toISOString(end)
        });
    },
    
    /** private: method[addVectorLayer]
     */
    addVectorLayer: function(record, protocol, schema) {
        var key = this.getKey(record);
        var filter = null;
        if (this.playbackTool) {
            // TODO consider putting an api method getRange on playback tool
            var range = this.playbackTool.playbackToolbar.control.range;
            range = this.calculateNewRange(range);
            this.setCenterDate(this.playbackTool.playbackToolbar.control.currentTime);
            // create a PropertyIsBetween filter
            filter = this.createTimeFilter(range, key, this.bufferFraction);
        }
        var layer = new OpenLayers.Layer.Vector(key, {
            strategies: [new OpenLayers.Strategy.BBOX({
                ratio: 1.1,
                resFactor: 1,
                autoActivate: false
            })],
            filter: filter,
            protocol: protocol,
            displayInLayerSwitcher: false,
            visibility: false
        });
        layer.events.on({
            featuresadded: this.onFeaturesAdded.createDelegate(this, [key], 1),
            featuresremoved: this.onFeaturesRemoved,
            scope: this
        });

        // find the first string field for display
        var titleAttr = null;
        schema.each(function(record) {
            if (record.get("type") === "xsd:string") {
                titleAttr = record.get("name");
                return false;
            }
        });
        Ext.apply(this.layerLookup[key], {
            layer: layer,
            titleAttr: titleAttr
        });
        this.viewer.mapPanel.map.addLayer(layer);
    },

    /** private: method[onMapMoveEnd]
     *  Registered as a listener for map moveend.
     */
    onMapMoveEnd: function() {
        this.updateTimelineEvents({maxFeatures: this.maxFeatures});
    },
    
    /** private: method[updateTimelineEvents]
     *  :arg options: `Object` First arg to OpenLayers.Strategy.BBOX::update.
     */
    updateTimelineEvents: function(options) {
        // Loading will be triggered for all layers or no layers.  If loading
        // is triggered, we want to remove existing events before adding any
        // new ones.  With this flag set, events will be cleared before features
        // are added to the first layer.  After clearing events, this flag will
        // be reset so events are not cleared as features are added to 
        // subsequent layers.
        this.clearOnLoad = true;
        var layer;
        for (var key in this.layerLookup) {
            layer = this.layerLookup[key].layer;
            layer.strategies[0].update(options);
        }
    },

    onFeaturesRemoved: function(event) {
        // clean up
        for (var i=0, len=event.features.length; i<len; i++) {
            event.features[i].destroy();
        }
    },
    
    onFeaturesAdded: function(event, key) {
        if (this.clearOnLoad) {
            this.eventSource.clear();
            this.clearOnLoad = false;
        }
        var features = event.features;
        var num = features.length;
        var events = new Array(num);
        var attributes, str;
        var titleAttr = this.layerLookup[key].titleAttr;
        var timeAttr = this.layerLookup[key].timeAttr;
        for (var i=0; i<num; ++i) {
            attributes = features[i].attributes;
            events[i] = {
                start: OpenLayers.Date.parse(attributes[timeAttr]),
                title: attributes[titleAttr],
                durationEvent: false,
                key: key,
                fid: features[i].fid
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
