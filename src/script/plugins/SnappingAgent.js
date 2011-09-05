/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SnappingAgent
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SnappingAgent(config)
 *
 *    Plugin for managing snapping while editing.
 */   
gxp.plugins.SnappingAgent = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_snappingagent */
    ptype: "gxp_snappingagent",    
    
    /** api: config[controlOptions]
     *  ``Object`` Options for the ``OpenLayers.Control.Snapping`` used with
     *  this tool.
     */
    
    /** api: config[targets]
     *  ``Array`` Shortcut to the targets control option of the
     *  ``OpenLayers.Control.Snapping`` used with this tool.
     */

    /** private: method[init]
     */
    init: function(target) {
        gxp.plugins.SnappingAgent.superclass.init.apply(this, arguments);
        this.snappingTargets = [];
        this.controls = [];
        this.setSnappingTargets(this.targets);
    },
    
    /** private: method[setSnappingTargets]
     */
    setSnappingTargets: function(targets) {
        // clear any previous targets
        this.snappingTargets.length = 0;
        // configure any given targets
        if (targets) {
            for (var i=0, ii=targets.length; i<ii; ++i) {
                this.addSnappingTarget(targets[i]);
            }
        }
    },
    
    /** private: method[addSnappingTarget]
     */
    addSnappingTarget: function(snapTarget) {
        snapTarget = Ext.apply({}, snapTarget);
        // TODO: Discuss simplifying this.  What we want here is a WFS protocol
        // given a WMS layer config.  We're only using the FeatureManager for 
        // generating the protocol options.
        var featureManager = new gxp.plugins.FeatureManager({
            maxFeatures: null,
            paging: false,
            layer: {
                source: snapTarget.source,
                name: snapTarget.name
            },
            listeners: {
                layerchange: function() {
                    var map = this.target.mapPanel.map;
                    var layer = new OpenLayers.Layer.Vector(snapTarget.name, {
                        protocol: featureManager.featureStore.proxy.protocol,
                        strategies: [new OpenLayers.Strategy.BBOX({
                            ratio: 1.5,
                            // we update manually, because usually the layer is
                            // invisble and the strategy would not update anyway
                            autoActivate: false
                        })],
                        displayInLayerSwitcher: false,
                        visibility: false,
                        minResolution: snapTarget.minResolution,
                        maxResolution: snapTarget.maxResolution
                    });
                    map.addLayer(layer);
                    map.events.on({
                        moveend: function() {
                            this.update(snapTarget);
                        },
                        scope: this
                    });
                    snapTarget.layer = layer;
                    this.update(snapTarget);
                    this.snappingTargets.push(snapTarget);
                    for (var i=0, ii=this.controls.length; i<ii; ++i) {
                        this.controls[i].addTarget(snapTarget);
                    }
                    this.target.on({
                        featureedit: function(featureManager, layerCfg) {
                            if (layerCfg.name == name && layerCfg.source == source) {
                                this.update(snapTarget, {force: true});
                            }
                        },
                        scope: this
                    });
                },
                scope: this
            }
        });
        var name = snapTarget.name, source = snapTarget.source;
        delete snapTarget.source;
        delete snapTarget.name;

        featureManager.init(this.target);
    },
    
    /** private: method[update]
     *  :arg snapTarget: ``Object`` The snapTarget to update
     *  :arg options: ``Object`` 1st argument for
     *      OpenLayers.Strategy.BBOX::update
     *
     *  Checks if features need to be loaded for the snapTarget, and loads them
     *  by calling update on the BBOX strategy.
     */
    update: function(snapTarget, options) {
        var min = snapTarget.minResolution || Number.NEGATIVE_INFINITY;
        var max = snapTarget.maxResolution || Number.POSITIVE_INFINITY;
        var resolution = this.target.mapPanel.map.getResolution();
        if (min <= resolution && resolution < max) {
            snapTarget.layer.strategies[0].update(options);
        }
    },
    
    /** api: method[addSnappingControl]
     *  :arg layer: ``OpenLayers.Layer.Vector`` An editable vector layer.
     *
     *  Prepares a snapping control for the provided layer.  All target
     *  configuration is derived from the configuration of this snapping agent.
     */
    addSnappingControl: function(layer) {
        var options = this.initialConfig.controlOptions || this.initialConfig.options;
        var control = new OpenLayers.Control.Snapping(
            Ext.applyIf({layer: layer}, options || {})
        );
        control.setTargets(this.snappingTargets);
        control.activate();
        this.controls.push(control);
    }

});

Ext.preg(gxp.plugins.SnappingAgent.prototype.ptype, gxp.plugins.SnappingAgent);
