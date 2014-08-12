/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires util.js
 * @requires plugins/LayerSource.js
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/Format/WFSCapabilities/v1_0_0.js
 * @requires OpenLayers/Format/WFSCapabilities/v1_1_0.js
 * @requires OpenLayers/Protocol/WFS/v1_1_0.js
 * @requires GeoExt/data/WFSCapabilitiesReader.js
 * @requires GeoExt/data/WFSCapabilitiesStore.js
 * @requires GeoExt/data/AttributeReader.js
 * @requires GeoExt/data/AttributeStore.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WFSSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WFSSource(config)
 *
 *    Plugin for using WFS layers with :class:`gxp.Viewer` instances. The
 *    plugin issues a GetCapabilities request to create a store of the WFS's
 *    layers.
 */
/** api: example
 *  Configuration in the  :class:`gxp.Viewer`:
 *
 *  .. code-block:: javascript
 *
 *    defaultSourceType: "gxp_wfssource",
 *    sources: {
 *        "opengeo": {
 *            url: "http://suite.opengeo.org/geoserver/wfs"
 *        }
 *    }
 *
 *  A typical configuration for a layer from this source (in the ``layers``
 *  array of the viewer's ``map`` config option would look like this:
 *
 *  .. code-block:: javascript
 *
 *    {
 *        source: "opengeo",
 *        name: "world",
 *        group: "background"
 *    }
 *
 * An optional 'getFeatureInfo' property can also be passed to
 * customize the sort order, visibility, & labels for layer attributes.
 * A sample 'getFeatureInfo' configuration would look like this:
 *
 *  .. code-block:: javascript
 *
 *    {
 *        fields: ["twn_name","pop1990"]
 *        propertyNames: {"pop1990": "1990 Population",  "twn_name": "Town"}
 *    }
 *
 *  Within the 'getFeatureInfo' configuration, the 'fields' property determines sort
 *  order & visibility (any attributes not included are not displayed) and
 *  'propertyNames'  specifies the labels for the attributes.
 *
 *  For initial programmatic layer configurations, to leverage lazy loading of
 *  the Capabilities document, it is recommended to configure layers with the
 *  fields listed in :obj:`requiredProperties`.
 */
