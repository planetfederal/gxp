/**
 * Published under the GNU General Public License
 * Copyright 2011 © The President and Fellows of Harvard College
 */

/**
 * @requires plugins/FeedSource.js
 */

Ext.namespace("gxp.plugins");

/**
 *  Custom format for Picasa features
 */
OpenLayers.Format.Picasa = OpenLayers.Class(OpenLayers.Format.GeoRSS, {
    createFeatureFromItem: function(item) {
        var feature = OpenLayers.Format.GeoRSS.prototype
            .createFeatureFromItem.apply(this, arguments);
        feature.attributes.thumbnail = this.getElementsByTagNameNS(item, "http://search.yahoo.com/mrss/", "thumbnail")[0].getAttribute("url");
        feature.attributes.content = OpenLayers.Util.getXmlNodeValue(this.getElementsByTagNameNS(item, "*","summary")[0]);
        return feature;
    }
});

gxp.plugins.PicasaFeedSource = Ext.extend(gxp.plugins.FeedSource, {

    /** api: ptype = gxp_rsssource */
    ptype: "gx_picasasource",


    /** api: url
     * The URL of the Picasa feed
     */
   url: "http://picasaweb.google.com/data/feed/base/all?thumbsize=160c&",

    /** api:defaultFormat
     *  The default feature format for the feed source
     */
    defaultFormat: "OpenLayers.Format.Picasa",

    /** api:title
     * Title for source
     **/
    title: 'Picasa Source',

    /**
     * Create a Picasa layer record
     * @param config
     * @return GeoExt.data.LayerRecord
     */
    createLayerRecord: function(config) {
        if (Ext.isEmpty(config.params["max-results"])) {
            config.params["max-results"] = 50;
        }
        config.url = this.url;

        var record = gxp.plugins.PicasaFeedSource.superclass.createLayerRecord.apply(this, arguments);

        var layer = record.getLayer();

        //Prevent invalid bounds from being sent to Picasa
        layer.events.register("loadstart", layer, function(filter) {
            var bounds = layer.strategies[0].bounds;
            if (layer.strategies[0].bounds) {
                layer.strategies[0].bounds = new OpenLayers.Bounds(
                    Math.max(-180, layer.strategies[0].bounds.left),
                    Math.max(-90,layer.strategies[0].bounds.bottom),
                    Math.min(180, layer.strategies[0].bounds.right),
                    Math.min(90,layer.strategies[0].bounds.top));
            }
        });

        return record;
    },

    configureInfoPopup: function(layer) {
        layer.events.on({
            "featureselected": function(featureObject) {
                var feature = featureObject.feature;
                var pos = feature.geometry;

                if (this.target.selectControl.popup != null) {
                    this.target.mapPanel.map.removePopup(this.target.selectControl.popup);
                }

                var content = document.createElement("div");
                content.innerHTML = feature.attributes.content;
                this.target.selectControl.popup = new OpenLayers.Popup("popup",
                    new OpenLayers.LonLat(pos.x, pos.y),
                    new OpenLayers.Size(160,160),
                    "<a target='_blank' href=" +
                        content.getElementsByTagName('a')[0].getAttribute('href') +"><img title='" +
                        feature.attributes.title +"' src='" + feature.attributes.thumbnail +"' /></a>",
                    false);
                this.target.selectControl.popup.closeOnMove = true;
                this.target.selectControl.popup.keepInMap = true;
                this.target.mapPanel.map.addPopup(this.target.selectControl.popup);
            },

            "featureunselected" : function(featureObject) {
                this.target.mapPanel.map.removePopup(this.target.selectControl.popup);
                this.target.selectControl.popup = null;
            },
            scope: this
        });
    },

    getStyleMap: function(config) {
        return new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({externalGraphic: "${thumbnail}", pointRadius: 14}),
            "select": new OpenLayers.Style({pointRadius: 20})
        });
    }

});

Ext.preg(gxp.plugins.PicasaFeedSource.prototype.ptype, gxp.plugins.PicasaFeedSource);