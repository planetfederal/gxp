/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @include plugins/Playback.js
 */

/** api: (define)
 *  module = gxp
 *  class = WMSLayerPanel
 *  base_link = `Ext.TabPanel <http://extjs.com/deploy/dev/docs/?class=Ext.TabPanel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: WMSLayerPanel(config)
 *   
 *      Create a dialog for setting WMS layer properties like title, abstract,
 *      opacity, transparency and image format.
 */
gxp.PlaybackPanel = Ext.extend(Ext.Panel, {
    timeControl:null,
    closeAction:'hide',
    timeFormat:Date.patterns.FullDateTime,
    slider:true,
    dynamicRange:true,
    labelButtons:false,
    // api config : buttons 
    settingsButton:true,
    rateAdjuster:false,
    stepSelector:true,
    //i18n
    playLabel:'Play',
    playTooltip:'Play',
    stopLabel:'Play',
    stopTooltip:'Play',
    beginingLabel:'Play',
    beginingTooltip:'Play',
    fastforwardLabel:'Play',
    fastforwardTooltip:'Play',
    nextLabel:'Play',
    nextTooltip:'Play',
    resetLabel:'Play',
    resetTooltip:'Play',
    loopLabel:'Play',
    loopTooltip:'Loop'
