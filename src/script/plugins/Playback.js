/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/PlaybackPanel.js
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
        config = config || {};
        if (!this.outputConfig) {this.outputConfig = config}
        var panel = gxp.plugins.Playback.superclass.addOutput.call(this, Ext.apply(config,{
            xtype: 'gxp_playbackpanel',
            control: this.control || this.buildTimeManager(),
            mapPanel:this.target.mapPanel,
            playbackMode:this.playbackMode
        }))
        panel.show();
        return panel;
    },
    addActions: function(actions){
        this.target.on('ready',this.addOutput,this);
    },
    buildTimeManager:function(){
        this.controlOptions || (this.controlOptions={})
        if(this.playbackMode=='ranged' || this.playbackMode=='decay'){
            Ext.apply(this.controlOptions,{
                agentOptions:{
                    'WMS':{rangeMode:'range',rangeInterval:this.rangedPlayInterval},
                    'Vector':{rangeMode:'range',rangeInterval:this.rangedPlayInterval}
                },
            })
        }
        else if(this.playbackMode=='cumulative'){
            Ext.apply(this.controlOptions,{
                agentOptions:{
                    'WMS':{rangeMode:'cumulative'},
                    'Vector':{rangeMode:'cumulative'}
                },
            })
        }
        var ctl = this.control = new OpenLayers.Control.TimeManager(this.controlOptions);
        this.target.mapPanel.map.addControl(ctl);
        return ctl;
    }
});

Ext.preg(gxp.plugins.Playback.prototype.ptype, gxp.plugins.Playback);
