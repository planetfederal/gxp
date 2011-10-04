/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = PlaybackPanel
 *  base_link = `Ext.Panel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: PlaybackPanel(config)
 *   
 *      Create a panel for showing a ScaleLine control and a combobox for 
 *      selecting the map scale.
 */
gxp.PlaybackPanel = Ext.extend(Ext.Panel, {
    
    /** api: config[control]
     *  ``OpenLayers.Control`` or :class:`OpenLayers.Control.TimeManager`
     *  The control to configure the playback panel with.
     */
    control: null,
    viewer: null,
    initialTime:null,
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
    //api config ->timeDisplayConfig:null,
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
    normalTooltip:'Return to normal playback',
    pauseLabel:'Pause',
    pauseTooltip:'Pause',

    /** private: method[initComponent]
     *  Initialize the component.
     */
    initComponent: function() {
        if(!this.playbackActions){
            this.playbackActions = ["settings","slider","reset","play","fastforward","next","loop"]; 
        }
        Ext.applyIf(this,{
            layout:'hbox',
            width:400,
            hideMode:'visibility',
            cls:'gx-overlay-playback',
            defaults:{xtype:'button',flex:1,scale:'small'},
            items:this.buildPlaybackItems(),
            border:false,
            frame:false,
            unstyled:true,
            floating:true,
            shadow:false,
            timeDisplayConfig:{'xtype':'tip',format:this.timeFormat,height:'auto',closeable:false,title:false,width:210},
            listeners:{
                'show':function(cmp){
                    var mapPanel = (this.viewer && this.viewer.mapPanel) || GeoExt.MapPanel.guess();
                    //TODO make this configurable
                    cmp.el.alignTo(mapPanel.getEl(),'tl-tl',[80,60]);
                }
            }
        })
        gxp.PlaybackPanel.superclass.initComponent.call(this);       
    },
    /** private: method[buildPlaybackItems] */
    buildPlaybackItems: function(){
        if(!this.control.units){
            var ctl = this.control;
            ctl.guessPlaybackRate();
            ctl.events.on("rangemodified",this,function(){
                var oldvals = {
                    start: ctl.range[0].getTime(),
                    end: ctl.range[1].getTime(),
                    resolution: {
                        units: ctl.units,
                        step: ctl.step
                    }
                }
                ctl.guessPlaybackRate();
                if(ctl.range[0].getTime()!=oldvals.start||ctl.range[1].getTime()!=oldvals.end||ctl.units!=ol.units||ctl.step!=oldvals.step){
                    this.reconfigureSlider(this.buildSliderValues());
                }
            })}
        if(this.playbackMode=='ranged' || this.playbackMode=='decay'){
            this.control.incrementTime(this.control.rangeInterval,this.control.units)
        }
        var sliderInfo = (this.control.units && this.buildSliderValues()) || {};
        var actionDefaults = {
            'slider': {
                xtype: 'multislider',
                ref: 'slider',
                maxValue: sliderInfo.maxValue,
                minValue: sliderInfo.minValue,
                increment: sliderInfo.interval,
                keyIncrement: sliderInfo.interval,
                indexMap: sliderInfo.map,
                values: sliderInfo.values || [0],
                width: 200,
                animate: false,
                format: this.timeFormat,
                plugins: new Ext.slider.Tip({
                    getText: function(thumb){
                        if (thumb.slider.indexMap[thumb.index] != 'tail') {
                            return (new Date(thumb.value).format(thumb.slider.format));
                        }
                        else {
                            var formatInfo = gxp.plugins.Playback.prototype.smartIntervalFormat.call(thumb, thumb.slider.thumbs[0].value - thumb.value);
                            return formatInfo.value + ' ' + formatInfo.units;
                        }
                    }
                }),
                listeners: {
                    'changecomplete': this.onSliderChangeComplete,
                    'beforechange':function(slider){return !!this.control.units},
                    'show': function(slider){
                        tailIndex = slider.indexMap.indexOf('tail');
                        if (slider.indexMap[1] == 'min') {
                            slider.thumbs[1].el.addClass('x-slider-min-thumb');
                            slider.thumbs[2].el.addClass('x-slider-max-thumb');
                        }
                        if (tailIndex > -1) {
                            slider.thumbs[tailIndex].el.addClass('x-slider-tail-thumb');
                            slider.thumbs[tailIndex].constrain = false;
                            slider.thumbs[0].constrain = false;
                        }
                        var panel = this;
                        this.control.events.register('tick', this.control, function(evt){
                            var offset = evt.currentTime.getTime() - slider.thumbs[0].value;
                            slider.setValue(0, slider.thumbs[0].value + offset);
                            if (tailIndex > -1) slider.setValue(tailIndex, slider.thumbs[tailIndex].value + offset)
                            panel.timeDisplay && panel.timeDisplay.update(evt.currentTime.format(slider.format))
                        })
                    },
                    scope: this
                }
            },
            'reset': {
                iconCls: 'gxp-icon-reset',
                ref:'btnReset',
                handler: this.control.reset,
                scope: this.control,
                tooltip: this.resetTooltip,
                menuText: this.resetLabel,
                text: (this.labelButtons) ? this.resetLabel : false
            },
            'pause': {
                iconCls: 'gxp-icon-pause',
                ref:'btnPause',
                handler: this.control.stop,
                scope: this.control,
                tooltip: this.stopTooltip,
                menuText: this.stopLabel,
                text: (this.labelButtons) ? this.stopLabel : false,
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
                listeners:{
                    "click": function(){
                        this.showTimeDisplay(this.timeDisplayConfig)
                    },
                    scope: this,
                    single: true
                },
                text: (this.labelButtons) ? this.playLabel : false
            },
            'next': {
                iconCls: 'gxp-icon-last',
                ref:'btnNext',
                handler: this.control.tick,
                scope: this.control,
                tooltip: this.nextTooltip,
                menuText: this.nextLabel,
                text: (this.labelButtons) ? this.nextLabel : false
            },
            'end': {
                iconCls: 'gxp-icon-last',
                ref:'btnEnd',
                handler: this.forwardToEnd,
                scope: this,
                tooltip: this.endTooltip,
                menuText: this.endLabel,
                text: (this.labelButtons) ? this.endLabel : false
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
                text: (this.labelButtons) ? this.loopLabel : false,
            },
            'fastforward': {
                iconCls: 'gxp-icon-ffwd',
                ref:'btnFastforward',
                tooltip: this.fastforwardTooltip,
                enableToggle: true,
                allowDepress: true,
                toggleHandler: this.toggleDoubleSpeed,
                scope: this,
                disabled:true,
                tooltip: this.fastforwardTooltip,
                menuText: this.fastforwardLabel,
                text: (this.labelButtons) ? this.fastforwardLabel : false,
            },
            'settings': {
                iconCls: 'gxp-icon-settings',
                ref:'btnSettings',
                handler: this.openSettingsPanel,
                scope: this,
                tooltip: this.settingsTooltip,
                menuText: this.settingsLabel,
                text: (this.labelButtons) ? this.settingsLabel : false
            }
        }
        var actConfigs = this.playbackActions;
        var actions =[];
        for(var i=0,len=actConfigs.length;i<len;i++){
            var cfg = actConfigs[i];
            if(typeof cfg == 'string')cfg = actionDefaults[cfg];
            else if(!(Ext.isObject(cfg) || cfg instanceof Ext.Component || cfg instanceof Ext.Action)){
                console.error("playbackActions configurations must be a string, valid action, component, or config");
                cfg=null;
            }
            cfg && actions.push(cfg);
        }
        return actions;
    },
    showTimeDisplay: function(config){
        if (!config) {config = this.timeDisplayConfig}
        Ext.applyIf(config,{html:this.control.currentTime.format(this.timeFormat)})
        this.timeDisplay = this.mapPanel.add(config);
        this.timeDisplay.show();
        this.timeDisplay.el.alignTo(this.slider.getEl(), this.timeDisplay.defaultAlign, [0, 5])
    },
    buildSliderValues:function(){
      var indexMap = ['primary'],
      values = [this.control.currentTime.getTime()],
      min=this.control.range[0].getTime(),
      max=this.control.range[0].getTime(),
      then=new Date(min),
      interval=then['setUTC' + this.control.units](then['getUTC' + this.control.units]() + this.control.step) - min;
      if(this.dynamicRange){
        var rangeAdj = (min-max)*.1;
        values.push(min=min-rangeAdj,max=max+rangeAdj);
        indexMap[1]='minTime',indexMap[2]='maxTime';
      }
      if(this.playbackMode=='ranged'||this.playbackMode=='decay'){
        values.push(min);
        indexMap[indexMap.length]='tail'
      }
      return {'values':values,'map':indexMap,'maxValue':max,'minValue':min,'interval':interval}
    },
    reconfigureSlider: function(sliderInfo){
        var slider = this.slider;
        slider.setMaxValue(sliderInfo.maxValue);
        slider.setMinValue(sliderInfo.minValue);
        Ext.apply(slider, {
            increment: sliderInfo.interval,
            keyIncrement: sliderInfo.interval,
            indexMap: sliderInfo.map
        });
        for (var i = 0; i < sliderInfo.values.length; i++) {
            slider.setValue(i, sliderInfo.values[i])
        }
    },
    forwardToEnd: function(btn){
        var ctl = this.control;
        ctl.setTime(new Date(ctl.range[(ctl.step < 0) ? 0 : 1].getTime()))
    },
    toggleAnimation:function(btn,pressed){
        this.control[pressed?'play':'stop']();
        btn.btnEl.toggleClass('gxp-icon-play').toggleClass('gxp-icon-pause');
        btn.el.removeClass('x-btn-pressed');
        btn.setTooltip(pressed?this.pauseTooltip:this.playTooltip);
        btn.refOwner.btnFastforward[pressed?'enable':'disable']();
        if(this.labelButtons && btn.text)btn.setText(pressed?this.pauseLabel:this.playLabel);
    },
    toggleLoopMode:function(btn,pressed){
        this.control.loop=pressed;
        btn.setTooltip(pressed?this.normalTooltip:this.loopTooltip);
        if(this.labelButtons && btn.text)btn.setText(pressed?this.normalLabel:this.loopLabel);
    },
    toggleDoubleSpeed:function(btn,pressed){
        this.control.frameRate = this.control.frameRate*(pressed)?2:0.5;
        this.control.stop();this.control.play();
        btn.setTooltip(pressed?this.normalTooltip:this.fastforwardTooltip);
    },
    onSliderChangeComplete: function(slider, value, thumb){
        var slideTime = new Date(value);
        //test if this is the main time slider
        switch (slider.indexMap[thumb.index]) {
            case 'primary':
                this.control.setTime(slideTime);
                !this.timeDisplay && this.showTimeDisplay(this.timeDisplayConfig)
                this.timeDisplay.update(slideTime.format(this.timeFormat));
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
        var unitText, diffValue, absDiff=Math.abs(diff);
        if(absDiff<6e3){
            unitText='Seconds',
            diffValue=(Math.round(diff/1e2))/10;
        }
        else if(absDiff<36e5){
            unitText='Minutes',
            diffValue=(Math.round(diff/6e2))/10;
        }
        else if(absDiff<864e5){
            unitText='Hours',
            diffValue=(Math.round(diff/36e4))/10;
        }
        else if(absDiff<2628e6){
            unitText='Days',
            diffValue=(Math.round(diff/864e4))/10;
        }
        else if(absDiff<31536e6){
            unitText='Months',
            diffValue=(Math.round(diff/2628e5))/10;
        }else{
            unitText='Years',
            diffValue=(Math.round(diff/31536e5))/10;
        }
        return {units:unitText,value:diffValue}
    }
});

/** api: xtype = gxp_playbackpanel */
Ext.reg('gxp_playbackpanel', gxp.PlaybackPanel);
