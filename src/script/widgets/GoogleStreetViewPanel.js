/**
 * Copyright (c) 2008-2010 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = GoogleStreetViewPanel
 *  base_link = `Ext.Panel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace('gxp');

gxp.GoogleStreetViewPanel = Ext.extend(Ext.Panel, {

    /** private: property[panorama]
     *  ``google.maps.StreetViewPanorama``  The panorama object.
     */
    panorama: null,

    /** api: config[yaw]
     *  ``Number``  The camera yaw in degrees relative to true north. True north 
     *  is 0 degrees, east is 90 degrees, south is 180 degrees, west is 270 
     *  degrees.
     */
    /** private: property[yaw]
     *  ``Number``  Camera yaw
     */
    yaw: 180,

    /** api: config[pitch]
     *  ``Number``  The camera pitch in degrees, relative to the street view 
     *  vehicle. Ranges from 90 degrees (directly upwards) to -90 degrees 
     *  (directly downwards).
     */
    /** private: property[pitch]
     *  ``Number``  Camery pitch
     */
    pitch: 0,

    /** api: config[zoom]
     *  ``Number``  The zoom level. Fully zoomed-out is level 0, zooming in 
     *  increases the zoom level.
     */
    /** private: property[zoom]
     *  ``Number``  Panorama zoom level
     */
    zoom: 0,

    /** api: config[position]
     *  ``OpenLayers.LonLat``  The panorama location
     */
    /** private: property[position]
     *  ``OpenLayers.LonLat``  Panorama location
     */
    position: null,

    /** private: method[initComponent]
     *  Private initComponent override.
     */
    initComponent : function() {
        var defConfig = {
            plain: true,
            border: false
        };

        Ext.applyIf(this, defConfig);
        return gxp.GoogleStreetViewPanel.superclass.initComponent.call(this);
    },

    /** private: method[afterRender]
     *  Private afterRender override.
     */
    afterRender : function() {
        if (this.ownerCt) {
            var size = this.ownerCt.getSize();
            Ext.applyIf(this, size);
        }
        gxp.GoogleStreetViewPanel.superclass.afterRender.call(this);

        // Configure panorama and associate methods and parameters to it
        var options = {
            position: new google.maps.LatLng(this.position.lat, this.position.lon),
            pov: {
                heading: this.heading,
                pitch: this.pitch,
                zoom: this.zoom
            }
        };

        // Draw navigation tool in map
        this.panorama.drawNavigationTool = function(panorama, position) {
            // Destroy the existing features
            panorama.navigationToolLayer.destroyFeatures();
            // Compute the new position
            var circlePosition = new OpenLayers.Geometry.Point(position.lng(), position.lat());
            circlePosition.transform(new OpenLayers.Projection("EPSG:4326"), panorama.map.getProjectionObject());
            // Add a vector feature in navigation layer
            panorama.navigationTool = new OpenLayers.Feature.Vector(circlePosition, {yaw: panorama.yaw});
            panorama.navigationToolLayer.addFeatures([panorama.navigationTool]);
        };

        this.panorama.getPermalink = function(complete) {
            var permalink;
            if (complete) {
                permalink = window.location.href;
                if (OpenLayers.String.contains(permalink, '?')) {
                    var end = permalink.indexOf('?');
                    permalink = permalink.substring(0, end);
                }
                permalink = permalink + "?";
            } else {
                permalink = '';
            }
            permalink = permalink + "yaw=" + this.yaw;
            permalink = permalink + "&pitch=" + this.pitch;
            permalink = permalink + "&panoZoom=" + this.zoom;
            permalink = permalink + "&clickMode=" + this.clickMode;
            permalink = permalink + "&videoTimeInterval=" + this.videoTimeInterval;
            permalink = permalink + "&showTool=" + this.showTool;
            permalink = permalink + "&showLinks=" + this.showLinks;
            if (this.map) {
                permalink = permalink + "&easting=" + this.map.getCenter().lon;
                permalink = permalink + "&northing=" + this.map.getCenter().lat;
                permalink = permalink + "&zoom=" + this.map.getZoom();
            }
            if (this.navigationTool) {
                permalink = permalink + "&panoEasting=" + this.navigationTool.geometry.x;
                permalink = permalink + "&panoNorthing=" + this.navigationTool.geometry.y;
            }
            return permalink;
        };

        // String to boolean function
        this.panorama.stringToBoolean = function(string) {
            switch (string.toLowerCase()) {
                case "true": case "yes": case "1": return true;
                case "false": case "no": case "0": case null: return false;
                default: return Boolean(string);
            }
        };

        this.panorama.setPermalink = function(parameters) {
            if (parameters.easting && parameters.northing) {
                var position = new OpenLayers.LonLat(parseFloat(parameters.easting), parseFloat(parameters.northing));
                if (this.map) {
                    this.map.setCenter(position);
                }
            }
            if (parameters.zoom) {
                if (this.map) {
                    this.map.zoomTo(parseInt(parameters.zoom, 10));
                }
            }
            if (parameters.yaw) {
                this.yaw = parseFloat(parameters.yaw);
            }
            if (parameters.pitch) {
                this.pitch = parseFloat(parameters.pitch);
            }
            if (parameters.panoZoom) {
                this.zoom = parseInt(parameters.panoZoom, 10);
            }
            if (parameters.clickMode) {
                this.clickMode = this.stringToBoolean(parameters.clickMode);
            }
            if (parameters.videoTimeInterval) {
                this.videoTimeInterval = parseFloat(parameters.videoTimeInterval);
            }
            if (parameters.showTool) {
                this.showTool = this.stringToBoolean(parameters.showTool);
            }
            if (parameters.showLinks) {
                this.showLinks = this.stringToBoolean(parameters.showLinks);
            }
            if (parameters.panoEasting && parameters.panoNorthing) {
                var positionPano = new OpenLayers.LonLat(parseFloat(parameters.panoEasting), parseFloat(parameters.panoNorthing));
                positionPano.transform(this.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
                var featurePosition = new GLatLng(positionPano.lat, positionPano.lon);
                this.panoramaLocation = featurePosition;
            }
        };

        // Set the permalink
        if (this.readPermalink) {
            var parameters = OpenLayers.Util.getParameters();
            this.panorama.setPermalink(parameters);
        }

        // Draw link in map
        this.panorama.drawLinkTool = function(panorama, position, links) {
            // Destroy the existing features
            panorama.navigationLinkLayer.destroyFeatures();
            // Add new link symbols
            panorama.navigationLinks = [];
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                var centerPosition = new OpenLayers.Geometry.Point(position.lng(), position.lat());
                centerPosition.transform(new OpenLayers.Projection("EPSG:4326"), panorama.map.getProjectionObject());
                // Add a vector feature as navigation link
                panorama.navigationLinks.push(new OpenLayers.Feature.Vector(centerPosition, {angle: link.yaw, panoId: link.panoId}));
            }
            if (panorama.navigationLinks.length > 0) {
                panorama.navigationLinkLayer.addFeatures(panorama.navigationLinks);
            }
        };

        // Add panorama event listeners
        GEvent.addListener(this.panorama, "yawchanged", function(yaw) {
            // This is the panorama
            if (this.showTool) {
                this.navigationTool.attributes.yaw = yaw;
                this.navigationTool.layer.drawFeature(this.navigationTool);
            }
            this.yaw = yaw;
        });
        GEvent.addListener(this.panorama, "zoomchanged", function(zoom) {
            this.zoom = zoom;
        });
        GEvent.addListener(this.panorama, "initialized", function(gstreetviewlocation) {
            if (!this.videoPlay) {
                //console.log('listener initialized');
                this.streetviewclient.getPanoramaById(gstreetviewlocation.panoId, this.callbackDrawTools.createDelegate(this));
            }
        });

        // Callback to manage panorama when used with getNearestPanorama
        this.panorama.callback = function (data) {
            this.deleteFeatures = function() {
                if (this.panorama.showTool) {
                    if (this.panorama.map) {
                        this.panorama.navigationToolLayer.destroyFeatures();
                    }
                }
                if (this.panorama.showLinks) {
                    if (this.panorama.map) {
                        this.panorama.navigationLinkLayer.destroyFeatures();
                    }
                }
            };
            if (data) {
                if (data.code == 600) {
                    this.deleteFeatures();
                    this.panorama.hide();
                    if (this.panorama.videoMode && this.panorama.videoPlay) {
                        this.panorama.videoReady = true;
                        this.panorama.videoPlay = false;
                        clearInterval(this.panorama.videoInterval);
                    }
                    alert(OpenLayers.i18n('Google Street View: No panorama found near this position. You have to click elsewhere ;-)'));
                } else if (data.code == 500) {
                    this.deleteFeatures();
                    this.panorama.hide();
                    if (this.panorama.videoMode && this.panorama.videoPlay) {
                        this.panorama.videoReady = true;
                        this.panorama.videoPlay = false;
                        clearInterval(this.panorama.videoInterval);
                    }
                    alert(OpenLayers.i18n('Google Street View: Server error'));
                } else if (data.code == 200) {
                    if (this.panorama.transitionYaw) {
                        this.panorama.followLink(this.panorama.transitionYaw);
                        this.panorama.transitionYaw = null;
                    } else {
                        var POV = {yaw: this.panorama.yaw,  pitch: this.panorama.pitch, zoom: this.panorama.zoom};
                        this.panorama.setLocationAndPOV(data.location.latlng, POV);
                    }
                    // Add the navigation tool
                    if (this.panorama.showTool) {
                        if (this.panorama.map) {
                            this.panorama.drawNavigationTool(this.panorama, data.location.latlng);
                        }
                    }
                    // Add the links
                    if (this.panorama.showLinks) {
                        if (this.panorama.map) {
                            this.panorama.drawLinkTool(this.panorama, data.location.latlng, data.links);
                        }
                        if (this.panorama.videoMode) {
                            this.panorama.previousDifferenceVideo = 361;
                            if (this.panorama.navigationLinks.length > 0 && this.panorama.previousYawVideo) {
                                for (var i = 0; i < this.panorama.navigationLinks.length; i++) {
                                    var difference = this.panorama.navigationLinks[i].attributes.angle - this.panorama.previousYawVideo;
                                    if (difference < -180) {
                                        difference = difference + 360;
                                    }
                                    if (difference > 180) {
                                        difference = difference - 360;
                                    }
                                    if (Math.abs(difference) < this.panorama.previousDifferenceVideo) {
                                        this.panorama.previousDifferenceVideo = Math.abs(difference);
                                        this.panorama.nextFeature = this.panorama.navigationLinks[i];
                                    }
                                }
                                this.panorama.videoReady = true;
                                //console.log("callback: previousDifferenceVideo" + this.panorama.previousDifferenceVideo)
                                //console.log("callback: nextYaw: "+ this.panorama.nextFeature.attributes.angle);
                            } else {
                                this.panorama.videoReady = true;
                                clearInterval(this.panorama.videoInterval);
                            }
                        }
                    }
                } else {
                    this.deleteFeatures();
                    this.panorama.hide();
                    if (this.panorama.videoMode && this.panorama.videoPlay) {
                        this.panorama.videoReady = true;
                        this.panorama.videoPlay = false;
                        clearInterval(this.panorama.videoInterval);
                    }
                    alert(OpenLayers.i18n('Google Street View: Unexpected problem'));
                }
            }
        };

        // Callback to manage panorama when used with getPanoramaById
        this.panorama.callbackDrawTools = function (data) {
            this.deleteFeatures = function() {
                if (this.showTool) {
                    if (this.map) {
                        this.navigationToolLayer.destroyFeatures();
                    }
                }
                if (this.showLinks) {
                    if (this.map) {
                        this.navigationLinkLayer.destroyFeatures();
                    }
                }
            };
            if (data) {
                if (data.code == 600) {
                    this.deleteFeatures();
                    alert(OpenLayers.i18n('Google Street View: No panorama found near this position. You have to click elsewhere ;-)'));
                } else if (data.code == 500) {
                    this.deleteFeatures();
                    alert(OpenLayers.i18n('Google Street View: Server error'));
                } else if (data.code == 200) {
                    // Add the navigation tool
                    if (this.showTool) {
                        if (this.map) {
                            this.drawNavigationTool(this, data.location.latlng);
                        }
                    }
                    // Add the links
                    if (this.showLinks) {
                        if (this.map) {
                            this.drawLinkTool(this, data.location.latlng, data.links);
                        }
                    }
                } else {
                    this.deleteFeatures();
                    alert(OpenLayers.i18n('Google Street View: Unexpected problem'));
                }
            }
        };

        // Set initial position of panorama
        if (this.panorama.panoramaLocation) {
            //console.log('panorama location init');
            this.streetviewclient.getNearestPanorama(this.panorama.panoramaLocation, this.panorama.callback.createDelegate(this));
        }

        // Add features associated to map
        if (this.map) {
            if (this.clickMode) {
                this.clickControl = new gxp.StreetViewClick({
                    handlerOptions: {
                        "single": true
                    },
                    panorama: this.panorama,
                    streetviewclient: this.streetviewclient
                });
                this.map.addControl(this.clickControl);
                this.clickControl.activate();
            }
            // Add the 2D navigation tool in the map
            if (this.showTool) {
                this.panorama.navigationToolLayer = new OpenLayers.Layer.Vector("2DNavigationTool", {
                    styleMap: new OpenLayers.StyleMap({
                        "default": {
                            externalGraphic: this.baseUrl + "/resources/tool.png",
                            graphicHeight: 32,
                            graphicWidth: 32,
                            graphicOpacity: 0.8,
                            rotation: "${yaw}"
                        },
                        "select": {
                            cursor: "pointer"
                        }
                    })});
                this.map.addLayer(this.panorama.navigationToolLayer);
                this.dragControl = new OpenLayers.Control.DragFeature(this.panorama.navigationToolLayer, {
                    doneDragging: function(pixel) {
                        var position = this.panorama.map.getLonLatFromPixel(pixel);
                        position.transform(this.panorama.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
                        var featurePosition = new GLatLng(position.lat, position.lon);

                        //console.log('dragging feature');
                        this.streetviewclient.getNearestPanorama(featurePosition, this.panorama.callback.createDelegate(this));
                    },
                    moveFeature: function(pixel) {
                        //alert(pixel);
                    },
                    panorama: this.panorama,
                    streetviewclient: this.streetviewclient
                });
                this.map.addControl(this.dragControl);
                this.dragControl.activate();
            }
            // Add the links in the map
            if (this.showLinks) {
                this.panorama.navigationLinkLayer = new OpenLayers.Layer.Vector("2DNavigationLink", {
                    styleMap: new OpenLayers.StyleMap({
                        "default": {
                            externalGraphic: this.baseUrl + "/resources/link.png",
                            graphicHeight: 24,
                            graphicWidth: 16.5,
                            graphicYOffset: -44,
                            graphicOpacity: 0.8,
                            rotation: "${angle}"
                        },
                        "select": {
                            cursor: "pointer",
                            externalGraphic: this.baseUrl + "/resources/link_selected.png"
                        }
                    })
                });
                this.map.addLayer(this.panorama.navigationLinkLayer);
                this.selectControl = new OpenLayers.Control.SelectFeature(this.panorama.navigationLinkLayer, {
                    hover: true,
                    clickFeature: function(feature) {
                        if (this.panorama.videoMode) {
                            // Play the panorama in video mode
                            this.playVideo = function() {
                                this.panorama.previousYawVideo = feature.attributes.angle;

                                if (this.panorama.nextFeature) {
                                    feature = this.panorama.nextFeature;
                                    this.panorama.previousYawVideo = feature.attributes.angle;
                                }
                                this.panorama.transitionYaw = feature.attributes.angle;
                                //console.log("PlayVideo: previousYawVideo: "+ this.panorama.previousYawVideo);
                                if (this.panorama.videoReady) {
                                    //console.log('play video: mode auto');
                                    this.streetviewclient.getPanoramaById(feature.attributes.panoId, this.panorama.callback.createDelegate(this));
                                    this.panorama.videoReady = false;
                                }
                            };
                            // Manage the start and stop of the video
                            if (!this.panorama.videoPlay) {
                                //console.log("Start Play Video");
                                this.panorama.videoPlay = true;
                                this.panorama.videoInterval = setInterval(this.playVideo.createDelegate(this), this.panorama.videoTimeInterval);
                                this.playVideo();
                            } else {
                                //console.log("Stop Play Video");
                                this.panorama.nextFeature = null;
                                this.panorama.transitionYaw = null;
                                clearInterval(this.panorama.videoInterval);
                                this.panorama.videoPlay = false;
                            }
                        } else {
                            //console.log('play video: mode manuel');
                            this.panorama.transitionYaw = feature.attributes.angle;
                            this.streetviewclient.getPanoramaById(feature.attributes.panoId, this.panorama.callback.createDelegate(this));
                        }
                    },
                    allowSelection: true,
                    panorama: this.panorama,
                    streetviewclient: this.streetviewclient
                });
                this.map.addControl(this.selectControl);
                this.selectControl.activate();
            }
        }
    },

    /** private: method[beforeDestroy]
     *  Destroy Street View Panorama instance and navigation tools
     *
     */
    beforeDestroy: function() {
        if (this.clickMode) {
            if (this.map) {
                this.clickControl.deactivate();
                this.map.removeControl(this.clickControl);
            }
        }
        if (this.showTool) {
            if (this.map) {
                this.dragControl.deactivate();
                this.map.removeControl(this.dragControl);
                this.map.removeLayer(this.panorama.navigationToolLayer);
                this.panorama.navigationToolLayer.destroy();
            }
        }
        if (this.showLinks) {
            if (this.map) {
                this.selectControl.deactivate();
                this.map.removeControl(this.selectControl);
                this.map.removeLayer(this.panorama.navigationLinkLayer);
                this.panorama.navigationLinkLayer.destroy();
            }
        }
        this.panorama.remove();
        delete this.panorama;
        gxp.GoogleStreetViewPanel.superclass.beforeDestroy.apply(this, arguments);
    },

    /** private: method[onResize]
     *  Resize Street View Panorama
     *  :param w: ``Number`` Width
     *  :param h: ``Number`` Height
     */
    onResize : function(w, h) {
        gxp.GoogleStreetViewPanel.superclass.onResize.call(this, w, h);
        if (this.panorama) {
            if (typeof this.panorama == 'object') {
                this.panorama.checkResize();
            }
        }
    },

    /** private: method[setSize]
     *  Set size of Street View Panorama
     *
     */
    setSize : function(width, height, animate) {
        gxp.GoogleStreetViewPanel.superclass.setSize.call(this, width, height, animate);
        if (this.panorama) {
            if (typeof this.panorama == 'object') {
                this.panorama.checkResize();
            }
        }
    }
});

/** api: xtype = gxux_streetviewpanel */
Ext.reg('gxux_streetviewpanel', gxp.GoogleStreetViewPanel);
