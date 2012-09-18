/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/form/GoogleGeocoderComboBox.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GoogleGeocoder
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GoogleGeocoder(config)
 *
 *    Plugin for adding a GoogleGeocoderComboBox to a viewer.  The underlying
 *    GoogleGeocoderComboBox can be configured by setting this tool's 
 *    ``outputConfig`` property. The gxp.form.GoogleGeocoderComboBox requires 
 *    the gxp.plugins.GoogleSource or the Google Maps V3 API to be loaded.
 */
gxp.plugins.GoogleGeocoder = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_googlegeocoder */
    ptype: "gxp_googlegeocoder",

    init: function(target) {

        var combo = new gxp.form.GoogleGeocoderComboBox(this.outputConfig);
        
        var bounds = target.mapPanel.map.restrictedExtent;
        if (bounds && !combo.bounds) {
            target.on({
                ready: function() {
                    combo.bounds = bounds.clone().transform(
                        target.mapPanel.map.getProjectionObject(),
                        new OpenLayers.Projection("EPSG:4326")
                    );
                }
            });
        }
        this.combo = combo;
        
        return gxp.plugins.GoogleGeocoder.superclass.init.apply(this, arguments);

    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        return gxp.plugins.GoogleGeocoder.superclass.addOutput.call(this, this.combo);
    }

});

Ext.preg(gxp.plugins.GoogleGeocoder.prototype.ptype, gxp.plugins.GoogleGeocoder);
