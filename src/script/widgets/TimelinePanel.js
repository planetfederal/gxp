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
window.Timeline && window.SimileAjax && (function() {
    SimileAjax.History.enabled = false;

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

    /** api: config[timeInfoEndpoint]
     *  ``String``
     *  url to use to get time info about a certain layer.
     */
    timeInfoEndpoint: "/maps/time_info.json?",
    
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
    instructionText: "There are too many events ({count}) to show in the timeline.<br/>Please zoom in or move the vertical slider down (maximum is {max})",

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

        // handler for clicking on an event in the timeline
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

        // we are binding with viewer to get updates on new layers        
        if (this.initialConfig.viewer) {
            delete this.viewer;
            this.bindViewer(this.initialConfig.viewer);
        }

        // we are binding with a feature manager to get notes/annotations
        if (this.initialConfig.featureManager) {
            delete this.featureManager;
            this.bindFeatureManager(this.initialConfig.featureManager);
        }

        // we are binding with the playback tool to get updates on ranges
        // and current times
        if (this.initialConfig.playbackTool) {
            delete this.playbackTool;
            this.bindPlaybackTool(this.initialConfig.playbackTool);
        }

        if (this.ownerCt) {
            this.ownerCt.on("beforecollapse", function() {
                this._silentMapMove = true;
            }, this);
            this.ownerCt.on("beforeexpand", function() {
                delete this._silentMapMove;
            }, this);
        }

        gxp.TimelinePanel.superclass.initComponent.call(this); 
    },

    /**
     * private: method[onChangeComplete]
     *  :arg slider: ``Ext.Slider``
     *  :arg value: ``Float``
     *
     *  Event listener for when the vertical slider is moved. This will
     *  influence the date range which will be used in the WFS protocol.
     */
    onChangeComplete: function(slider, value) {
        if (this.playbackTool) {
            var range = this.playbackTool.playbackToolbar.control.range;
            range = this.calculateNewRange(range, value);
            // correct for movements of the timeline in the mean time
            var center = this.playbackTool.playbackToolbar.control.currentTime;
            var span = range[1]-range[0];
            var start = new Date(center.getTime() - span/2);
            var end = new Date(center.getTime() + span/2);
            for (var key in this.layerLookup) {
                var layer = this.layerLookup[key].layer;
                layer && this.setFilter(key, this.createTimeFilter([start, end], key, this.bufferFraction));
            }
            this.updateTimelineEvents({force: true});
        }
    },

    /**
     * private: method[setFilterMatcher]
     *  :arg filterMatcher: ``Function``
     *
     *  Filter data in the timeline and repaint.
     */
    setFilterMatcher: function(filterMatcher) {
        if (this.timeline) {
            this.timeline.getBand(0).getEventPainter().setFilterMatcher(filterMatcher);
            this.timeline.getBand(1).getEventPainter().setFilterMatcher(filterMatcher);
            this.timeline.paint();
        }
    },

    /**
     * api: method[setLayerVisibility]
     *  :arg item: ``Ext.Menu.CheckItem``
     *  :arg checked: ``Boolean``
     *  :arg record: ``GeoExt.data.LayerRecord``
     *
     *  Change the visibility for a layer which is shown in the timeline.
     */
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
        this.setFilterMatcher(filterMatcher);
    },

    /**
     * api: method[applyFilter]
     *  :arg record: ``GeoExt.data.LayerRecord``
     *  :arg filter: ``OpenLayers.Filter``
     *  :arg checked: ``Boolean``
     *
     *  Filter a layer which is shown in the timeline.
     */
    applyFilter: function(record, filter, checked) {
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
        this.setFilterMatcher(filterMatcher);
    },

    /**
     * api: method[setTitleAttribute]
     *  :arg record: ``GeoExt.data.LayerRecord``
     *  :arg titleAttr: ``String``
     *
     *  Change the attribute to show in the timeline for a certain layer.
     *  Currently this means removing all features and re-adding them.
     */
    setTitleAttribute: function(record, titleAttr) {
        var key = this.getKey(record);
        this.layerLookup[key].titleAttr = titleAttr;
        this.clearEventsForKey(key);
        this.onFeaturesAdded({features: this.layerLookup[key].layer.features}, key);
    },

    /**
     * private method[destroyPopup]
     *
     *  Destroy an existing popup.
     */
    destroyPopup: function() {
        if (this.popup) {
            this.popup.destroy();
            this.popup = null;
        }
    },

    /**
     * private: method[handleEventClick]
     *  :arg x: ``Integer``
     *  :arg y: ``Integer``
     *  :arg evt: ``Object``
     *  
     *  Handler for when an event in the timeline gets clicked. Show a popup
     *  for a feature and the feature editor for a note/annotation.
     */
    handleEventClick: function(x, y, evt) {
        var fid = evt.getProperty("fid");
        var key = evt.getProperty("key");
        var layer = this.layerLookup[key].layer;
        var feature = layer && layer.getFeatureByFid(fid);
        if (feature) {
            this.destroyPopup();
            // if annotations, show feature editor
            if (!layer.protocol) {
                layer.events.triggerEvent("featureselected", {feature: feature});
            } else {
                var centroid = feature.geometry.getCentroid();
                var map = this.viewer.mapPanel.map;
                this._silentMapMove = true;
                map.setCenter(new OpenLayers.LonLat(centroid.x, centroid.y));
                delete this._silentMapMove;
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
        }
    },

    /**
     * private: method[bindFeatureManager]
     *  :arg featureManager: ``gxp.plugins.FeatureManager``
     *  
     *  Bind with a feature manager to have notes show up in the timeline.
     */
    bindFeatureManager: function(featureManager) {
        this.featureManager = featureManager;
        this.featureManager.on("layerchange", this.onLayerChange, this);
    },

    /**
     * private: method[unbindFeatureManager]
     *  
     *  Unbind with a feature manager
     */
    unbindFeatureManager: function() {
        if (this.featureManager) {
            this.featureManager.un("layerchange", this.onLayerChange, this);
            this.featureManager = null;
        }
    },

    /**
     * private: method[guessTitleAttribute]
     *  :arg schema: ``GeoExt.data.AttributeStore``
     *  :returns: ``String``
     *
     *  Find the first string attribute and use that to show events in the
     *  timeline.
     */
    guessTitleAttribute: function(schema) {
        var titleAttr = null;
        schema.each(function(record) {
            if (record.get("type") === "xsd:string") {
                titleAttr = record.get("name");
                return false;
            }           
        });
        return titleAttr;
    },

    /**
     * private: method[onLayerChange]
     *  :arg tool: ``gxp.plugins.FeatureManager``
     *  :arg record: ``GeoExt.data.LayerRecord``
     *  :arg schema: ``GeoExt.data.AttributeStore``
     *
     *  Listener for when the layer record associated with the feature manager
     *  changes. When this is fired, we can hook up the notes to the timeline.
     */
    onLayerChange: function(tool, record, schema) {
        var key = this.getKey(record);
        var titleAttr = this.guessTitleAttribute(schema);
        var callback = function(attribute, key, record, protocol, schema) {
            var layer = this.featureManager.featureLayer;
            this.layerLookup[key] = {
                timeAttr: attribute,
                titleAttr: titleAttr,
                icon: Timeline.urlPrefix + "/images/note.png",
                layer: layer,
                visible: true
            };
            if (this.featureManager.featureStore) {
                // we cannot use the featureLayer's events here, since features
                // will be added without attributes
                this.featureManager.featureStore.on("write", this.onSave.createDelegate(this, [key], 3), this);
            }
            if (layer) {
                layer.events.on({
                    "visibilitychanged": function(evt) {
                        this.setLayerVisibility(null, evt.object.getVisibility(), record);
                    },
                    scope: this
                });
            }
        };
        this.getTimeAttribute(record, null, schema, callback);
    },

    /**
     * private: method[onSave]
     *  :arg store: ``gxp.data.WFSFeatureStore``
     *  :arg action: ``String``
     *  :arg data: ``Array``
     *  :arg key: ``String``
     *
     *  When annotation features are saved to the store, we can add them to
     *  the timeline.
     */
    onSave: function(store, action, data, key) {
        var features = [];
        for (var i=0, ii=data.length; i<ii; i++) {
            var feature = data[i].feature;
            features.push(feature);
            this.clearEventsForFid(key, feature.fid);
        }
        this.addFeatures(key, features);
    },

    /**
     * private: method[bindPlaybackTool]
     *  :arg playbackTool: ``gxp.plugins.Playback``
     *
     *  Bind with the playback tool so we get updates on when we have to move
     *  the timeline and when we have to change the range.
     */
    bindPlaybackTool: function(playbackTool) {
        this.playbackTool = playbackTool;
        this.playbackTool.on("timechange", this.onTimeChange, this);
        this.playbackTool.on("rangemodified", this.onRangeModify, this);
    },

    /**
     * private: method[unbindPlaybackTool]
     *
     *  Unbind with the playback tool
     */
    unbindPlaybackTool: function() {
        if (this.playbackTool) {
            this.playbackTool.un("timechange", this.onTimeChange, this);
            this.playbackTool.un("rangemodified", this.onRangeModify, this);
            this.playbackTool = null;
        }
    },

    /**
     * private: method[onTimeChange]
     *  :arg toolbar: ``gxp.plugin.PlaybackToolbar``
     *  :arg currentTime: ``Date``
     *
     *  Listener for when the playback tool fires timechange.
     */
    onTimeChange: function(toolbar, currentTime) {
        this._silent = true;
        this.setCenterDate(currentTime);
        delete this._silent;
    },

    /** private: method[onRangeModify]
     *  :arg toolbar: ``gxp.plugin.PlaybackToolbar``
     *  :arg range: ``Array(Date)``
     *
     *  Listener for when the playback tool fires rangemodified
     */
    onRangeModify: function(toolbar, range) {
        this._silent = true;
        this.setRange(range);
        delete this._silent;
    },

    /** private: method[createTimeline]
     *  :arg range:  ``Array``
     *
     *  Create the Simile timeline object.
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

    /** private: method[setPlaybackCenter]
     *  :arg band:  ``Object``
     *
     *  When the timeline is moved, update the playback tool.
     */
    setPlaybackCenter: function(band) {
        var time = band.getCenterVisibleDate();
        this._silent !== true && this.playbackTool && this.playbackTool.setTime(time);
    },
    
    /** private: method[bindViewer]
     *  :arg viewer: ``gxp.Viewer``
     *
     *  Bind the timeline with the viewer, so we get updates on layer changes.
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
            remove: this.onLayerStoreRemove,
            scope: this
        });
        viewer.mapPanel.map.events.on({
            moveend: this.onMapMoveEnd,
            scope: this
        });
    },
    
    /** private: method[unbindViewer]
     *
     *  Unbind this timeline from the current viewer.
     */
    unbindViewer: function() {
        var mapPanel = this.viewer && this.viewer.mapPanel;
        if (mapPanel) {
            mapPanel.layers.unregister("add", this.onLayerStoreAdd, this);
            mapPanel.layers.unregister("remove", this.onLayerStoreRemove, this);
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
     *  :arg record: ``GeoExt.data.LayerRecord``
     *  :returns:  ``String``
     *
     *  Get a unique key for the layer record.
     */
    getKey: function(record) {
        return record.get("source") + "/" + record.get("name");
    },

    /** private: method[getTimeAttribute]
     *  :arg record: ``GeoExt.data.LayerRecord``
     *  :arg protocol: ``OpenLayers.Protocol``
     *  :arg schema: ``GeoExt.data.AttributeStore``
     *  :arg callback: ``Function``
     *
     *  Get the time attribute through the time info endpoint.
     *  Currently this is a MapStory specific protocol.
     */
    getTimeAttribute: function(record, protocol, schema, callback) {
        var key = this.getKey(record);
        Ext.Ajax.request({
            method: "GET",
            url: this.timeInfoEndpoint,
            params: {layer: record.get('name')},
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result) {
                    callback.call(this, result.attribute, key, record, protocol, schema);
                }
            },
            scope: this
        });
    },

    /** private: method[onLayerStoreRemove]
     *  :arg store: ``GeoExt.data.LayerStore``
     *  :arg record: ``Ext.data.Record``
     *  :arg index: ``Integer``
     *
     *  Handler for when layers get removed from the map. 
     */
    onLayerStoreRemove: function(store, record, index) {
        var key = this.getKey(record);
        if (this.layerLookup[key]) {
            var layer = this.layerLookup[key].layer;
            if (layer) {
                this.clearEventsForKey(key);
                layer.events.un({
                    loadstart: this.onLoadStart,
                    loadend: this.onLoadEnd,
                    featuresremoved: this.onFeaturesRemoved,
                    scope: this
                });
                delete this.schemaCache[key];
                delete this.layerLookup[key];
                layer.destroy();
            }
        }
    },

    /** private: method[onLayerStoreAdd]
     *  :arg store: ``GeoExt.data.LayerStore``
     *  :arg records: ``Array``
     *
     *  Handler for when new layers get added to the map. Make sure they also
     *  show up in the timeline.
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
                        var callback = function(attribute, key, record, protocol, schema) {
                            if (attribute) {
                                this.layerLookup[key] = {
                                    timeAttr: attribute,
                                    visible: true
                                };
                                this.addVectorLayer(record, protocol, schema);
                            }
                        };
                        this.getTimeAttribute(record, protocol, schema, callback);
                    }, this);
                }
            }
        }
    },

    /** private: method[onLayout]
     *
     *  Fired by Ext, create the timeline.
     */
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

    /** private: method[setRange]
     *  :arg range: ``Array``
     *
     *  Set the range for the bands of this timeline.
     */
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

    /** private: method[setCenterDate]
     *  :arg time: ``Date``
     *      
     *  Set the center datetime on the bands of this timeline.
     */
    setCenterDate: function(time) {
        if (this.timeline) {
            this.timeline.getBand(0).setCenterVisibleDate(time);
            if (this.rangeInfo && this.rangeInfo.current) {
                var currentRange = this.rangeInfo.current;
                var originalRange = this.rangeInfo.original;
                // update once the time gets out of the original range
                if (time < originalRange[0] || time > originalRange[1]) {
                    var span = currentRange[1] - currentRange[0];
                    var start = new Date(time.getTime() - span/2);
                    var end = new Date(time.getTime() + span/2);
                    this.rangeInfo.current = [start, end];
                    // calculate back the original extent
                    var startOriginal = new Date(time.getTime() - span/4);
                    var endOriginal = new Date(time.getTime() + span/4);
                    this.rangeInfo.original = [startOriginal, endOriginal];
                    var rangeToClear = undefined;
                    // we have moved ahead in time, and we have not moved so far that 
                    // all our data is invalid
                    if (start > currentRange[0] && start < currentRange[1]) {
                        // only request the slice of data that we need
                        rangeToClear = [currentRange[0], start];
                        start = currentRange[1];
                    }
                    // we have moved back in time
                    if (start < currentRange[0] && end > currentRange[0]) {
                        rangeToClear = [end, currentRange[1]];
                        end = currentRange[0];
                    }
                    for (var key in this.layerLookup) {
                        var layer = this.layerLookup[key].layer;
                        layer && this.setFilter(key, this.createTimeFilter([start, end], key, 0, false));
                    }
                    this.updateTimelineEvents({force: true}, rangeToClear);
                }
            }
        }
    },

    /** private: method[calculateNewRange]
     *  :arg range: ``Array``
     *  :arg percentage: ``Float``
     *  :returns: ``Array``
     *      
     *  Extend the range with a certain percentage. This only changes the end
     *  of the range.
     */
    calculateNewRange: function(range, percentage) {
        if (percentage === undefined) {
            percentage = this.rangeSlider.getValue();
        }
        var end = new Date(range[0].getTime() + ((percentage/100) * (range[1] - range[0])));
        return [range[0], end];
    },

    /** private: method[createTimeFilter]
     *  :arg range: ``Array``
     *  :arg key: ``String``
     *  :arg fraction: ``Float``
     *  :arg updateRangeInfo: ``Boolean`` Should we update this.rangeInfo?
     *  :returns: ``OpenLayers.Filter``
     *      
     *  Create an OpenLayers.Filter to use in the WFS requests.
     */
    createTimeFilter: function(range, key, fraction, updateRangeInfo) {
        var start = new Date(range[0].getTime() - fraction * (range[1] - range[0]));
        var end = new Date(range[1].getTime() + fraction * (range[1] - range[0]));
        if (updateRangeInfo !== false) {
            this.rangeInfo = {
                original: range,
                current: [start, end]
            };
        }
        return new OpenLayers.Filter({
            type: OpenLayers.Filter.Comparison.BETWEEN,
            property: this.layerLookup[key].timeAttr,
            lowerBoundary: OpenLayers.Date.toISOString(start),
            upperBoundary: OpenLayers.Date.toISOString(end)
        });
    },

    /** private: method[onLoadStart]
     *
     *  When a WFS layer loads for the timeline, show a busy mask.
     */ 
    onLoadStart: function() {
        this.layerCount++;
        if (!this.busyMask) {
            this.busyMask = new Ext.LoadMask(this.bwrap, {msg: this.loadingMessage});
        }
        this.busyMask.show();
    },

    /** private: method[onLoadEnd]
     *
     *  When all WFS layers are ready, hide the busy mask.
     */
    onLoadEnd: function() {
        this.layerCount--;
        if(this.layerCount === 0) {
            this.busyMask.hide();
        }
    },

    /** private: method[createHitCountProtocol]
     *  :arg protocolOptions: ``Object``
     *  :returns: ``OpenLayers.Protocol.WFS``
     *
     *  Create a hitCount protocol based on the main WFS protocol. This will
     *  be used to see if we will get too many features to show in the timeline.
     */
    createHitCountProtocol: function(protocolOptions) {
        return new OpenLayers.Protocol.WFS(Ext.apply({
            version: "1.1.0",
            readOptions: {output: "object"},
            resultType: "hits"
        }, protocolOptions));
    },

    /** private: method[setFilter]
     *  :arg key: ``String``
     *  :arg filter: ``OpenLayers.Filter``
     *
     *  Set the filter on the layer as a property. This will be used by the
     *  protocol when retrieving data.
     */
    setFilter: function(key, filter) {
        var layer = this.layerLookup[key].layer;
        layer.filter = filter;
    },
    
    /** private: method[addVectorLayer]
     *  :arg record: ``GeoExt.data.LayerRecord``
     *  :arg protocol: ``OpenLayers.Protocol``
     *  :arg schema: ``GeoExt.data.AttributeStore``
     *
     *  Create an internal vector layer which will retrieve the events for
     *  the timeline, using WFS and a BBOX strategy.
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
            loadstart: this.onLoadStart,
            loadend: this.onLoadEnd,
            featuresadded: this.onFeaturesAdded.createDelegate(this, [key], 1),
            featuresremoved: this.onFeaturesRemoved,
            scope: this
        });

        var titleAttr = this.guessTitleAttribute(schema);
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
     *  :arg rangeToClear: ``Array`` Optional date range to use for clearing.
     *
     *  Load the data for the timeline. Only load the data if the total number
     *  features is below a configurable threshold.
     */
    updateTimelineEvents: function(options, rangeToClear) {
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
                        if (rangeToClear !== undefined) {
                            this.clearEventsForRange(key, rangeToClear);
                        } else {
                            this.clearEventsForKey(key);
                        }
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
                var tpl = new Ext.Template(this.instructionText);
                var msg = tpl.applyTemplate({count: storage.numberOfFeatures, max: this.maxFeatures});
                this.timelineContainer.el.mask(msg, '');
                this.eventSource.clear();
            }
        }, this);
    },

    /** private: method[clearEventsForKey]
     *  :arg key: ``String`` 
     *
     *  Clear the events from the timeline for a certain layer.
     */
    clearEventsForKey: function(key) {
        var iterator = this.eventSource.getAllEventIterator();
        var eventIds = [];
        var count = 0;
        while (iterator.hasNext()) {
            count++;
            var evt = iterator.next();
            if (evt.getProperty('key') === key) {
                eventIds.push(evt.getID());
            }
        }
        for (var i=0, len=eventIds.length; i<len; ++i) {
            this.eventSource.remove(eventIds[i]);
        }
        this.timeline && this.timeline.layout();
    },

    /** private: method[clearEventsForRange]
     *  :arg key: ``String`` 
     *  :arg range: ``Array``
     *
     *  Clear the events from the timeline for a certain layer for dates that
     *  are within the supplied range.
     */
    clearEventsForRange: function(key, range) {
        var iterator = this.eventSource.getAllEventIterator();
        var eventIds = [];
        var count = 0;
        while (iterator.hasNext()) {
            count++;
            var evt = iterator.next();
            var start = evt.getProperty('start');
            // only clear if in range
            if (evt.getProperty('key') === key && start >= range[0] && start <= range[1]) {
                eventIds.push(evt.getID());
            }
        }
        for (var i=0, len=eventIds.length; i<len; ++i) {
            this.eventSource.remove(eventIds[i]);
        }
        this.timeline && this.timeline.layout();
    },

    /** private: method[clearEventsForFid]
     *  :arg key: ``String``
     *  :arg fid:  ``String``
     *
     *  Clear the events from the timeline for a certain feature.
     */
    clearEventsForFid: function(key, fid) {
        var iterator = this.eventSource.getAllEventIterator();
        var eventIds = [];
        while (iterator.hasNext()) {
            var evt = iterator.next();
            if (evt.getProperty('key') === key && evt.getProperty('fid') === fid) {
                eventIds.push(evt.getID());
            }
        }   
        for (var i=0, len=eventIds.length; i<len; ++i) {
            this.eventSource.remove(eventIds[i]);
        }
        this.timeline && this.timeline.layout();
    },

    /** private: method[onFeaturesRemoved]
     *  :arg event: ``Object`` 
     *
     *  Memory management for when features get removed.
     */
    onFeaturesRemoved: function(event) {
        // clean up
        for (var i=0, len=event.features.length; i<len; i++) {
            event.features[i].destroy();
        }
    },

    /** private: method[addFeatures]
     *  :arg key: ``String``
     *  :arg features: ``Array``
     *
     *  Add some features to the timeline.
     */    
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
                icon: this.layerLookup[key].icon,
                fid: features[i].fid
            };      
        }       
        var feed = {
            dateTimeFormat: "javascriptnative", //"iso8601",
            events: events
        };
        this.eventSource.loadJSON(feed, "http://mapstory.org/");
    },

    /** private: method[onFeaturesAdded]
     *  :arg event: ``Object``
     *  :arg key: ``String``
     *
     *  When features get added to the vector layer, add them to the timeline.
     */
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

    /** private: method[beforeDestroy]
     *  Cleanup.
     */
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
        this.destroyPopup();
        this.unbindViewer();
        this.unbindFeatureManager();
        this.unbindPlaybackTool();
        if (this.rendered){
            Ext.destroy(this.busyMask);
        }
        this.eventSource = null;
        if (this.timeline) {
            this.timeline.dispose();
            this.timeline = null;
        }
        this.busyMask = null;
    }

});

/** api: xtype = gxp_timelinepanel */
Ext.reg("gxp_timelinepanel", gxp.TimelinePanel);
