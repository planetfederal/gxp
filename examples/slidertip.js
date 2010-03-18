/**
 * Copyright (c) 2009-2010 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

var slider;

Ext.onReady(function() {

    slider = new Ext.Slider({
        renderTo: "slider",
        width: 200,
        values: [50],
        plugins: [new gxp.SliderTip({
            getText: function(slider) {
                return "Value: " + slider.getValue();
            }
        })]
    });

});
