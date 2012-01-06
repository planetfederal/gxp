/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = PlaybackToolbar
 *  base_link = `Ext.Toolbar <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Toolbar>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: PlaybackToolbar(config)
 *   
 *      Create a panel for showing a ScaleLine control and a combobox for 
 *      selecting the map scale.
 */
gxp.PlaybackToolbar = Ext.extend(Ext.Toolbar, {
    
    /** api: config[control]
     *  ``OpenLayers.Control`` or :class:`OpenLayers.Control.TimeManager`
     *  The control to configure the playback panel with.
     */
    control: null,
    viewer: null,
    initialTime:null,
    timeFormat:"l, F d, Y g:i:s A",
    toolbarCls:'x-toolbar gx-overlay-playback', //must use toolbarCls since it is used instead of baseCls in toolbars
    slider:true,
    dynamicRange:false,
    //api config
    //playback mode is one of: "track","cumulative","ranged",??"decay"??
    playbackMode:"track",
    showIntervals:false,
    labelButtons:false,
    settingsButton:true,
    rateAdjuster:false,
    //api config ->timeDisplayConfig:null,
    //api property
    optionsWindow:null,
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
        if(!this.control){
            this.control = this.buildTimeManager();
        }
        Ext.applyIf(this,{
            defaults:{xtype:'button',flex:1,scale:'small'},
            items:this.buildPlaybackItems(),
            border:false,
            frame:false,
            unstyled:true,
            shadow:false,
            timeDisplayConfig:{'xtype':'tip',format:this.timeFormat,height:'auto',closeable:false,title:false,width:210}
        });
        this.addEvents(
            /**
             * Event: timechange
             * Fires when the current time represented changes.
             *
             * Listener arguments:
             * toolbar - {gxp.plugin.PlaybackToolbar} This playback toolbar
             * currentTime - {Date} The current time represented in the TimeManager control
             *      attached to this toolbar
             */
            "timechange",
            /**
             * Event: rangemodified
             * Fires when the start and/or end times of the slider change
             *
             * Listener arguments:
             * toolbar - {gxp.plugin.PlaybackToolbar} This playback toolbar
             * range - {Array(Date)} The current time range for playback allowed in the
             *      TimeManager control attached to this toolbar
             */
            "rangemodified"            
        );
        gxp.PlaybackToolbar.superclass.initComponent.call(this);        
    },
    /** private: method[destroy]
     *  Destory the component.
     */
    destroy: function(){
        //kill the control but only if we created the control
        if(this.control && !this.initialConfig.control){
            this.control.map && this.control.map.removeControl(this.control);
            this.control.destroy();
            this.control = null;
        }
        gxp.PlaybackToolbar.superclass.destroy.call(this);
    },
    /** api: method[setTime]
     *  :arg time: {Date}
     *  :return: {Boolean} - true if the time could be set to the supplied value
     *          false if the time is outside the current range of the TimeManager
     *          control.
     *          
     *  Set the time represented by the playback toolbar programatically
     */
    setTime: function(time){
        var timeVal = time.getTime();
        if(timeVal<this.slider.minValue || timeVal>this.slider.maxValue){
            return false;
        }else{
            this.control.setTime(time);
            return true;
        }
    },
    /** api: method[setTimeFormat]
     *  :arg format: {String}
     *  
     *  Set the format string used by the time slider tooltip
     */    
    setTimeFormat: function(format){
        this.timeFormat = this.slider.format = format;
    },
    /** api: method[setPlaybackMode]
     *  :arg mode: {String} one of 'track','cumulative', or 'ranged'
     *  
     *  Set the playback mode of the control.
     */
    setPlaybackMode: function(mode){
        this.playbackMode = mode;
        var sliderInfo = this.buildSliderValues();
        this.reconfigureSlider(sliderInfo);
        if (this.playbackMode != 'track') {
            this.control.incrementTime(this.control.rangeInterval, 
                this.control.units || OpenLayers.TimeUnit[this.smartIntervalFormat(sliderInfo.interval).units.toUpperCase()]);
            this.slider.setValue(0,this.control.currentTime.getTime());
        }
        this.setThumbStyles(this.slider);
    },    
    /** private: method[buildPlaybackItems] */
    buildPlaybackItems: function(){
        if (this.control.timeAgents) {
            if (!this.control.units) {
                this.control.guessPlaybackRate();
            }
            if (this.playbackMode == 'ranged' || this.playbackMode == 'decay') {
                if (this.control.units) {
                    this.control.incrementTime(this.control.rangeInterval, this.control.units);
                }
            }
        }
        var sliderInfo = ((this.control.units || this.control.snapToIntervals) && this.buildSliderValues()) || {};
        
        //set format of slider based on the interval steps
        if(!sliderInfo.interval && this.control.intervals && this.control.intervals.length>2){
            var interval = Math.round((sliderInfo.maxValue-sliderInfo.minValue)/this.control.intervals.length);
        }
        this.setTimeFormat(this.guessTimeFormat(sliderInfo.interval||interval));
        
        var actionDefaults = {
            'slider': {
                xtype: 'multislider',
                ref: 'slider',
                maxValue: sliderInfo.maxValue,
                minValue: sliderInfo.minValue,
                increment: sliderInfo.interval,
                keyIncrement: sliderInfo.interval,
                indexMap: sliderInfo.map,
                values: sliderInfo.values,
                width: 200,
                animate: false,
                format: this.timeFormat,
                plugins: [new Ext.slider.Tip({
                    getText: function(thumb){
                        if (thumb.slider.indexMap[thumb.index] != 'tail') {
                            return (new Date(thumb.value).format(thumb.slider.format));
                        }
                        else {
                            var formatInfo = gxp.PlaybackToolbar.prototype.smartIntervalFormat.call(thumb, thumb.slider.thumbs[0].value - thumb.value);
                            return formatInfo.value + ' ' + formatInfo.units;
                        }
                    }
                })],
                listeners: {
                    'changecomplete': this.onSliderChangeComplete,
                   'dragstart': function(){
                        if(this.control.timer){
                            this.control.stop();
                            this.restartPlayback=true;
                        }
                    },
                    'beforechange':function(slider,newVal,oldVal,thumb){
                        var allow = true;
                        if(!(this.control.units || this.control.snapToIntervals)){
                            allow = false;
                        }
                        else if(this.playbackMode=='cumulative' && slider.indexMap[thumb.index]=='tail'){
                            allow = false;
                        }
                        return allow;
                    },
                    'afterrender': function(slider){
                        var panel = this;
                        this.sliderTip = slider.plugins[0];
                        this.control.events.register('tick', this.control, function(evt){
                            var tailIndex = slider.indexMap?slider.indexMap.indexOf('tail'):-1;
                            var offset = (tailIndex>-1) ? evt.currentTime.getTime() - slider.thumbs[0].value : 0;
                            slider.setValue(0, evt.currentTime.getTime());
                            if (tailIndex > -1) {
                                slider.setValue(tailIndex, slider.thumbs[tailIndex].value + offset);
                            }
                            panel.updateTimeDisplay();
                            panel.fireEvent('timechange', panel, this.currentTime);
                        });
                        if(this.control.units && this.slider.thumbs.length>1) { 
                            this.setThumbStyles(this.slider);
                        }
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
                text: (this.labelButtons) ? this.loopLabel : false
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
                text: (this.labelButtons) ? this.fastforwardLabel : false
            },
            'settings': {
                iconCls: 'gxp-icon-settings',
                ref:'btnSettings',
                scope: this,
                handler:this.toggleOptionsWindow,
                enableToggle:false,
                tooltip: this.settingsTooltip,
                menuText: this.settingsLabel,
                text: (this.labelButtons) ? this.settingsLabel : false
            }
        };
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
        this.addReconfigListener();
        return actions;
    },
    showTimeDisplay: function(config){
        if (!config) {
            config = this.timeDisplayConfig;
        }
        Ext.applyIf(config,{html:this.control.currentTime.format(this.timeFormat)});
        //TODO get rif of timeDisplay, and use the slider's tip instead
        this.timeDisplay = this.add(config);
        this.timeDisplay.show();
        this.timeDisplay.el.alignTo(this.slider.getEl(), this.timeDisplay.defaultAlign, [0, 5]);
    },
    buildTimeManager:function(){
        this.controlConfig || (this.controlConfig={});
        //test for bad range times
        if(this.controlConfig.range && this.controlConfig.range.length){
            for (var i = 0; i < this.controlConfig.range.length; i++) {
                var dateString = this.controlConfig.range[i];
                if (dateString.indexOf('T') > -1 && dateString.indexOf('Z') == -1) {
                    dateString = dateString.substring(0, dateString.indexOf('T'));
                }
                this.controlConfig.range[i] = dateString;
            }
        }
        if(this.playbackMode=='ranged' || this.playbackMode=='decay'){
            Ext.apply(this.controlConfig,{
                agentOptions:{
                    'WMS':{rangeMode:'range',rangeInterval:this.rangedPlayInterval},
                    'Vector':{rangeMode:'range',rangeInterval:this.rangedPlayInterval}
                }
            });
        }
        else if(this.playbackMode=='cumulative'){
            Ext.apply(this.controlConfig,{
                agentOptions:{
                    'WMS':{rangeMode:'cumulative'},
                    'Vector':{rangeMode:'cumulative'}
                }
            });
        }
        var ctl = this.control = new OpenLayers.Control.TimeManager(this.controlConfig);
        this.mapPanel.map.addControl(ctl);
        if (ctl.layers) {
            this.fireEvent('rangemodified', this, ctl.range);
        }
        return ctl;
    },
    addReconfigListener: function(){
        this.control.guessPlaybackRate();
        this.control.events.register("rangemodified", this, function(){
            var ctl = this.control;
            if (!ctl.timeAgents || !ctl.timeAgents.length) {
                //we don't have any time agents which means we should get rid of the time manager control
                //we will automattically add the control back when a time layer is added via handlers on the
                //playback plugin or the application code if the playback toolbar was not build via the plugin
                ctl.map.removeControl(this.ctl);
                ctl.destroy();
                ctl = null;
            }
            else {
                var oldvals = {
                    start: ctl.range[0].getTime(),
                    end: ctl.range[1].getTime(),
                    resolution: {
                        units: ctl.units,
                        step: ctl.step
                    }
                };
                ctl.guessPlaybackRate();
                if (ctl.range[0].getTime() != oldvals.start || ctl.range[1].getTime() != oldvals.end || ctl.units != oldvals.units || ctl.step != oldvals.step) {
                    this.reconfigureSlider(this.buildSliderValues());
                    if (this.playbackMode == 'ranged' || this.playbackMode == 'decay') {
                        this.control.incrementTime(this.control.rangeInterval, this.control.units);
                    }
                    this.setThumbStyles(this.slider);
                    this.fireEvent('rangemodified',this,ctl.range);
                }
            }
        });
    },
    buildSliderValues:function(){
      var indexMap = ['primary'],
      values = [this.control.currentTime.getTime()],
      min=this.control.range[0].getTime(),
      max=this.control.range[1].getTime(),
      then=new Date(min),interval;
      if(this.control.units){
          var step = parseFloat(then['getUTC' + this.control.units]()) + parseFloat(this.control.step);
          var stepTime = then['setUTC' + this.control.units](step);
          interval=stepTime - min;
      }else{
          interval = false;
      }
      if(this.dynamicRange){
        var rangeAdj = (min-max)*.1;
        values.push(min=min-rangeAdj,max=max+rangeAdj);
        indexMap[1]='minTime';
        indexMap[2]='maxTime'
      }
      if(this.playbackMode && this.playbackMode!='track'){
        values.push(min);
        indexMap[indexMap.length]='tail';
      }
      return {'values':values,'map':indexMap,'maxValue':max,'minValue':min,'interval':interval};
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
            if (slider.thumbs[i]) {
                slider.setValue(i, sliderInfo.values[i]);
            }else{
                slider.addThumb(sliderInfo.values[i]);
            }
        }
        //set format of slider based on the interval steps
        if(!sliderInfo.interval && this.control.intervals && this.control.intervals.length>2){
            sliderInfo.interval = Math.round((sliderInfo.maxValue-sliderInfo.minValue)/this.control.intervals.length);
        }
        this.setTimeFormat(this.guessTimeFormat(sliderInfo.interval));
    },
    setThumbStyles: function(slider){
        var tailIndex = slider.indexMap.indexOf('tail');
        if (slider.indexMap[1] == 'min') {
            slider.thumbs[1].el.addClass('x-slider-min-thumb');
            slider.thumbs[2].el.addClass('x-slider-max-thumb');
        }
        if (tailIndex > -1) {
            slider.thumbs[tailIndex].el.addClass('x-slider-tail-thumb');
            slider.thumbs[tailIndex].constrain = false;
            slider.thumbs[0].constrain = false;
        }
    },
    forwardToEnd: function(btn){
        var ctl = this.control;
        ctl.setTime(new Date(ctl.range[(ctl.step < 0) ? 0 : 1].getTime()));
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
    toggleOptionsWindow:function(btn,pressed){
        if(pressed && this.optionsWindow.hidden){
            if(!this.optionsWindow.optionsPanel.timeManager){
                this.optionsWindow.optionsPanel.timeManager = this.control;
                this.optionsWindow.optionsPanel.playbackToolbar = this;
            }
            this.optionsWindow.show()
        }
        else if(!pressed && !this.optionsWindow.hidden){
            this.optionsWindow.hide()
        }
    },
    updateTimeDisplay: function(){
        this.sliderTip.onSlide(this.slider,null,this.slider.thumbs[0]);
        this.sliderTip.el.alignTo(this.slider.el, 'b-t?', this.offsets);
    },
    onSliderChangeComplete: function(slider, value, thumb){
        var slideTime = new Date(value);
        //test if this is the main time slider
        switch (slider.indexMap[thumb.index]) {
            case 'primary':
                if (!this.control.snapToIntervals && this.control.units) {
                    this.control.setTime(slideTime);
                }
                else if (this.control.snapToIntervals && this.control.intervals.length) {
                    var targetIndex = Math.floor((slideTime - this.control.range[0]) / (this.control.range[1] - this.control.range[0]) * (this.control.intervals.length - 1));
                    this.control.setTime(this.control.intervals[targetIndex]);
                }
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
                //Purposely falling through from control units down to seconds to avoid repeating the conversion factors
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
                for (var i = 0, len = this.control.timeAgents.length; i < len; i++) {
                    this.control.timeAgents[i].rangeInterval = (slider.thumbs[0].value - value) / adj;
                }
        }
        if (this.restartPlayback) {
            this.restartPlayback=false;
            this.control.play();
        }
    },
    guessTimeFormat:function(increment){
        if (increment) {
            var resolution = this.smartIntervalFormat(increment).units;
            var format = this.timeFormat;
            switch (resolution) {
                case 'Minutes':
                    format = 'l, F d, Y g:i A';
                    break;
                case 'Hours':
                    format = 'l, F d, Y g A';
                    break;
                case 'Days':
                    format = 'l, F d, Y';
                    break;
                case 'Months':
                    format = 'F, Y';
                    break;
                case 'Years':
                    format = 'Y';
                    break;
            }
            return format;
        }
    },
    smartIntervalFormat:function(diff){
        var unitText, diffValue, absDiff=Math.abs(diff);
        if(absDiff<5e3){
            unitText='Seconds';
            diffValue=(Math.round(diff/1e2))/10;
        }
        else if(absDiff<35e5){
            unitText='Minutes';
            diffValue=(Math.round(diff/6e2))/10;
        }
        else if(absDiff<828e5){
            unitText='Hours';
            diffValue=(Math.round(diff/36e4))/10;
        }
        else if(absDiff<250e7){
            unitText='Days';
            diffValue=(Math.round(diff/864e4))/10;
        }
        else if(absDiff<311e8){
            unitText='Months';
            diffValue=(Math.round(diff/2628e5))/10;
        }else{
            unitText='Years';
            diffValue=(Math.round(diff/31536e5))/10;
        }
        return {units:unitText,value:diffValue};
    }
});

/** api: xtype = gxp_playbacktoolbar */
Ext.reg('gxp_playbacktoolbar', gxp.PlaybackToolbar);
