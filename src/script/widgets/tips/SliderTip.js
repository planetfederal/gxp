/**
 * Copyright (c) 2008-2010 The Open Planning Project
 */


Ext.namespace("gxp");

gxp.SliderTip = Ext.extend(Ext.Tip, {

    /** api: config[hover]
     *  ``Boolean``
     *  Display the tip when hovering over the thumb.  If ``false``, tip
     *  will only be displayed while dragging.  Default is ``true``.
     */
    hover: true,
    
    /** private: property[dragging]
     *  ``Boolean``
     *  The thumb is currently being dragged.
     */
    dragging: false,

    minWidth: 10,

    minWidth: 10,

    offsets : [0, -10],

    init: function(slider){
        slider.on('dragstart', this.onSlide, this);
        slider.on('drag', this.onSlide, this);
        slider.on('dragend', this.hide, this);
        slider.on('destroy', this.destroy, this);
        if(this.hover) {
            slider.on('render', this.registerThumbListeners, this);
        }
        this.slider = slider;
    },

    /** api: method[getText]
     *  :arg slider: ``Ext.slider.SingleSlider``
     *  :returns: ``String`` The tip text.
     *
     *  This method can be overridden to customize the tip text.  The default
     *  tip text is the slider value.
     */
    getText : function(slider) {
        return slider.getValue();
    },

    registerThumbListeners: function() {
        var el = this.slider.thumb || this.slider.thumbs[0].tracker.el;
        el.on({
            "mouseover": function() {
                this.onSlide(this.slider);
                this.dragging = false;
            },
            "mouseout": function() {
                if(!this.dragging) {
                    this.hide.apply(this, arguments);
                }
            },
            scope: this
        });
    },

    onSlide : function(slider) {
        this.dragging = true;
        this.show();
        this.body.update(this.getText(slider));
        this.doAutoWidth();
        var el = slider.thumb || slider.thumbs[0].tracker.el;
        this.el.alignTo(el, 'b-t?', this.offsets);
    }

});
