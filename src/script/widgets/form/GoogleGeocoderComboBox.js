/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires GeoExt/widgets/form/GeocoderComboBox.js
 */

/** api: (define)
 *  module = gxp.form
 *  class = GoogleGeocoderComboBox
 *  base_link = `GeoExt.form.GeocoderComboBox <http://dev.geoext.org/docs/lib/GeoExt/widgets/form/GeocoderComboBox.html>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: GoogleGeocoderComboBox(config)
 *
 *  Creates a combo box that issues queries to the Google Maps geocoding service.
 *  If the user enters a valid address in the search box, the combo's store
 *  will be populated with records that match the address.  Records have the 
 *  following fields:
 *  
 *  * address - ``String`` The formatted address.
 *  * location - ``OpenLayers.LonLat`` Location matching address.
 *  * viewport - ``OpenLayers.Bounds`` Recommended viewing bounds.
 *
 */   
gxp.form.GoogleGeocoderComboBox = Ext.extend(GeoExt.form.GeocoderComboBox, {
    
    /** api: xtype = gxp_googlegeocodercombo */
    xtype: "gxp_googlegeocodercombo",

    /** api: config[bounds]
     *  ``OpenLayers.Bounds | Array`` Optional bounds (in geographic coordinates)
     *  for restricting search.
     */
    
    /** api: config[valueField]
     *  ``String``
     *  Field from selected record to use when the combo's ``getValue`` method
     *  is called.  Default is "location".  Possible values are "location",
     *  "viewport", or "address".  The location value will be an ``Array`` with 2
     *  items that corresponds to the geocoded address.
     *  The viewport value will be an ``Array`` with 4 values that is 
     *  the recommended viewport for viewing the resulting location. The
     *  address value will be a string that is the formatted address. If
     *  valueField is set to "location" or "viewport" the map will center / 
     *  zoom when an item from the combobox is selected. If valueField is set 
     *  to "address" instead, no zooming will occur.
     */
    valueField: "location",

    /** private: config[displayField]
     */
    displayField: "address",

    /** private: config[locationField]
     */
    locationField: "location",

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {
        
        // only enable when Google Maps API is available
        this.disabled = true;
        var ready = !!(window.google && google.maps);
        if (!ready) {
            if (!gxp.plugins || !gxp.plugins.GoogleSource) {
                throw new Error("The gxp.form.GoogleGeocoderComboBox requires the gxp.plugins.GoogleSource or the Google Maps V3 API to be loaded.");
            }
            gxp.plugins.GoogleSource.loader.onLoad({
                callback: this.prepGeocoder,
                errback: function() {
                    throw new Error("The Google Maps script failed to load within the given timeout.");
                },
                scope: this
            });
        } else {
            // call in the next turn to complete initialization
            window.setTimeout((function() {
                this.prepGeocoder();
            }).createDelegate(this), 0);
        }

        var me = this;

        this.store = new Ext.data.JsonStore({
            root: null,
            fields: [
                {name: "address", mapping: "formatted_address"},
                {name: "location", convert: function(v, rec) {
                    var latLng = rec.geometry.location;
                    return [latLng.lng(), latLng.lat()];
                }},
                {name: "viewport", convert: function(v, rec) {
                    var ne = rec.geometry.viewport.getNorthEast(),
                        sw = rec.geometry.viewport.getSouthWest();
                    return [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
                }}
            ],
            proxy: new (Ext.extend(Ext.data.DataProxy, {
                doRequest: function(action, rs, params, reader, callback, scope, options) {
                    var bounds = null;
                    if (me.bounds) {
                        var boundsArray = (me.bounds instanceof OpenLayers.Bounds) ?
                            me.bounds.toArray() : me.bounds;
                        bounds = new google.maps.LatLngBounds(
                            new google.maps.LatLng(boundsArray[1], boundsArray[0]),
                            new google.maps.LatLng(boundsArray[3], boundsArray[2])
                        );
                    }
                    me.geocoder.geocode({address: params.q, bounds: bounds}, function(results, status) {
                        var readerResult = reader.readRecords(results);
                        callback.call(scope, readerResult, options, !!readerResult);
                    });
                }
            }))({api: {read: true}})
        });

        return gxp.form.GoogleGeocoderComboBox.superclass.initComponent.apply(this, arguments);

    },
    
    /** private: method[prepGeocoder]
     */
    prepGeocoder: function() {
        this.geocoder = new google.maps.Geocoder();
        if (this.initialConfig.disabled != true) {
            this.enable();
        }
    }

});

Ext.reg(gxp.form.GoogleGeocoderComboBox.prototype.xtype, gxp.form.GoogleGeocoderComboBox);
