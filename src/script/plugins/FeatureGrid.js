/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeatureGrid
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *    Plugin for displaying vector features in a grid. Requires a
 *    :class:`gxp.plugins.FeatureManager`.
 */   
gxp.plugins.FeatureGrid = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_featuregrid */
    ptype: "gx_featuregrid",

    /** api: config[featureManager]
     *  ``String`` The id of the :class:`gxp.plugins.FeatureManager` to use
     *  with this tool.
     */
    featureManager: null,
    
    /** private: property[schema]
     *  ``GeoExt.data.AttributeStore``
     */
    schema: null,
    
    /** api: config[alwaysDisplayOnMap]
     *  ``Boolean`` If set to true, the features that are shown in the grid
     *  will always be displayed on the map, and there will be no "Display on
     *  map" button in the toolbar. Default is false.
     */
    alwaysDisplayOnMap: false,
    
    /** api: config[displayFeatureText]
     * ``String``
     * Text for feature display button (i18n).
     */
    displayFeatureText: "Display on map",

    /** api: config[zoomToSelectedText]
     * ``String``
     * Text for zoom to selected features button (i18n).
     */
    zoomToSelectedText: "Zoom to selected",

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var featureManager = this.target.tools[this.featureManager];
        var map = this.target.mapPanel.map;
        // a minimal SelectFeature control - used just to provide select and
        // unselect, won't be added to the map
        var selectControl = new OpenLayers.Control.SelectFeature(featureManager.featureLayer);
        config = Ext.apply({
            xtype: "gx_featuregrid",
            sm: new GeoExt.grid.FeatureSelectionModel({
                selectControl: selectControl,
                singleSelect: false,
                autoActivateControl: false,
                listeners: {
                    "beforerowselect": function() {
                        if(selectControl.active && !this._selectingFeature) {
                            return false;
                        }
                        delete this._selectingFeature;
                    },
                    scope: this
                }
            }),
            autoScroll: true,
            bbar: (featureManager.paging ? [{
                iconCls: "x-tbar-page-first",
                ref: "../firstPageButton",
                disabled: true,
                handler: function() {
                    featureManager.setPage({index: 0});
                }
            }, {
                iconCls: "x-tbar-page-prev",
                ref: "../prevPageButton",
                disabled: true,
                handler: function() {
                    featureManager.previousPage();
                }
            }, {
                iconCls: "gx-icon-zoom-to",
                ref: "../zoomToPageButton",
                disabled: true,
                hidden: featureManager.autoZoomPage,
                handler: function() {
                    map.zoomToExtent(featureManager.page.extent);
                }
            }, {
                iconCls: "x-tbar-page-next",
                ref: "../nextPageButton",
                disabled: true,
                handler: function() {
                    featureManager.nextPage();
                }
            }, {
                iconCls: "x-tbar-page-last",
                ref: "../lastPageButton",
                disabled: true,
                handler: function() {
                    featureManager.setPage({index: "last"});
                }
            }] : []).concat(["->", {
                text: this.displayFeatureText,
                hidden: this.alwaysDisplayOnMap,
                enableToggle: true,
                toggleHandler: function(btn, pressed) {
                    featureManager[pressed ? "showLayer" : "hideLayer"](this.id);
                },
                scope: this
            }, {
                text: this.zoomToSelectedText,
                iconCls: "gx-icon-zoom-to",
                handler: function(btn) {
                    var bounds, geom, extent;
                    featureGrid.getSelectionModel().each(function(r) {
                        geom = r.getFeature().geometry;
                        if(geom) {
                            extent = geom.getBounds();
                            if(bounds) {
                                bounds.extend(extent);
                            } else {
                                bounds = extent.clone();
                            }
                        }
                    }, this);
                    if(bounds) {
                        this.target.mapPanel.map.zoomToExtent(bounds);
                    }
                },
                scope: this                
            }])
        }, config || {});
        var featureGrid = gxp.plugins.FeatureGrid.superclass.addOutput.call(this, config);
        
        this.alwaysDisplayOnMap && featureManager.showLayer(this.id);
        
        featureManager.paging && featureManager.on("setpage", function(mgr) {
            var paging = mgr.pages && mgr.pages.length;
            featureGrid.zoomToPageButton.setDisabled(!paging);
            var prev = paging && mgr.pages.indexOf(mgr.page) !== 0;
            featureGrid.firstPageButton.setDisabled(!prev);
            featureGrid.prevPageButton.setDisabled(!prev);
            var next = paging && mgr.pages.indexOf(mgr.page) !== mgr.pages.length - 1;
            featureGrid.lastPageButton.setDisabled(!next);
            featureGrid.nextPageButton.setDisabled(!next);
        }, this);
        
        featureManager.on("layerchange", function(mgr, rec, schema) {
            //TODO use schema instead of store to configure the fields
            var ignoreFields = ["feature", "state", "fid"];
            schema && schema.each(function(r) {
                r.get("type").indexOf("gml:") == 0 && ignoreFields.push(r.get("name"));
            });
            featureGrid.ignoreFields = ignoreFields;
            featureGrid.setStore(featureManager.featureStore);
        }, this);
        
        return featureGrid;
    }
        
});

Ext.preg(gxp.plugins.FeatureGrid.prototype.ptype, gxp.plugins.FeatureGrid);
