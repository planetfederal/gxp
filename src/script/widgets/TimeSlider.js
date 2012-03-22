/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires OpenLayers/Control/TimeManager.js
 * @requires OpenLayers/TimeAgent.js
 */

/** api: (define)
 *  module = gxp
 *  class = TimeSlider
 *  base_link = `Ext.slider.MultiSlider <http://dev.sencha.com/deploy/dev/docs/?class=Ext.slider.MultiSlider>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: TimeSlider(config)
 *   
 *      Create a multi-slider for displaying and controling time playback animations 
 */
gxp.TimeSlider = Ext.extend(Ext.slider.MultiSlider, {
    
});

/** api: xtype = gxp_timeslider */
Ext.reg('gxp_timeslider', gxp.TimeSlider);    