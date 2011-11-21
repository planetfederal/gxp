/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires widgets/FeatureEditPopup.js
 */

/** api: (define)
 *  module = gxp
 *  class = TimelinePanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

// http://code.google.com/p/simile-widgets/issues/detail?id=3
(function() {
    Timeline.DefaultEventSource.prototype.remove = function(id) {
        this._events.remove(id);
    };
    SimileAjax.EventIndex.prototype.remove = function(id) {
        var evt = this._idToEvent[id];
        this._events.remove(evt);
        delete this._idToEvent[id];
    };
})();

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

    /** api: config[loadingMessage]
     *  ``String`` Message to show when the timeline is loading (i18n)
     */
    loadingMessage: "Loading Timeline data...",

    /** api: config[instructionText]
     *  ``String`` Message to show when there is too many data for the timeline (i18n)
     */   
    instructionText: "There are too many events to show in the timeline, please zoom in or move the vertical slider down",

    /** private: property[layerCount]
     * ``Integer`` The number of vector layers currently loading.
     */
    layerCount: 0,

    /**
     * private: property[busyMask]
     * ``Ext.LoadMask`` The Ext load mask to show when busy.
     */
    busyMask: null,

    /** api: property[schemaCache]
     *  ``Object`` An object that contains the attribute stores.
     */
    schemaCache: {},

    /** api: property[layerLookup]
     *  ``Object``
     *  Mapping of store/layer names (e.g. "local/foo") to objects storing data
     *  related to layers.  The values of each member are objects with the 
     *  following properties:
     *
     *   * layer - {OpenLayers.Layer.Vector}
     *   * titleAttr - {String}
     *   * timeAttr - {String}
     *   * visible - {Boolean}
     *  
     */
    
    /** private: property[rangeInfo]
     *  ``Object`` An object with 2 properties: current and original.
     *  Current contains the original range with a fraction on both sides.
     */

    /**
     * api: config[maxFeatures]
     * ``Integer``
     * The maximum number of features in total for the timeline.
     */
    maxFeatures: 500,

    /**
     * api: config[bufferFraction]
     * ``Float``
     * The fraction to take around on both sides of a time filter. Defaults to 0.5.
     */
    bufferFraction: 0.5,

    layout: "border",

    /** private: method[initComponent]
     */
    initComponent: function() {

        Timeline.OriginalEventPainter.prototype._showBubble = 
            this.handleEventClick.createDelegate(this);

        this.timelineContainer = new Ext.Container({
            region: "center"
        });

        this.eventSource = new Timeline.DefaultEventSource(0);

        this.items = [{
            region: "west",
            xtype: "container",
            layout: "fit",
            margins: "10 5",
            width: 20,
            items: [{
                xtype: "slider",
                ref: "../rangeSlider",
                vertical: true,
                value: 25,
                listeners: {
                    "changecomplete": this.onChangeComplete,
                    scope: this
                }
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

        if (this.initialConfig.featureManager) {
            delete this.featureManager;
            this.bindFeatureManager(this.initialConfig.featureManager);
        }

        if (this.initialConfig.playbackTool) {
            delete this.playbackTool;
            this.bindPlaybackTool(this.initialConfig.playbackTool);
        }

        gxp.TimelinePanel.superclass.initComponent.call(this);
        
    },

    onChangeComplete: function(slider, value) {
        if (this.playbackTool) {
            var range = this.playbackTool.playbackToolbar.control.range;
            range = this.calculateNewRange(range, value);
            for (var key in this.layerLookup) {
                var layer = this.layerLookup[key].layer;
                layer && this.setFilter(key, this.createTimeFilter(range, key, 0));
            }
            this.updateTimelineEvents({force: true});
        }
    },

    setLayerVisibility: function(item, checked, record) {
        var keyToMatch = this.getKey(record);
        Ext.apply(this.layerLookup[keyToMatch], {
            visible: checked
        });
        var filterMatcher = function(evt) {
            var key = evt.getProperty('key');
            if (key === keyToMatch) {
                return checked;
            }
        };
        this.timeline.getBand(0).getEventPainter().setFilterMatcher(filterMatcher);
        this.timeline.getBand(1).getEventPainter().setFilterMatcher(filterMatcher);
        this.timeline.paint();
    },

    applyFilter: function(record, filter, checked) {
        // implemented client-side for now, TODO determine if server-side makes more sense, i.e.
        // passing on the filter in the GetFeature request and doing a reload.
        var key = this.getKey(record);
        var layer = this.layerLookup[key].layer;
        var filterMatcher = function(evt) {
            var fid = evt.getProperty("fid");
            if (evt.getProperty("key") === key) {
                var feature = layer.getFeatureByFid(fid);
                if (checked === false) {
                    return true;
                } else {
                    return filter.evaluate(feature);
                }
            } else {
                return true;
            }
        };
        this.timeline.getBand(0).getEventPainter().setFilterMatcher(filterMatcher);
        this.timeline.getBand(1).getEventPainter().setFilterMatcher(filterMatcher);
        this.timeline.paint();
    },

    setTitleAttribute: function(record, titleAttr) {
        var key = this.getKey(record);
        this.layerLookup[key].titleAttr = titleAttr;
        this.clearEventsForKey(key);
        this.onFeaturesAdded({features: this.layerLookup[key].layer.features}, key);
    },

    handleEventClick: function(x, y, evt) {
        var fid = evt.getProperty("fid");
        var key = evt.getProperty("key");
        var layer = this.layerLookup[key].layer;
        var feature = layer && layer.getFeatureByFid(fid);
        if (feature) {
            var centroid = feature.geometry.getCentroid();
            var map = this.viewer.mapPanel.map;
            this._silentMapMove = true;
            map.setCenter(new OpenLayers.LonLat(centroid.x, centroid.y));
            delete this._silentMapMove;
            if (this.popup) {
                this.popup.destroy();
                this.popup = null;
            }
            this.popup = new gxp.FeatureEditPopup({
                feature: feature,
                propertyGridNameText: "Attributes",
                title: evt.getProperty("title"),
                panIn: false,
                width: 200,
                height: 250,
                collapsible: true,
                readOnly: true,
                hideMode: 'offsets'
            });
            this.popup.show();
        }
    },

    bindFeatureManager: function(featureManager) {
        this.featureManager = featureManager;
        this.featureManager.on("layerchange", this.onLayerChange, this);
    },

    onLayerChange: function(tool, record, schema) {
        var key = this.getKey(record);
        // TODO remove hard-coded attributes
        this.layerLookup[key] = {
            layer: null,
            titleAttr: 'title',
            timeAttr: 'timestamp',
            visible: true
        };
        if (this.featureManager.featureStore) {
            this.featureManager.featureStore.on("write", this.onSave.createDelegate(this, [key], 3), this);
        }
    },

    onSave: function(store, action, data, key) {
        if (!this.rendered) {
            return;
        }
        var features = [];
        for (var i=0, ii=data.length; i<ii; i++) {
            var feature = data[i].feature;
            features.push(feature);
        }
        this.addFeatures(key, features);
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
        this._silent = true;
        this.setCenterDate(currentTime);
        delete this._silent;
    },

    /** private: method[onRangeModify]
     *  :arg toolbar: ``gxp.plugin.PlaybackToolbar``
     *  :arg range: ``Array(Date)``
     */
    onRangeModify: function(toolbar, range) {
        this._silent = true;
        this.setRange(range);
        delete this._silent;
    },

    /** private: method[createTimeline]
     */
    createTimeline: function(range) {
        if (!this.rendered) {
            return;
        }
        var theme = Timeline.ClassicTheme.create();

        var span = range[1] - range[0];
        var years  = ((((span/1000)/60)/60)/24)/365;
        var intervalUnits = [];
        if (years >= 50) {
            intervalUnits.push(Timeline.DateTime.DECADE);
            intervalUnits.push(Timeline.DateTime.CENTURY);
        } else {
            intervalUnits.push(Timeline.DateTime.YEAR);
            intervalUnits.push(Timeline.DateTime.DECADE);
        }
        var d = new Date(range[0].getTime() + span/2);
        var bandInfos = [
            Timeline.createBandInfo({
                width: "80%", 
                intervalUnit: intervalUnits[0], 
                intervalPixels: 200,
                eventSource: this.eventSource,
                date: d,
                theme: theme,
                layout: "original"
            }),
            Timeline.createBandInfo({
                width: "20%", 
                intervalUnit: intervalUnits[1], 
                intervalPixels: 200,
                eventSource: this.eventSource,
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
        this._silent = true;
        this.timeline.getBand(0).addOnScrollListener(
            this.setPlaybackCenter.createDelegate(this)
        );
        
    },

    setPlaybackCenter: function(band) {
        var time = band.getCenterVisibleDate();
        this._silent !== true && this.playbackTool && this.playbackTool.setTime(time);
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
        delete this.schemaCache;
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
                        timeAttr: result.attribute,
                        visible: true
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
                        this.schemaCache[this.getKey(record)] = schema;
                        this.getTimeAttribute(record, protocol, schema);
                    }, this);
                }
            }
        }
    },

    onLayout: function() {
        gxp.TimelinePanel.superclass.onLayout.call(this, arguments);
        if (!this.timeline) {
            if (this.playbackTool && this.playbackTool.playbackToolbar) {
                this.setRange(this.playbackTool.playbackToolbar.control.range);
                this.setCenterDate(this.playbackTool.playbackToolbar.control.currentTime);
                delete this._silent;
            }
        }
    },

    setRange: function(range) {
        if (!this.timeline) {
            this.createTimeline(range);
        }
        // if we were not rendered, the above will not have created the timeline
        if (this.timeline) {
            var firstBand = this.timeline.getBand(0);
            firstBand.setMinVisibleDate(range[0]);
            firstBand.setMaxVisibleDate(range[1]);
            var secondBand = this.timeline.getBand(1);
            secondBand.getEtherPainter().setHighlight(range[0], range[1]);
        }
    },

    setCenterDate: function(time) {
        if (this.timeline) {
            this.timeline.getBand(0).setCenterVisibleDate(time);
            if (this.rangeInfo && this.rangeInfo.current) {
                var currentRange = this.rangeInfo.current;
                var originalRange = this.rangeInfo.original;
                var originalSpan = originalRange[1] - originalRange[0];
                var originalCenter = new Date(originalRange[0].getTime() + originalSpan/2);
                var fractionRange = this.bufferFraction * originalSpan;
                var lowerBound = new Date(originalCenter.getTime() - fractionRange);
                var upperBound = new Date(originalCenter.getTime() + fractionRange);
                // update once the time gets out of the buffered center
                if (time < lowerBound || time > upperBound) {
                    var span = currentRange[1] - currentRange[0];
                    var start = new Date(time.getTime() - span/2);
                    var end = new Date(time.getTime() + span/2);
                    for (var key in this.layerLookup) {
                        var layer = this.layerLookup[key].layer;
                        layer && this.setFilter(key, this.createTimeFilter([start, end], key, 0));
                    }
                    // TODO: instead of a full update, only get the data we are missing and
                    // remove events from the timeline that are out of the new range
                    this.updateTimelineEvents({force: true});                
                }
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
        this.rangeInfo = {
            original: range,
            current: [start, end]
        };
        return new OpenLayers.Filter({
            type: OpenLayers.Filter.Comparison.BETWEEN,
            property: this.layerLookup[key].timeAttr,
            lowerBoundary: OpenLayers.Date.toISOString(start),
            upperBoundary: OpenLayers.Date.toISOString(end)
        });
    },

    onLoadStart: function() {
        this.layerCount++;
        if (!this.busyMask) {
            this.busyMask = new Ext.LoadMask(this.bwrap, {msg: this.loadingMessage});
        }
        this.busyMask.show();
    },

    onLoadEnd: function() {
        this.layerCount--;
        if(this.layerCount === 0) {
            this.busyMask.hide();
        }
    },

    /** private: method[createHitCountProtocol]
     */
    createHitCountProtocol: function(protocolOptions) {
        return new OpenLayers.Protocol.WFS(Ext.apply({
            version: "1.1.0",
            readOptions: {output: "object"},
            resultType: "hits"
        }, protocolOptions));
    },

    /** private: method[setFilter]
     */
    setFilter: function(key, filter) {
        var layer = this.layerLookup[key].layer;
        layer.filter = filter;
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
                ratio: 1.5,
                autoActivate: false
            })],
            filter: filter,
            protocol: protocol,
            displayInLayerSwitcher: false,
            visibility: false
        });
        layer.events.on({
            loadstart: this.onLoadStart,
            loadend: this.onLoadEnd,
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
            titleAttr: titleAttr,
            hitCount: this.createHitCountProtocol(protocol.options)
        });
        this.viewer.mapPanel.map.addLayer(layer);
    },

    /** private: method[onMapMoveEnd]
     *  Registered as a listener for map moveend.
     */
    onMapMoveEnd: function() {
        this._silentMapMove !== true && this.updateTimelineEvents();
    },
    
    /** private: method[updateTimelineEvents]
     *  :arg options: `Object` First arg to OpenLayers.Strategy.BBOX::update.
     */
    updateTimelineEvents: function(options) {
        if (!this.rendered) {
            return;
        }
        var dispatchQueue = [];
        var layer, key;
        for (key in this.layerLookup) {
            layer = this.layerLookup[key].layer;
            if (layer && layer.strategies !== null) {
                var protocol = this.layerLookup[key].hitCount;

                // a real solution would be something like:
                // http://trac.osgeo.org/openlayers/ticket/3569
                var bounds = layer.strategies[0].bounds;
                layer.strategies[0].calculateBounds();
                var filter = new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.BBOX,
                    value: layer.strategies[0].bounds,
                    projection: layer.projection
                });
                layer.strategies[0].bounds = bounds;
            
                if (layer.filter) {
                    filter = new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.AND,
                        filters: [layer.filter, filter]
                    });
                }
                // end of TODO
                protocol.filter = protocol.options.filter = filter;
                var func = function(done, storage) {
                    this.read({
                        callback: function(response) {
                            if (storage.numberOfFeatures === undefined) {
                                storage.numberOfFeatures = 0;
                            }
                            storage.numberOfFeatures += response.numberOfFeatures;
                            done();
                        }
                    });
                };
                dispatchQueue.push(func.createDelegate(protocol));
            }
        }
        gxp.util.dispatch(dispatchQueue, function(storage) {
            if (storage.numberOfFeatures <= this.maxFeatures) {
                this.timelineContainer.el.unmask(true);
                for (key in this.layerLookup) {
                    layer = this.layerLookup[key].layer;
                    if (layer && layer.strategies !== null) {
                        this.clearEventsForKey(key);
                        layer.strategies[0].activate();
                        layer.strategies[0].update(options);
                    }
                }
            } else {
                // clear the timeline and show instruction text
                for (key in this.layerLookup) {
                    layer = this.layerLookup[key].layer;
                    if (layer && layer.strategies !== null) {
                        layer.strategies[0].deactivate();
                    }
                }
                this.timelineContainer.el.mask(this.instructionText, '');
                this.eventSource.clear();
            }
        }, this);
    },

    clearEventsForKey: function(key) {
        var iterator = this.eventSource.getAllEventIterator();
        var eventIds = [];
        while (iterator.hasNext()) {
            var evt = iterator.next();
            if (evt.getProperty('key') === key) {
                eventIds.push(evt.getID());
            }
        }
        for (var i=0, len=eventIds.length; i<len; ++i) {
            this.eventSource.remove(eventIds[i]);
        }
    },

    onFeaturesRemoved: function(event) {
        // clean up
        for (var i=0, len=event.features.length; i<len; i++) {
            event.features[i].destroy();
        }
    },

    addFeatures: function(key, features) {
        var titleAttr = this.layerLookup[key].titleAttr;
        var timeAttr = this.layerLookup[key].timeAttr;
        var num = features.length;
        var events = new Array(num);
        var attributes, str;
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
    },

    onFeaturesAdded: function(event, key) {
        var features = event.features;
        this.addFeatures(key, features);
    },

    /** private: method[onResize]
     *  Private method called after the panel has been resized.
     */
    onResize: function() {
        gxp.TimelinePanel.superclass.onResize.apply(this, arguments);
        this.timeline && this.timeline.layout();
    },

    beforeDestroy : function(){
        gxp.TimelinePanel.superclass.beforeDestroy.call(this);
        for (var key in this.layerLookup) {
            var layer = this.layerLookup[key].layer;
            layer.events.un({
                loadstart: this.onLoadStart,
                loadend: this.onLoadEnd,
                featuresremoved: this.onFeaturesRemoved,
                scope: this
            });
            layer.destroy();
        }
        this.unbindViewer();
        if (this.rendered){
            Ext.destroy(this.busyMask);
        }
        if (this.timeline) {
            this.timeline.dispose();
            this.timeline = null;
        }
        this.busyMask = null;
    }

});

/** api: xtype = gxp_timelinepanel */
Ext.reg("gxp_timelinepanel", gxp.TimelinePanel);
