/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.form
 *  class = ColorComboBox
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: ColorComboBox(config)
 *   
 *      A combobox field that colors its own background based on the input value.
 *      The value may be any one of the 16 W3C supported CSS color names
 *      (http://www.w3.org/TR/css3-color/).  The value can also be an arbitrary
 *      RGB hex value prefixed by a '#' (e.g. '#FFCC66').
 */
gxp.form.ColorComboBox = Ext.extend(Ext.form.ComboBox,  {

    mode: 'local',
    triggerAction: 'all',        

    store: [
        ["#00FFFF", "aqua"],
        ["#000000", "black"],
        ["#0000FF", "blue"],
        ["#FF00FF", "fuchsia"],
        ["#808080", "gray"],
        ["#008000", "green"],
        ["#00FF00", "lime"],
        ["#800000", "maroon"],
        ["#000080", "navy"],
        ["#808000", "olive"],
        ["#800080", "purple"],
        ["#FF0000", "red"],
        ["#C0C0C0", "silver"],
        ["#008080", "teal"],
        ["#FFFFFF", "white"],
        ["#FFFF00", "yellow"]
    ],
    
    /** api: config[defaultBackground]
     *  The default background color if the symbolizer has no fillColor set.
     *  Defaults to #ffffff.
     */
    defaultBackground: "#ffffff",

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {
        gxp.form.ColorComboBox.superclass.initComponent.call(this);

        // Add the updateBackground listener to color the field.
        this.on({
            render: this.updateBackground,
            select: this.updateBackground,
            scope: this
        });
        
    },
    
    /** private: method[isDark]
     *  :arg hex: ``String`` A RGB hex color string (prefixed by '#').
     *  :returns: ``Boolean`` The color is dark.
     *  
     *  Determine if a color is dark by avaluating brightness according to the
     *  W3C suggested algorithm for calculating brightness of screen colors.
     *  http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
     */
    isDark: function(hex) {
        var dark = false;
        if(hex) {
            // convert hex color values to decimal
            var r = parseInt(hex.substring(1, 3), 16) / 255;
            var g = parseInt(hex.substring(3, 5), 16) / 255;
            var b = parseInt(hex.substring(5, 7), 16) / 255;
            // use w3C brightness measure
            var brightness = (r * 0.299) + (g * 0.587) + (b * 0.144);
            dark = brightness < 0.5;
        }
        return dark;
    },
    
    /** private: method[updateBackground]
     *  Set the background and font color for the field.
     */
    updateBackground: function() {
        var color = this.getValue() || this.defaultBackground; 
        this.getEl().setStyle({
            "background": color,
            "color": this.isDark(color) ? "#ffffff" : "#000000"
        });
    }
});

Ext.reg("gxp_colorcombo", gxp.form.ColorComboBox);
