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
 *  class = Playback
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Playback(config)
 *
 *    Provides a configurable playback control for playing temporally enabled maps
 */
gxp.plugins.Playback = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_playback */
    ptype: "gxp_playback",
    actionTarget:null,
    initialTime:null,
    rangedPlayInterval:null, //hide this as just a config
    timeFormat:"l, F d, Y g:i:s A",
    slider:true,
    dynamicRange:true,
    //api config
    //playback mode is one of: "track","cumulative","ranged",??"decay"??
    playbackMode:"track",
    showIntervals:false,
    labelButtons:false,
    settingsButton:true,
    rateAdjuster:false,
    //api property
    settingsPanel:null,
    // api config
    //playbackActions, default: ["settings","reset","play","fastforward","next","loop"]; also available are "pause" and "end"
    
    //i18n
    /** api: config[playLabel]
     *  ``String``
     *  Text for play button label (i18n).
     */
    playLabel:'Play',
    /** api: config[playTooltip]
     *  ``String``
     *  Text for play button tooltip (i18n).
     */
    playTooltip:'Play',
    stopLabel:'Stop',
    stopTooltip:'Stop',
    fastforwardLabel:'FFWD',
    fastforwardTooltip:'Double Speed Playback',
    nextLabel:'Next',
    nextTooltip:'Advance One Frame',
    resetLabel:'Reset',
    resetTooltip:'Reset to the start',
    loopLabel:'Loop',
    loopTooltip:'Continously loop the animation',
    normalPlaybackTooltip:'Return to normal playback',
    pauseLabel:'Pause',
    pauseTooltip:'Pause',

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Playback.superclass.constructor.apply(this, arguments);
        Ext.applyIf(this,{
            playbackActions:["settings","slider","reset","play","fastforward","next","loop"],
            control:this.buildTimeManager(),
            outputTarget:this.actionTarget?'map':null,
            outputConfig:{'xtype':'tip',format:this.timeFormat}
        })
    },

    /** api: method[addActions]
     */
    addActions: function() {
        this.slider && this.target.on({
            'ready': this.configureSlider,
            scope: this
        })
        !this.control.map && this.target.mapPanel.map.addControl(this.control);
        var actions = this.buildActions();
        //only add actions if we have a real action target that is not 'map'
        if(this.actionTarget){
            var targets = this.actionTarget instanceof Array ? this.actionTarget : [this.actionTarget]
            if((mapIndex = targets.indexOf('map'))>-1){
                targets.splice(mapIndex,1);
            }
            return gxp.plugins.Playback.superclass.addActions.apply(this, [actions]);
        }
        else{
            this.timePanel = this.buildTimePanel(actions);
            this.target.mapPanel.addItem(this.timePanel);
            this.outputTarget = this.timePanel.id;
            this.outputConfig.defaultAlign = 't-b';
            return gxp.plugins.Playback.superclass.addActions.apply(this);
        }
    },
    addOutput: function(config){
        var output = gxp.plugins.Playback.superclass.addOutput.apply(this,[config]);
        if(this.outputTarget=='map'){
            output.alignTo(this.target.mapPanel.getEl(),'tl-tl',[30,-10])
        }else{
            output.alignTo(this.timePanel.slider.getEl(),output.defaultAlign,[0,-5])
        }
    },
    /** private: method[buildActions]
     */
    buildActions: function(){
        var actionDefaults = {
            'slider':{
            xtype: 'multislider',
            ref:'timeSlider',
            width:200,
            animate:false,
            plugins: new Ext.slider.Tip({
                getText: function(thumb){
                    if (this.indexMap[thumb.index] != 'tail') {
                        return (new Date(thumb.value).format(this.timeFormat));
                    }else{
                        var formatInfo = gxp.plugins.Playback.prototype.smartIntervalFormat.call(this,thumb.slider.thumbs[0].value-thumb.value);
                        return formatInfo.value + ' ' +formatInfo.units;
                    }
                }
            }),
            listeners:{
                'changecomplete':this.onSliderChangeComplete
            }
        },
            'reset': {
                iconCls: 'gxp-icon-first',
                ref:'btnReset',
                handler: this.control.reset,
                scope: this.control,
                tooltip: this.resetTooltip,
                menuText: this.resetLabel,
                text: (this.labelButtons) ? this.resetLabel : undefined
            },
            'pause': {
                iconCls: 'gxp-icon-pause',
                ref:'btnPause',
                handler: this.control.stop,
                scope: this.control,
                tooltip: this.stopTooltip,
                menuText: this.stopLabel,
                text: (this.labelButtons) ? this.stopLabel : undefined,
                toggleGroup: 'timecontrol',
                enableToggle: true,
                allowDepress: false
            },
            'play': {
                iconCls: 'gxp-icon-play',
                ref:'btnPlay',
                toggleHandler: this.toggleAnimation,
                scope: this,
                toggleGroup: 'timecontrol',
                enableToggle: true,
                allowDepress: true,
                tooltip: this.playTooltip,
                menuText: this.playLabel,
                text: (this.labelButtons) ? this.playLabel : undefined
            },
            'next': {
                iconCls: 'gxp-icon-next',
                ref:'btnNext',
                handler: this.control.tick,
                scope: this.control,
                tooltip: this.nextTooltip,
                menuText: this.nextLabel,
                text: (this.labelButtons) ? this.nextLabel : undefined
            },
            'end': {
                iconCls: 'gxp-icon-last',
                ref:'btnEnd',
                handler: this.forwardToEnd,
                scope: this,
                tooltip: this.endTooltip,
                menuText: this.endLabel,
                text: (this.labelButtons) ? this.endLabel : undefined
            },
            'loop': {
                iconCls: 'gxp-icon-loop',
                ref:'btnLoop',
                tooltip: this.loopTooltip,
                enableToggle: true,
                allowDepress: true,
                toggleHandler: this.toggleLoopMode,
                scope: this,
                tooltip: this.loopTooltip,
                menuText: this.loopLabel,
                text: (this.labelButtons) ? this.loopLabel : undefined,
            },
            'fastforward': {
                iconCls: 'gxp-icon-ffwd',
                ref:'btnFastforward',
                tooltip: this.fastforwardTooltip,
                enableToggle: true,
                allowDepress: true,
                toggleHandler: this.toggleDoubleSpeed,
                scope: this,
                tooltip: this.fastforwardTooltip,
                menuText: this.fastforwardLabel,
                text: (this.labelButtons) ? this.fastforwardLabel : undefined,
            },
            'settings': {
                iconCls: 'gxp-icon-settings',
                ref:'btnSettings',
                handler: this.openSettingsPanel,
                scope: this,
                tooltip: this.settingsTooltip,
                menuText: this.settingsLabel,
                text: (this.labelButtons) ? this.settingsLabel : undefined
            }
        }
        var actConfigs = this.playbackActions;
        var actions =[];
        for(var i=0,len=actConfigs.length;i<len;i++){
            var cfg = actConfigs[i];
            if(typeof cfg == 'string')cfg = actionDefaults[cfg];
            else if(!(Ext.isObject(cfg) || cfg instanceof Ext.Component || cfg instanceof Ext.Action || cfg instanceof GeoExt.Action)){
                console.error("playbackActions configurations must be a string, valid action, component, or config");
                cfg=null;
            }
            if(cfg){
                //actions interface won't work with regular component config objects. needs instantiated components
                if(cfg.xtype)cfg=Ext.create(cfg);
                actions.push(cfg);
            }
        }
        return actions;
    },
    buildSliderValues:function(){
      var indexMap = ['primary'],
      values = [this.control.currentTime.getTime()],
      min=this.control.range[0].getTime(),
      max=this.control.range[1].getTime(),
      then=new Date(min),
      interval=then['setUTC' + this.control.units](then['getUTC' + this.control.units]() + this.control.step) - min;
      if(this.dynamicRange){
        var rangeAdj = (min-max)*.1;
        values.push(min=min-rangeAdj,max=max+rangeAdj);
        indexMap[1]='minTime',indexMap[2]='maxTime';
      }
      if(this.playbackMode=='ranged'||this.playbackMode=='decay'){
        values.push(minTime);
        indexMap[indexMap.length]='tail'
      }
      return {'values':values,'map':indexMap,'maxValue':max,'minValue':min,'interval':interval}
    },
    buildTimeManager:function(){
        if(this.playbackMode=='ranged' || this.playbackMode=='decay'){
            this.controlOptions = Ext.apply(this.controlOptions||{},{
                agentOptions:{
                    'WMS':{intervalMode:'range',rangeInterval:this.rangedPlayInterval},
                    'Vector':{intervalMode:'range',rangeInterval:this.rangedPlayInterval}
                },
            })
        }
        var ctl = new OpenLayers.Control.TimeManager(this.controlOptions);
        return ctl;
    },
    configureSlider: function(){
        var sliderInfo = this.buildSliderValues();
        var slider = this.outputTarget.slider;
        slider.setMaxValue(sliderInfo.max);
        slider.setMinValue(sliderInfo.min);
        for (var i = 0; i < sliderInfo.values.length; i++) {
            if (slider.thumbs[i]) {slider.setValue(sliderInfo.values[i], i)}
            else {slider.addThumb(sliderInfo.values[i])}
        }
        Ext.apply(slider, {
            increment: sliderInfo.increment,
            keyIncrement: sliderInfo.increment,
            indexMap: sliderInfo.map
        })
        tailIndex = this.indexMap.indexOf('tail');
        if(this.indexMap[1]=='min'){
            slider.thumbs[1].el.addClass('x-slider-min-thumb');
            slider.thumbs[2].el.addClass('x-slider-max-thumb');
        }
        if(tailIndex>-1){
            slider.thumbs[tailIndex].el.addClass('x-slider-tail-thumb');
        }
    },
    forwardToEnd: function(btn){
        var ctl = this.control;
        ctl.setTime(new Date(ctl.range[(ctl.step < 0) ? 0 : 1].getTime()))
    },
    toogleAnimation:function(btn,pressed){
        this.control[pressed?'play':'stop']();
        btn.toggleClass('gxp-icon-play','gxp-icon-pause');
        btn.setTooltip(pressed?this.pauseTooltip:this.playTooltip);
        if(this.labelButtons && btn.text)btn.setText(pressed?this.pauseLabel:this.playLabel);
    },
    toggleLoopMode:function(btn,pressed){
        this.control.loop=pressed;
        btn.setTooltip(pressed?this.normalTooltip:this.loopTooltip);
        if(this.labelButtons && btn.text)btn.setText(pressed?this.normalLabel:this.loopLabel);
    },
    toogleDoubleSpeed:function(btn,pressed){
        this.control.frameRate = this.control.frameRate*(pressed)?2:0.5;
        btn.setTooltip(pressed?this.normalTooltip:this.fastforwardTooltip);
    },
    onSliderChangeComplete: function(slider, value, thumb){
        var slideTime = new Date(value);
        //test if this is the main time slider
        switch (this.indexMap[thumb.index]) {
            case 'primary':
                this.control.setTime(slideTime);
                slider.refOwner.timeDisplay.setValue(slideTime.format(this.timeFormat));
                break;
            case 'min':
                if (value >= this.control.intialRange[0].getTime()) {
                    this.control.setStart(new Date(value));
                }
                break;
            case 'max':
                if (value <= this.control.intialRange[1].getTime()) {
                    this.control.setEnd(new Date(value));
                }
                break;
            case 'tail':
                var adj = 1;
                switch (this.control.units) {
                    case OpenLayers.TimeUnit.YEARS:
                        adj *= 12;
                    case OpenLayers.TimeUnit.MONTHS:
                        adj *= (365 / 12);
                    case OpenLayers.TimeUnit.DAYS:
                        adj *= 24;
                    case OpenLayers.TimeUnit.HOURS:
                        adj *= 60;
                    case OpenLayers.TimeUnit.MINUTES:
                        adj *= 60;
                    case OpenLayers.TimeUnit.SECONDS:
                        adj *= 1000;
                        break;
                }
                this.control.rangeInterval = (slider.thumbs[0].value - value) / adj;
        }
    },
    smartIntervalFormat:function(diff){
        var unitText, diffValue;
        if(diff<6e3){
            unitText='Seconds',
            diffValue=(Math.round(diff/1e2))/10;
        }
        else if(diff<36e5){
            unitText='Minutes',
            diffValue=(Math.round(diff/6e2))/10;
        }
        else if(diff<864e5){
            unitText='Hours',
            diffValue=(Math.round(diff/36e4))/10;
        }
        else if(diff<2628e6){
            unitText='Days',
            diffValue=(Math.round(diff/864e4))/10;
        }
        else if(diff<31536e6){
            unitText='Months',
            diffValue=(Math.round(diff/2628e5))/10;
        }else{
            unitText='Years',
            diffValue=(Math.round(diff/31536e5))/10;
        }
        return {units:unitText,value:diffValue}
    }
});

Ext.preg(gxp.plugins.Playback.prototype.ptype, gxp.plugins.Playback);