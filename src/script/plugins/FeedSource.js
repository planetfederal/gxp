/**
 * Published under the GNU General Public License
 * Copyright 2011 © The President and Fellows of Harvard College
 */

/**
 * @requires plugins/LayerSource.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.FeedSource = Ext.extend(gxp.plugins.LayerSource, {

    /** api: ptype = gxp_feedsource */
    ptype: "gx_feedsource",


    /** Title for source **/
    title: 'Feed Source',

    /** Default format of vector layer **/
    defaultFormat: "OpenLayers.Format.GeoRSS",


    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        var record;

        //create a vector layer based on config parameters
        var layer = new OpenLayers.Layer.Vector(config.name, {
            projection: "projection" in config ? config.projection : "EPSG:4326",
            visibility: "visibility" in config ? config.visibility : true,
            strategies: [new OpenLayers.Strategy.BBOX({resFactor: 1, ratio: 1})],
            protocol: new OpenLayers.Protocol.HTTP({
                url: this.url,
                params: config.params,
                format: this.getFormat(config)
            }),
            styleMap: this.getStyleMap(config)
        });

        layer.events.register("added", this, function() {
            //Create a SelectFeature control & add layer to it.
            if (this.target.selectControl == null) {
                this.target.selectControl = new OpenLayers.Control.SelectFeature(layer, {
                    clickout: true,
                    listeners: {
                        'clickoutFeature': function () {
                        }
                    },
                    scope: this
                });

                this.target.mapPanel.map.addControl(this.target.selectControl);

            } else {
                var currentLayers = this.target.selectControl.layers ? this.target.selectControl.layers :
                    (this.target.selectControl.layer ? [this.target.selectControl.layer] : []);
                currentLayers.push(layer);
                this.target.selectControl.setLayer(currentLayers);
            }
        },
       this
    );

        //configure the popup balloons for feed items
        this.configureInfoPopup(layer);

        // create a layer record for this layer
        var Record = GeoExt.data.LayerRecord.create([
            //{name: "title", type: "string"},
            {name: "name", type: "string"},
            {name: "source", type: "string"},
            {name: "group", type: "string"},
            {name: "fixed", type: "boolean"},
            {name: "selected", type: "boolean"},
            {name: "visibility", type: "boolean"},
            {name: "format", type: "string"},
            {name: "defaultStyle"},
            {name: "selectStyle"},
            {name: "params"}
        ]);



        var data = {
            layer: layer,
            //title: config.name,
            name: config.name,
            source: config.source,
            group: config.group,
            fixed: ("fixed" in config) ? config.fixed : false,
            selected: ("selected" in config) ? config.selected : false,
            params: ("params" in config) ? config.params : {},
            visibility: ("visibility" in config) ? config.visibility : false,
           format: ("format" in config) ? config.format : this.defaultFormat,
            defaultStyle: ("defaultStyle" in config) ? config.defaultStyle : {},
            selectStyle: ("selectStyle" in config) ? config.selectStyle : {}
        };


        record = new Record(data, layer.id);
        return record;

    },


    /** api: method[getConfigForRecord]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :returns: ``Object``
     *
     *  Create a config object that can be used to recreate the given record.
     */
    getConfigForRecord: function(record) {
        // get general config
        var config = gxp.plugins.FeedSource.superclass.getConfigForRecord.apply(this, arguments);
        // add config specific to this source
        return Ext.apply(config, {
            //title: record.get("name"),
            name: record.get("name"),
            group: record.get("group"),
            fixed: record.get("fixed"),
            selected: record.get("selected"),
            params: record.get("params"),
            visibility: record.getLayer().getVisibility(),
            format: record.get("format"),
            defaultStyle: record.getLayer().styleMap["styles"]["default"]["defaultStyle"],
            selectStyle: record.getLayer().styleMap["styles"]["select"]["defaultStyle"]
        });
    },

    /* api: method[getFormat]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``OpenLayers.Format``
     * Create an instance of the layer's format class and return it
     */
    getFormat: function (config) {
        // get class based on rssFormat in config
        var Class = window;
        var formatConfig = ("rssFormat" in config) ? config.rssFormat : this.defaultFormat;

        var parts = formatConfig.split(".");
        for (var i=0, ii=parts.length; i<ii; ++i) {
            Class = Class[parts[i]];
            if (!Class) {
                break;
            }
        }

        // TODO: consider static method on OL classes to construct instance with args
        if (Class && Class.prototype && Class.prototype.initialize) {

            // create a constructor for the given layer format
            var Constructor = function() {
                // this only works for args that can be serialized as JSON
                Class.prototype.initialize.apply(this);
            };
            Constructor.prototype = Class.prototype;

            // create a new layer given format
            var format = new Constructor();
            return format;
        }
    },

    /* api: method[getStyleMap]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``OpenLayers.StyleMap``
     * Return a style map containing default and select styles
     */
    getStyleMap: function(config) {
        return new OpenLayers.StyleMap({
            "default": new OpenLayers.Style("defaultStyle" in config ? config.defaultStyle : {graphicName: "circle", pointRadius: 5, fillOpacity: 0.7, fillColor: 'Red'}),
            "select": new OpenLayers.Style("selectStyle" in config ? config.selectStyle : {graphicName: "circle", pointRadius: 10, fillOpacity: 1.0, fillColor: "Yellow"})
        })
    },

    /* api: method[configureInfoPopup]
     *  :arg config:  ``Object``  The vector layer
     * Configure a popup to display information on selected feed item.
     */
    configureInfoPopup: function(layer) {
        layer.events.on({
            "featureselected": function(featureObject) {
                var feature = featureObject.feature;
                var pos = feature.geometry;
                if (this.target.selectControl.popup) {
                    this.target.mapPanel.map.removePopup(this.target.selectControl.popup);
                }
                this.target.selectControl.popup = new OpenLayers.Popup.FramedCloud("popup",
                    feature.geometry.getBounds().getCenterLonLat(),
                    new OpenLayers.Size(300,300),
                    "<a target='_blank' href=\"" +
                        feature.attributes.link + "\">" +  feature.attributes.title +"</a><p>"+ feature.attributes.description + "</p>",
                    null, true);
                this.target.selectControl.popup.closeOnMove = true;
                this.target.selectControl.popup.keepInMap = true;
                this.target.selectControl.popup.panMapIfOutOfView = false;
                this.target.selectControl.popup.autoSize = true;
                this.target.mapPanel.map.addPopup(this.target.selectControl.popup);
            },

            "featureunselected" : function() {
                this.target.mapPanel.map.removePopup(this.target.selectControl.popup);
                this.target.selectControl.popup = null;
            },

            "moveend" :  function(rec) {
                if (this.target.selectControl) {
                    this.target.selectControl.popup = null;
                }
            },
            "removed":  this.removeFromSelectControl,
            scope: this
        });
    },


    /**
     * Remove a feed layer from the SelectFeatureControl (if present) when that layer is removed from the map.
     * If this is not done, the layer will remain on the map even after the record is deleted.
     * @param record
     */
    removeFromSelectControl:  function(record){
        if (this.target.selectControl ) {
            var recordLayer = record.layer;
            //SelectControl might have layers array or single layer object
            if (this.target.selectControl.layers != null){
                for (var x = 0; x < this.target.selectControl.layers.length; x++)
                {
                    var selectLayer = this.target.selectControl.layers[x];
                    var selectLayers = this.target.selectControl.layers;
                    if (selectLayer.id === recordLayer.id) {
                        selectLayers.splice(x,1);
                        this.target.selectControl.setLayer(selectLayers);
                    }
                }
            }
            if (this.target.selectControl.layer != null) {
                if (recordLayer.id === this.target.selectControl.layer.id) {
                    this.target.selectControl.setLayer([]);
                }
            }
        }
    }

});
Ext.preg(gxp.plugins.FeedSource.prototype.ptype, gxp.plugins.FeedSource);