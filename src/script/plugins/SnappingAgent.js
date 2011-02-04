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
                        strategies: [new OpenLayers.Strategy.BBOX({ratio: 1.5})],
                        displayInLayerSwitcher: false,
                        visibility: false,
                        minResolution: snapTarget.minResolution,
                        maxResolution: snapTarget.maxResolution
                    });
                    map.addLayer(layer);
                    map.events.on({
                        moveend: function() {
                            var min = snapTarget.minResolution || Number.NEGATIVE_INFINITY;
                            var max = snapTarget.maxResolution || Number.POSITIVE_INFINITY;
                            var resolution = map.getResolution();
                            if (min <= resolution && resolution < max) {
                                layer.strategies[0].update();
                            }
                        },
                        scope: this
                    });
                    snapTarget.layer = layer;
                    this.snappingTargets.push(snapTarget);
                    for (var i=0, ii=this.controls.length; i<ii; ++i) {
                        this.controls[i].addTarget(snapTarget);
                    }
                },
                scope: this
            }
        });
        delete snapTarget.source;
        delete snapTarget.name;

        featureManager.init(this.target);
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
