/**
 * @requires plugins/LayerSource.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.OLSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gx_olsource */
    ptype: "gx_olsource",
    
    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {

        var record;
        
        // get class based on type in config
        var Class = window;
        var parts = config.type.split(".");
        for (var i=0, ii=parts.length; i<ii; ++i) {
            Class = Class[parts[i]];
            if (!Class) {
                break;
            }
        }

        // TODO: consider static method on OL classes to construct instance with args
        if (Class && Class.prototype && Class.prototype.initialize) {
            
            // create a constructor for the given layer type
            var Constructor = function() {
                // this only works for args that can be serialized as JSON
                Class.prototype.initialize.apply(this, config.args);
            };
            Constructor.prototype = Class.prototype;

            // create a new layer given type and args
            var layer = new Constructor();

            // apply properties that may have come from saved config
            if ("visibility" in config) {
                layer.visibility = config.visibility;
            }
            
            // create a layer record for this layer
            var Record = GeoExt.data.LayerRecord.create([
                {name: "source", type: "string"}, 
                {name: "group", type: "string"},
                {name: "fixed", type: "boolean"},
                {name: "selected", type: "boolean"},
                {name: "type", type: "string"},
                {name: "args"}
            ]);
            var data = {
                layer: layer,
                title: layer.name,
                source: config.source,
                group: config.group,
                fixed: ("fixed" in config) ? config.fixed : false,
                selected: ("selected" in config) ? config.selected : false,
                type: config.type,
                args: config.args
            };
            record = new Record(data, layer.id);

        } else {
            throw new Error("Cannot construct OpenLayers layer from given type: " + config.type);
        }
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
        var config = gxp.plugins.OLSource.superclass.getConfigForRecord.apply(this, arguments);
        // add config specific to this source
        var layer = record.get("layer");
        return Ext.apply(config, {
            type: record.get("type"),
            args: record.get("args")
        });
    }


});

Ext.preg(gxp.plugins.OLSource.prototype.ptype, gxp.plugins.OLSource);
