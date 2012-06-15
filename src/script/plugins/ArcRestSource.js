/**
 * Created by
 * User: mbertrand
 * Date: 6/13/11
 * Time: 8:16 AM
 *
 */


/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ArcRestSource(config)
 *
 *    Plugin for using ArcGIS REST layers with :class:`gxp.Viewer` instances.
 *
 */

gxp.plugins.ArcRestSource = Ext.extend(gxp.plugins.LayerSource, {

    /** api: ptype = gxp_arcrestsource */
    ptype: "gxp_arcrestsource",

    constructor: function(config) {
        this.config = config;
        gxp.plugins.ArcRestSource.superclass.constructor.apply(this, arguments);
    },



    /** private: method[createStore]
     *
     *  Creates a store of layers.  This requires that the API script has already
     *  loaded.  Fires the "ready" event when the store is loaded.
     */
    createStore: function() {
        var baseUrl = this.url.split("?")[0];
        var source = this;

        var processResult = function(response) {
            var json = Ext.decode(response.responseText);

            var layerProjection = source.getArcProjection(json.spatialReference.wkid);

            var layers = [];
            if (layerProjection != null) {
                for (var l = 0; l < json.layers.length; l++) {
                    var layer = json.layers[l];
                    var layerShow = "show:" + layer.id;
                    layers.push(new OpenLayers.Layer.ArcGIS93Rest(layer.name, baseUrl + "/export",
                        {
                            layers: layerShow,
                            TRANSPARENT: true
                        },
                        {
                            isBaseLayer: false,
                            displayInLayerSwitcher: true,
                            visibility: true,
                            projection: layerProjection,
                            queryable: json.capabilities && json.capabilities.contains("Identify")}
                    ));
                }
            } else {
                processFailure(response);
            }

            source.title = json.documentInfo.Title;

            source.store = new GeoExt.data.LayerStore({
                layers: layers,
                fields: [
                    {name: "source", type: "string"},
                    {name: "name", type: "string", mapping: "name"},
                    {name: "group", type: "string", defaultValue: this.title},
                    {name: "fixed", type: "boolean", defaultValue: true},
                    {name: "queryable", type: "boolean", defaultValue: true},
                    {name: "selected", type: "boolean"}
                ]
            });


            source.fireEvent("ready", source);
        };

        var processFailure = function(response) {
            Ext.Msg.alert("No Layers", "Could not find any layers in a compatible projection");
        };


        /**
         *  Send a 'keepPostParams' parameter notifying GeoExplorer to not delete
         *  post body contents from request (it's normal behavior), because many
         *  ArcGIS REST servers won't accept empty POST body contents.
         */
        Ext.Ajax.request({
            url: baseUrl,
            params: {'f' : 'json', 'pretty' : 'false', 'keepPostParams' : 'true'},
            method: 'POST',
            success: processResult,
            failure: processFailure
        });
    },



    /** api: method[getConfigForRecord]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :returns: ``Object``
     *
     *  Create a config object that can be used to recreate the given record.
     */
    createLayerRecord: function(config) {
        var record;
        var cmp = function(l) {
            return l.get("name") === config.name;
        };
        // only return layer if app does not have it already
        if (this.target.mapPanel.layers.findBy(cmp) == -1) {
            // records can be in only one store
            record = this.store.getAt(this.store.findBy(cmp)).clone();
            var layer = record.getLayer();
            // set layer title from config
            if (config.title) {
                layer.setName(config.title);
                record.set("title", config.title);
            }
            // set visibility from config
            if ("visibility" in config) {
                layer.visibility = config.visibility;
            }

            if ("opacity" in config) {
                layer.opacity = config.opacity
            }

            record.set("selected", config.selected || false);
            record.set("queryable", config.queryable || true)
            record.set("source", config.source);
            record.set("name", config.name);
            record.set("properties", "gxp_wmslayerpanel");
            if ("group" in config) {
                record.set("group", config.group);
            }
            record.commit();
        }
        return record;
    },



    /** api: method[getProjection]
     *  :arg layerRecord: ``GeoExt.data.LayerRecord`` a record from this
     *      source's store
     *  :returns: ``OpenLayers.Projection`` A suitable projection for the
     *      ``layerRecord``. If the layer is available in the map projection,
     *      the map projection will be returned. Otherwise an equal projection,
     *      or null if none is available.
     *
     *  Get the projection that the source will use for the layer created in
     *  ``createLayerRecord``. If the layer is not available in a projection
     *  that fits the map projection, null will be returned.
     */
    getArcProjection: function(srs) {
        var projection = this.getMapProjection();
        var compatibleProjection = projection;
        var layerSRS = "EPSG:" + srs + '';
        if (layerSRS !== projection.getCode()) {
            compatibleProjection = null;
            if ((p = new OpenLayers.Projection(layerSRS)).equals(projection)) {
                compatibleProjection = p;
            }
        }
        return compatibleProjection;
    }


});

Ext.preg(gxp.plugins.ArcRestSource.prototype.ptype, gxp.plugins.ArcRestSource);
