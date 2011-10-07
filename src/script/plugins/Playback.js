/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/PlaybackToolbar.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = Playback
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Playback(config)
 *
 *    Provides an action to display a Playback in a new window.
 */
gxp.plugins.Playback = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_playback */
    ptype: "gxp_playback",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for Playback menu item (i18n).
     */
    menuText: "Time Playback",

    /** api: config[tooltip]
     *  ``String``
     *  Text for Playback action tooltip (i18n).
     */
    tooltip: "Show Time Playback Panel",

    /** api: config[actionTarget]
     *  ``Object`` or ``String`` or ``Array`` Where to place the tool's actions
     *  (e.g. buttons or menus)? Use null as the default since our tool has both 
     *  output and action(s).
     */
    actionTarget: null,

    /** api: config[outputTarget]
     *  ``Object`` or ``String`` Where to place the tool's output (widgets.PlaybackPanel)
     *  Use 'map' as the default to display a transparent floating panel over the map.
     */
    outputTarget: 'map',
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Playback.superclass.constructor.apply(this, arguments);
    },
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config){
        delete this._ready;
        config = config || {};
        var toolbar = gxp.plugins.Playback.superclass.addOutput.call(this, Ext.apply(config,{
            xtype: 'gxp_playbacktoolbar',
            mapPanel:this.target.mapPanel,
            playbackMode:this.playbackMode
        }));
        return toolbar;
    },
    addActions: function(actions){
        this._ready = 0;
        this.target.mapPanel.map.events.register('addlayer', this, function(e) {
            var layer = e.layer;
            if (layer instanceof OpenLayers.Layer.WMS && layer.dimensions && layer.dimensions.time) {
                this.target.mapPanel.map.events.unregister('addlayer', this, arguments.callee);
                this._ready += 1;
                if (this._ready > 1) {
                    this.addOutput();
                }
            }
        });

        this.target.on('ready',function() {
            this._ready += 1;
            if (this._ready > 1) {
                this.addOutput();
            }
        }, this);
    }
});

Ext.preg(gxp.plugins.Playback.prototype.ptype, gxp.plugins.Playback);
