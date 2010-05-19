/**
 * Copyright (c) 2008-2010 The Open Planning Project
 */

Ext.namespace("gxp.slider");

/**
 * See http://trac.geoext.org/ticket/262
 *
 * This tip matches the Ext.slider.Tip but addes the hover functionality.
 */
gxp.slider.Tip = Ext.extend(Ext.slider.Tip, {

    /** api: config[hover]
     *  ``Boolean`` Display the tip when hovering over a thumb.  If false, tip
     *     will only be displayed while dragging.  Default is true.
     */
    hover: true,
    
    /** private: property[dragging]
     * ``Boolean`` A thumb is currently being dragged.
     */
    dragging: false,

    /** private: method[init]
     *  :param slider: ``Object``
     */
    init: function(slider) {
        if(this.hover) {
            slider.on("render", this.registerThumbListeners, this);
        }
        this.slider = slider;
        gxp.slider.Tip.superclass.init.apply(this, arguments);
    },
    
    /** private: method[registerThumbListeners]
     */
    registerThumbListeners: function() {
        for(var i=0, len=this.slider.thumbs.length; i<len; ++i) {
            this.slider.thumbs[i].el.on({
                "mouseover": this.createHoverListener(i),
                "mouseout": function() {
                    if(!this.dragging) {
                        this.hide.apply(this, arguments);
                    }
                },
                scope: this
            });
        }
    },
    
    /** private: method[createHoverListener]
     */
    createHoverListener: function(index) {
        return (function() {
            this.onSlide(this.slider, {}, this.slider.thumbs[index]);
            this.dragging = false;
        }).createDelegate(this);
    },

    /** private: method[onSlide]
     */
    onSlide: function(slider, e, thumb) {
        this.dragging = true;
        gxp.slider.Tip.superclass.onSlide.apply(this, arguments);
    }

});
