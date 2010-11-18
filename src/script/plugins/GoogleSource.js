/**
 * @requires plugins/LayerSource.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.GoogleSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gx_googlesource */
    ptype: "gx_googlesource",
    
    /** config: property[timeout]
     *  ``Number``
     *  The time (in milliseconds) to wait before giving up on the Google Maps
     *  script loading.  This layer source will not be availble if the script
     *  does not load within the given timeout.  Default is 7000 (seven seconds).
     */
    timeout: 7000,

    /** api: property[store]
     *  ``GeoExt.data.LayerStore``
     */
    
    /** api: property[title]
     *  ``String``
     *  A descriptive title for this layer source.  Default is "Google Layers".
     */
    title: "Google Layers",

    constructor: function(config) {
        this.config = config;
        gxp.plugins.GoogleSource.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {        
        if (gxp.plugins.GoogleSource.monitor.ready) {
            this.syncCreateStore();
        } else {
            gxp.plugins.GoogleSource.monitor.on({
                ready: function() {
                    this.syncCreateStore();
                },
                scope: this
            });
            if (!gxp.plugins.GoogleSource.monitor.loading) {
                this.loadScript();
            }
        }
    },
    
    /** private: method[syncCreateStore]
     *
     *  Creates a store of layers.  This requires that the API script has already
     *  loaded.  Fires the "ready" event when the store is loaded.
     */
    syncCreateStore: function() {
        // TODO: The abstracts ("alt" properties) should be derived from the
        // MapType objects themselves.  It doesn't look like there is currently
        // a way to get the default map types before creating a map object.
        // http://code.google.com/p/gmaps-api-issues/issues/detail?id=2562
        // TODO: We may also be able to determine the MAX_ZOOM_LEVEL for each
        // layer type. If not, consider setting them on the OpenLayers level.
        var mapTypes = {
            "ROADMAP": {'abstract': "Show street map", MAX_ZOOM_LEVEL: 20},
            "SATELLITE": {'abstract': "Show satellite imagery"},
            "HYBRID": {'abstract': "Show imagery with street names"},
            "TERRAIN": {'abstract': "Show street map with terrain", MAX_ZOOM_LEVEL: 15}
        };
        
        var layers = [];
        var name, mapType;
        for(var name in mapTypes) {
            mapType = google.maps.MapTypeId[name];
            layers.push(new OpenLayers.Layer.Google(
                // TODO: get MapType object name
                // http://code.google.com/p/gmaps-api-issues/issues/detail?id=2562
                "Google " + mapType.replace(/\w/, function(c) {return c.toUpperCase()}), {
                    type: mapType,
                    typeName: name,
                    MAX_ZOOM_LEVEL: mapTypes[name].MAX_ZOOM_LEVEL,
                    maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
                    restrictedExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
                    projection: this.projection
                }
            ))
        }
        this.store = new GeoExt.data.LayerStore({
            layers: layers,
            fields: [
                {name: "source", type: "string"},
                {name: "name", type: "string", mapping: "typeName"},
                {name: "abstract", type: "string"},
                {name: "group", type: "string", defaultValue: "background"},
                {name: "fixed", type: "boolean", defaultValue: true},
                {name: "selected", type: "boolean"}
            ]
        });
        this.store.each(function(l) {
            l.set("abstract", mapTypes[l.get("name")]["abstract"]);
        });
        this.fireEvent("ready", this);
    },
    
    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
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
            var layer = record.get("layer");
            // set layer title from config
            if (config.title) {
                /**
                 * Because the layer title data is duplicated, we have
                 * to set it in both places.  After records have been
                 * added to the store, the store handles this
                 * synchronization.
                 */
                layer.setName(config.title);
                record.set("title", config.title);
            }
            // set visibility from config
            if ("visibility" in config) {
                layer.visibility = config.visibility
            }
            
            record.set("selected", config.selected || false);
            record.set("source", config.source);
            record.set("name", config.name);
            if ("group" in config) {
                record.set("group", config.group);
            }
            record.commit();
        };
        return record;
    },
    
    loadScript: function() {

        var params = {
            autoload: Ext.encode({
                modules: [{
                    name: "maps",
                    version: 3,
                    nocss: "true",
                    callback: "gxp.plugins.GoogleSource.monitor.onScriptLoad",
                    other_params: "sensor=false"
                }]
            })
        };
        
        var script = document.createElement("script");
        script.src = "http://www.google.com/jsapi?" + Ext.urlEncode(params);

        // cancel loading if monitor is not ready within timeout
        window.setTimeout(
            (function() {
                if (!gxp.plugins.GoogleSource.monitor.ready) {
                    this.abortScriptLoad(script);
                }
            }).createDelegate(this), 
            this.timeout
        );
        
        document.getElementsByTagName("head")[0].appendChild(script);

    },
    
    /** private: method[abortScriptLoad]
     *  :arg script: ``HTMLScriptElement``
     *
     *  Aborts the Google Maps script loading by removing the script from the 
     *  document.  Fires the "failure" event.  Called if the script does not 
     *  load within the timeout.
     */
    abortScriptLoad: function(script) {
        document.getElementsByTagName("head")[0].removeChild(script);
        delete this.store;
        this.fireEvent(
            "failure", 
            this,
            "The Google Maps script failed to load within the provided timeout (" + (this.timeout / 1000) + " s)."
        );
    }

});

/**
 * Create a monitor singleton that all plugin instances can use.
 */
gxp.plugins.GoogleSource.monitor = new (Ext.extend(Ext.util.Observable, {

    /** private: property[ready]
     *  ``Boolean``
     *  This plugin type is ready to use.
     */
    ready: !!(window.google && google.maps),

    /** private: property[loading]
     *  ``Boolean``
     *  The resources for this plugin type are loading.
     */
    loading: false,
    
    constructor: function() {
        this.addEvents(
            /** private: event[ready]
             *  Fires when this plugin type is ready.
             */
             "ready"
        );
    },
    
    /** private: method[onScriptLoad]
     *  Called when all resources required by this plugin type have loaded.
     */
    onScriptLoad: function() {
        // the google loader calls this in the window scope
        var monitor = gxp.plugins.GoogleSource.monitor;
        if (!monitor.ready) {
            monitor.ready = true;
            monitor.loading = false;
            monitor.fireEvent("ready");
        }
    }

}))();

Ext.preg(gxp.plugins.GoogleSource.prototype.ptype, gxp.plugins.GoogleSource);
