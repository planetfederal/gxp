/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = PolygonSymbolizer
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: PolygonSymbolizer(config)
 *   
 *      Form for configuring a polygon symbolizer. This form only deals with
 *      properties at the level of the symbolizer itself, not with properties
 *      of its children Fill and Stroke. Currently there are no properties at
 *      this level so this means it's just an empty container.
 */
gxp.PolygonSymbolizer = Ext.extend(Ext.Panel, {

    /** api: config[symbolizer]
     *  ``Object``
     *  A symbolizer object that will be used to fill in form values.
     *  This object will be modified when values change.  Clone first if
     *  you do not want your symbolizer modified.
     */
    symbolizer: null,

    initComponent: function() {
        
        this.addEvents(
            /**
             * Event: change
             * Fires before any field blurs if the field value has changed.
             *
             * Listener arguments:
             * symbolizer - {Object} A symbolizer with stroke related properties
             *     updated.
             */
            "change"
        ); 

        gxp.PolygonSymbolizer.superclass.initComponent.call(this);

    }
    
    
});

/** api: xtype = gxp_polygonsymbolizer */
Ext.reg('gxp_polygonsymbolizer', gxp.PolygonSymbolizer);
