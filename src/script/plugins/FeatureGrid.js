/**
 * @requires plugins/Tool.js
 */

Ext.namespace("gxp.plugins");

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
        // a minimal SelectFeature control - used just to provide select and
        // unselect, won't be added to the map
        var selectControl = new OpenLayers.Control.SelectFeature(this.target.tools[this.featureManager].featureLayer);
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
            bbar: ["->", {
                text: this.displayFeatureText,
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
            }]
        }, config || {});
        var featureGrid = gxp.plugins.FeatureGrid.superclass.addOutput.call(this, config);
        
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