gxp.plugins.WFSSource = Ext.extend(gxp.plugins.LayerSource, {

    /** api: ptype = gxp_wfssource */
    ptype: "gxp_wfssource",

    /** api: config[url]
     *  ``String`` WFS service URL for this source
     */

    /** private: config[restUrl]
     *  ``String`` Optional URL for rest configuration endpoint.  Note that this
     *  property is being added for a specific GeoNode case and it may be
     *  removed if an alternate solution is chosen (like a specific
     *  GeoNodeSource).  This is used where the rest config endpoint cannot
     *  be derived from the source url (e.g. source url "/geoserver" and rest
     *  config url "/other_rest_proxy").
     */

    /** api: config[baseParams]
     *  ``Object`` Base parameters to use on the WFS GetCapabilities
     *  request.
     */
    baseParams: null,

    /** private: property[format]
     *  ``OpenLayers.Format`` Optional custom format to use on the
     *  WFSCapabilitiesStore store instead of the default.
     */
    format: null,

    /** private: property[describeLayerStore]
     *  ``GeoExt.data.WFSDescribeLayerStore`` additional store of layer
     *  descriptions. Will only be available when the source is configured
     *  with ``describeLayers`` set to true.
     */
    describeLayerStore: null,

    /** private: property[describedLayers]
     */
    describedLayers: null,

    /** private: property[schemaCache]
     */
    schemaCache: null,

    /** private: property[ready]
     *  ``Boolean``
     */
    ready: false,

    /** api: config[version]
     *  ``String``
     *  If specified, the version string will be included in WFS GetCapabilities
     *  requests.  By default, no version 1.1.0 (JvdB, to ensure some MD works and no axis ordering issues) is set.
     */
    version: "1.1.0",

    /** api: config[requiredProperties]
     *  ``Array(String)`` List of config properties that are required for each
     *  layer from this source to allow lazy loading, in addition to ``name``.
     *  Default is ``["title", "bbox"]``. When the source loads layers from a
     *  WFS that does not provide layers in all projections, ``srs`` should be
     *  included in this list. Fallback values are available for ``title`` (the
     *  WFS layer name), ``bbox`` (the map's ``maxExtent`` as array), and
     *  ``srs`` (the map's ``projection``, e.g. "EPSG:4326").
     */

    /** api: property[requiredProperties]
     *  ``Array(String)`` List of config properties that are required for a
     *  complete layer configuration, in addition to ``name``.
     */
    requiredProperties: ["title", "bbox"],

    /** api: config[owsPreviewStrategies]
     *  ``Array``
     *  String array with the order of strategies to obtain preview images for OWS services, default is ['attributionlogo', 'randomcolor'].
     */
    owsPreviewStrategies: ['randomcolor'],

    /** api: config[defaultSrs]
     *  ``String``
      *  String specifying the default SRS for a WFS layer if it does not map the map projection, use Layer SRS if null.
      */
    defaultSrs: 'EPSG:4326',

    /** private: method[constructor]
     */
    constructor: function (config) {
        // deal with deprecated forceLazy config option
        //TODO remove this before we cut a release
        if (config && config.forceLazy === true) {
            config.requiredProperties = [];
            delete config.forceLazy;
            if (window.console) {
                console.warn("Deprecated config option 'forceLazy: true' for layer source '" +
                    config.id + "'. Use 'requiredProperties: []' instead.");
            }
        }
        gxp.plugins.WFSSource.superclass.constructor.apply(this, arguments);
        if (!this.format) {
            this.format = new OpenLayers.Format.WFSCapabilities({keepData: true});
        }
    },

    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function (target) {
        gxp.plugins.WFSSource.superclass.init.apply(this, arguments);
        this.target.on("authorizationchange", this.onAuthorizationChange, this);
    },

    /** api: method[getPreviewImageURL]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :arg width: :Number:image width
     *  :arg height: :Number:image height
     *  :returns: ``String``
     *
     *  Create a preview image URL or encoded image for given record.
     */
    getPreviewImageURL: function (record, width, height) {
        // For now we only support a random color, or no preview image
        if (this.owsPreviewStrategies.indexOf('randomcolor') == -1) {
            return null;
        }


        // Generate functions for encoded CSS image
        // we generate a 1-pixel GIF with a random color
        // See http://micheljansen.org/blog/entry/1238
        function encodeColor(color) {
            // TODO: make more efficient!!
            var rHex = '0x' + color.charAt(1) + color.charAt(2);
            var gHex = '0x' + color.charAt(3) + color.charAt(4);
            var bHex = '0x' + color.charAt(5) + color.charAt(6);
            return encodeRGB(rHex, gHex, bHex)
        }

        function encodeRGB(r, g, b) {
            return encode_triplet(0, r, g) + encode_triplet(b, 255, 255);
        }

        function encode_triplet(e1, e2, e3) {
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var enc1 = e1 >> 2;
            var enc2 = ((e1 & 3) << 4) | (e2 >> 4);
            var enc3 = ((e2 & 15) << 2) | (e3 >> 6);
            var enc4 = e3 & 63;
            return keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }

        // Generate a random color (thanks to Mark Prins) - not working in IE8...
        // var colour = '#' + Math.round(0xffffff * Math.random()).toString(16);
        
        // better (IE compat): http://www.paulirish.com/2009/random-hex-color-code-snippets/
        var colour = '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);

        // Save color in record to generate StyleMap later
        record.data.colour = colour;
        // Red pixel test
        // return 'data:image/gif;base64,R0lGODlhAQABAPAA' +  'AP8AAP//' + '/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
        return 'data:image/gif;base64,R0lGODlhAQABAPAA' + encodeColor(colour) + '/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
    },

    /** private: method[onAuthorizationChange]
     *  Reload the store when the authorization changes.
     */
    onAuthorizationChange: function () {
        if (this.store && this.url.charAt(0) === "/") {
            var lastOptions = this.store.lastOptions || {params: {}};
            Ext.apply(lastOptions.params, {
                '_dc': Math.random()
            });
            this.store.reload(lastOptions);
        }
    },

    /** private: method[destroy]
     */
    destroy: function () {
        this.target.un("authorizationchange", this.onAuthorizationChange, this);
        gxp.plugins.WFSSource.superclass.destroy.apply(this, arguments);
    },

    /** private: method[isLazy]
     *  :returns: ``Boolean``
     *
     *  The store for a lazy source will not be loaded upon creation.  A source
     *  determines whether or not it is lazy given the configured layers for
     *  the target.  If the layer configs have all the information needed to
     *  construct layer records, the source can be lazy.
     */
    isLazy: function () {
        var lazy = true;
        var mapConfig = this.target.initialConfig.map;
        if (mapConfig && mapConfig.layers) {
            var layerConfig;
            for (var i = 0, ii = mapConfig.layers.length; i < ii; ++i) {
                layerConfig = mapConfig.layers[i];
                if (layerConfig.source === this.id) {
                    lazy = this.layerConfigComplete(layerConfig);
                    if (lazy === false) {
                        break;
                    }
                }
            }
        }
        return lazy;
    },

    /** private: method[layerConfigComplete]
     *  :returns: ``Boolean``
     *
     *  A layer configuration is considered complete if it has a title and a
     *  bbox.
     */
    layerConfigComplete: function (config) {
        var lazy = true;
        if (!Ext.isObject(config.capability)) {
            var props = this.requiredProperties;
            for (var i = props.length - 1; i >= 0; --i) {
                lazy = !!config[props[i]];
                if (lazy === false) {
                    break;
                }
            }
        }
        return lazy;
    },

    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function () {
        var baseParams = this.baseParams || {
            SERVICE: "WFS",
            REQUEST: "GetCapabilities"
        };
        if (this.version) {
            baseParams.VERSION = this.version;
        }

        var lazy = false; // this.isLazy();

        this.store = new GeoExt.data.WFSCapabilitiesStore({
            // Since we want our parameters (e.g. VERSION) to override any in the
            // given URL, we need to remove corresponding paramters from the
            // provided URL.  Simply setting baseParams on the store is also not
            // enough because Ext just tacks these parameters on to the URL - so
            // we get requests like ?Request=GetCapabilities&REQUEST=GetCapabilities
            // (assuming the user provides a URL with a Request parameter in it).
            url: this.trimUrl(this.url, baseParams),
            baseParams: baseParams,
            format: this.format,
            autoLoad: !lazy,
            listeners: {
                load: function () {
                    // The load event is fired even if a bogus capabilities doc
                    // is read (http://trac.geoext.org/ticket/295).
                    // Until this changes, we duck type a bad capabilities
                    // object and fire failure if found.
                    if (!this.store.reader.raw || !(this.store.reader.raw.service || this.store.reader.raw.serviceIdentification)) {
                        this.fireEvent("failure", this, "Invalid capabilities document.");
                    } else {
                        this.serviceTitle = this.store.reader.raw.service ? this.store.reader.raw.service.title : this.store.reader.raw.serviceIdentification.title;
                        if (!this.title || this.title.length == 0) {
                            this.title = this.serviceTitle;
                        }
                        if (!this.ready) {
                            this.ready = true;
                            this.fireEvent("ready", this);
                        } else {
                            this.lazy = false;
                            //TODO Here we could update all records from this
                            // source on the map that were added when the
                            // source was lazy.
                        }
                    }
                    // clean up data stored on format after parsing is complete
                    delete this.format.data;
                },
                exception: function (proxy, type, action, options, response, error) {
                    delete this.store;
                    var msg, details = "";
                    if (type === "response") {
                        if (typeof error == "string") {
                            msg = error;
                        } else {
                            msg = "Invalid response from server.";
                            // special error handling in IE
                            var data = this.format && this.format.data;
                            if (data && data.parseError) {
                                msg += "  " + data.parseError.reason + " - line: " + data.parseError.line;
                            }
                            var status = response.status;
                            if (status >= 200 && status < 300) {
                                // TODO: consider pushing this into GeoExt
                                var report = error && error.arg && error.arg.exceptionReport;
                                details = gxp.util.getOGCExceptionText(report);
                            } else {
                                details = "Status: " + status;
                            }
                        }
                    } else {
                        msg = "Trouble creating layer store from response.";
                        details = "Unable to handle response.";
                    }
                    // TODO: decide on signature for failure listeners
                    this.fireEvent("failure", this, msg, details);

                    // clean up data stored on format after parsing is complete
                    delete this.format.data;
                },
                scope: this
            }
        });
        if (lazy) {
            this.lazy = lazy;
            this.ready = true;
            this.fireEvent("ready", this);
        }
    },

    /** private: method[trimUrl]
     *  :arg url: ``String``
     *  :arg params: ``Object``
     *
     *  Remove all parameters from the URL's query string that have matching
     *  keys in the provided object.  Keys are compared in a case-insensitive
     *  way.
     */
    trimUrl: function (url, params, respectCase) {
        var urlParams = OpenLayers.Util.getParameters(url);
        params = OpenLayers.Util.upperCaseObject(params);
        var keys = 0;
        for (var key in urlParams) {
            ++keys;
            if (key.toUpperCase() in params) {
                --keys;
                delete urlParams[key];
            }
        }
        return url.split("?").shift() + (keys ?
            "?" + OpenLayers.Util.getParameterString(urlParams) :
            ""
            );
    },


    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord`` or null when the source is lazy.
     *
     *  Create a layer record given the config. Applications should check that
     *  the source is not :obj:`lazy`` or that the ``config`` is complete (i.e.
     *  configured with all fields listed in :obj:`requiredProperties` before
     *  using this method. Otherwise, it is recommended to use the asynchronous
     *  :meth:`gxp.Viewer.createLayerRecord` method on the target viewer
     *  instead, which will load the source's store to complete the
     *  configuration if necessary.
     */
    createLayerRecord: function (config) {
        var record, original;
        var index = this.store.findExact("name", config.name);
        if (index > -1) {
            original = this.store.getAt(index);
        } else if (Ext.isObject(config.capability)) {
            original = this.store.reader.readRecords({capability: {
                request: {getmap: {href: this.trimUrl(this.url, this.baseParams)}},
                layers: [config.capability]}
            }).records[0];
        } else if (this.layerConfigComplete(config)) {
            // original = this.createLazyLayerRecord(config);
        }
        if (original) {

            /**
             * TODO: The WFSCapabilitiesReader should allow for creation
             * of layers in different SRS.
             */
            // Determine layer projection, 4 options:
            // 1. Use the same coordinate system as the project (Map) if matching WFS "DefaultCRS".
            // 2. if defaultSrs NOT configured: use default value EPSG:4326
            // 3. if defaultSrs configured: then use that SRS
            // 4. if defaultSrs explicitly configured to null use record SRS, i.e. WFS "DefaultCRS"
            var mapProjection, layerProjection;

            // See if there is a (default) SRS
            mapProjection = layerProjection = this.getMapProjection();
            var srs = original.get("srs");
            if (srs) {
                // If stupid code like: "urn:x-ogc:def:crs:EPSG:4326"
                if (srs.indexOf('urn') >= 0) {
                    srs = 'EPSG' + srs.split('EPSG')[1];
                }
                layerProjection = new OpenLayers.Projection(srs)
            }
            if (!layerProjection.equals(mapProjection) && this.defaultSrs) {
                layerProjection = new OpenLayers.Projection(this.defaultSrs);
            }
            var llBounds = original.get("bounds");
            if (!llBounds) {
                llBounds = new OpenLayers.Bounds(-180, -90, 180, 90);
            }

            // Determine maxExtent in map projection
            var maxExtent = llBounds.transform("EPSG:4326", mapProjection);

            // Style: first assume default style
            var styleMap = original.data.layer.styleMap;

            // Based on strategy we may have a (random) color
            if (original.data.colour) {
                styleMap = new OpenLayers.StyleMap({
                    'default': new OpenLayers.Style({
                        fillColor: original.data.colour,
                        fillOpacity: 0.6,
                        strokeColor: original.data.colour,
                        strokeOpacity: 0.8,
                        strokeWidth: 1,
                        pointRadius: 4,
                        graphicName: "circle"
                    }),
                    'select': new OpenLayers.Style({
                        fillColor: '#0000ee',
                        fillOpacity: 0.4,
                        strokeColor: '#0000ee',
                        strokeOpacity: 1,
                        strokeWidth: 1,
                        pointRadius: 6,
                        graphicName: 'circle'
                    })});
            }

            // Layer Record from Capabilites FeatureType
            var capsLayer = original.getLayer();

            // Construct a new Layer
            var layer = new OpenLayers.Layer.Vector(config.title || capsLayer.name, {
                strategies: [new OpenLayers.Strategy.BBOX()],
                styleMap: styleMap,
                protocol: new OpenLayers.Protocol.WFS({
                    version: this.version,
                    url: capsLayer.protocol.url,
                    srsName: layerProjection.getCode(),
                    featureType: capsLayer.protocol.featureType,
                    featureNS: capsLayer.protocol.featureNS,
                    outputFormat: 'GML2',
                    geometryName: null
                }),
                projection: layerProjection,
                attribution: capsLayer.attribution || config.attribution,
                maxExtent: maxExtent,
                restrictedExtent: maxExtent,
                visibility: ("visibility" in config) ? config.visibility : false,
                queryable: original.get("queryable")
            });

            // data for the new record
            var data = Ext.applyIf({
                title: layer.name,
                group: config.group,
                source: config.source,
                properties: null,
                fixed: config.fixed,
                selected: "selected" in config ? config.selected : false,
                restUrl: this.restUrl,
                layer: layer
            }, original.data);

            // add additional fields
            var fields = [
                {name: "source", type: "string"},
                {name: "group", type: "string"},
                {name: "properties", type: "string"},
                {name: "fixed", type: "boolean"},
                {name: "selected", type: "boolean"},
                {name: "restUrl", type: "string"},
                {name: "infoFormat", type: "string"},
                {name: "getFeatureInfo"}
            ];
            original.fields.each(function (field) {
                fields.push(field);
            });

            var Record = GeoExt.data.LayerRecord.create(fields);
            record = new Record(data, layer.id);
            record.json = config;

        } else {
            if (window.console && this.store.getCount() > 0 && config.name !== undefined) {
                console.warn("Could not create layer record for layer '" + config.name + "'. Check if the layer is found in the WFS GetCapabilities response.");
            }
        }
        return record;
    },


    /** private: method[initDescribeLayerStore]
     *  creates a WFSDescribeLayer store for layer descriptions of all layers
     *  created from this source.
     */
    initDescribeLayerStore: function () {
        var raw = this.store.reader.raw;
        if (this.lazy) {
            // When lazy, we assume that the server supports a DescribeLayer
            // request at the layer's url.
            raw = {
                capability: {
                    request: {
                        describelayer: {href: this.url}
                    }
                },
                version: this.version || "1.1.1"
            };
        }
        var req = raw.capability.request.describelayer;
        if (req) {
            var version = raw.version;
            if (parseFloat(version) > 1.1) {
                //TODO don't force 1.1.1, fall back instead
                version = "1.1.1";
            }
            var params = {
                SERVICE: "WFS",
                VERSION: version,
                REQUEST: "DescribeLayer"
            };
            this.describeLayerStore = new GeoExt.data.WFSDescribeLayerStore({
                url: this.trimUrl(req.href, params),
                baseParams: params
            });
        }
    },

    /** api: method[describeLayer]
     *  :arg rec: ``GeoExt.data.LayerRecord`` the layer to issue a WFS
     *      DescribeLayer request for
     *  :arg callback: ``Function`` Callback function. Will be called with
     *      an ``Ext.data.Record`` from a ``GeoExt.data.DescribeLayerStore``
     *      as first argument, or false if the WFS does not support
     *      DescribeLayer.
     *  :arg scope: ``Object`` Optional scope for the callback.
     *
     *  Get a DescribeLayer response from this source's WFS.
     */
    describeLayer: function (rec, callback, scope) {
        if (!this.describeLayerStore) {
            this.initDescribeLayerStore();
        }
        function delayedCallback(arg) {
            window.setTimeout(function () {
                callback.call(scope, arg);
            }, 0);
        }

        if (!this.describeLayerStore) {
            delayedCallback(false);
            return;
        }
        if (!this.describedLayers) {
            this.describedLayers = {};
        }
        var layerName = rec.getLayer().params.LAYERS;
        var cb = function () {
            var recs = Ext.isArray(arguments[1]) ? arguments[1] : arguments[0];
            var rec, name;
            for (var i = recs.length - 1; i >= 0; i--) {
                rec = recs[i];
                name = rec.get("layerName");
                if (name == layerName) {
                    this.describeLayerStore.un("load", arguments.callee, this);
                    this.describedLayers[name] = true;
                    callback.call(scope, rec);
                    return;
                } else if (typeof this.describedLayers[name] == "function") {
                    var fn = this.describedLayers[name];
                    this.describeLayerStore.un("load", fn, this);
                    fn.apply(this, arguments);
                }
            }
            // something went wrong (e.g. GeoServer does not return a valid
            // DescribeFeatureType document for group layers)
            delete describedLayers[layerName];
            callback.call(scope, false);
        };
        var describedLayers = this.describedLayers;
        var index;
        if (!describedLayers[layerName]) {
            describedLayers[layerName] = cb;
            this.describeLayerStore.load({
                params: {LAYERS: layerName},
                add: true,
                callback: cb,
                scope: this
            });
        } else if ((index = this.describeLayerStore.findExact("layerName", layerName)) == -1) {
            this.describeLayerStore.on("load", cb, this);
        } else {
            delayedCallback(this.describeLayerStore.getAt(index));
        }
    },

    /** private: method[fetchSchema]
     *  :arg url: ``String`` The url fo the WFS endpoint
     *  :arg typeName: ``String`` The typeName to use
     *  :arg callback: ``Function`` Callback function. Will be called with
     *      a ``GeoExt.data.AttributeStore`` containing the schema as first
     *      argument, or false if the WFS does not support DescribeLayer or the
     *      layer is not associated with a WFS feature type.
     *  :arg scope: ``Object`` Optional scope for the callback.
     *
     *  Helper function to fetch the schema for a layer of this source.
     */
    fetchSchema: function (url, typeName, callback, scope) {
        var schema = this.schemaCache[typeName];
        if (schema) {
            if (schema.getCount() == 0) {
                schema.on("load", function () {
                    callback.call(scope, schema);
                }, this, {single: true});
            } else {
                callback.call(scope, schema);
            }
        } else {
            schema = new GeoExt.data.AttributeStore({
                url: url,
                baseParams: {
                    SERVICE: "WFS",
                    //TODO should get version from WFS GetCapabilities
                    VERSION: "1.1.0",
                    REQUEST: "DescribeFeatureType",
                    TYPENAME: typeName
                },
                autoLoad: true,
                listeners: {
                    "load": function () {
                        callback.call(scope, schema);
                    },
                    scope: this
                }
            });
            this.schemaCache[typeName] = schema;
        }
    },

    /** api: method[getSchema]
     *  :arg rec: ``GeoExt.data.LayerRecord`` the WFS layer to issue a WFS
     *      DescribeFeatureType request for
     *  :arg callback: ``Function`` Callback function. Will be called with
     *      a ``GeoExt.data.AttributeStore`` containing the schema as first
     *      argument, or false if the WFS does not support DescribeLayer or the
     *      layer is not associated with a WFS feature type.
     *  :arg scope: ``Object`` Optional scope for the callback.
     *
     *  Gets the schema for a layer of this source, if the layer is a feature
     *  layer.
     */
    getSchema: function (rec, callback, scope) {
        if (!this.schemaCache) {
            this.schemaCache = {};
        }
        this.describeLayer(rec, function (r) {
            if (r && r.get("owsType") == "WFS") {
                var typeName = r.get("typeName");
                var url = r.get("owsURL");
                this.fetchSchema(url, typeName, callback, scope);
            } else if (!r) {
                // When DescribeLayer is not supported, we make the following
                // assumptions:
                // 1. URL of the WFS is the same as the URL of the WFS
                // 2. typeName is the same as the WFS Layer name
                this.fetchSchema(this.url, rec.get('name'), callback, scope);
            } else {
                callback.call(scope, false);
            }
        }, this);
    },

    /** api: method[getWFSProtocol]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :arg callback: ``Function``
     *  :arg scope: ``Object``
     *  :returns: :class:`OpenLayers.Protocol.WFS`
     *
     *  Creates a WFS protocol for the given WMS layer record.
     */
    getWFSProtocol: function (record, callback, scope) {
        this.getSchema(record, function (schema) {
            var protocol = false;
            if (schema) {
                var geometryName;
                var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
                schema.each(function (r) {
                    var match = geomRegex.exec(r.get("type"));
                    if (match) {
                        geometryName = r.get("name");
                    }
                }, this);
                protocol = new OpenLayers.Protocol.WFS({
                    version: "1.1.0",
                    srsName: record.getLayer().projection.getCode(),
                    url: schema.url,
                    featureType: schema.reader.raw.featureTypes[0].typeName,
                    featureNS: schema.reader.raw.targetNamespace,
                    geometryName: geometryName
                });
            }
            callback.call(scope, protocol, schema, record);
        }, this);
    },

    /** api: method[getConfigForRecord]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :returns: ``Object``
     *
     *  Create a config object that can be used to recreate the given record.
     */
    getConfigForRecord: function (record) {
        var config = Ext.applyIf(
                gxp.plugins.WFSSource.superclass.getConfigForRecord.apply(this, arguments),
                record.json
            ),
            layer = record.getLayer(),
            params = layer.params,
            options = layer.options;
        var name = config.name,
            raw = this.store.reader.raw;
        if (raw) {
            var capLayers = raw.capability.layers;
            for (var i = capLayers.length - 1; i >= 0; --i) {
                if (capLayers[i].name === name) {
                    config.capability = Ext.apply({}, capLayers[i]);
                    var srs = {};
                    srs[layer.projection.getCode()] = true;
                    // only store the map srs, because this list can be huge
                    config.capability.srs = srs;
                    break;
                }
            }
        }
        if (!config.capability) {
            if (layer.maxExtent) {
                config.bbox = layer.maxExtent.toArray();
            }
            config.srs = layer.projection.getCode();
        }
        return Ext.apply(config, {
            format: params.FORMAT,
            styles: params.STYLES,
            tiled: !options.singleTile,
            transparent: params.TRANSPARENT,
            cql_filter: params.CQL_FILTER,
            minscale: options.minScale,
            maxscale: options.maxScale,
            infoFormat: record.get("infoFormat"),
            attribution: layer.attribution
        });
    },

    /** private: method[getState] */
    getState: function () {
        var state = gxp.plugins.WFSSource.superclass.getState.apply(this, arguments);
        return Ext.applyIf(state, {title: this.title});
    }

});

Ext.preg(gxp.plugins.WFSSource.prototype.ptype, gxp.plugins.WFSSource);
