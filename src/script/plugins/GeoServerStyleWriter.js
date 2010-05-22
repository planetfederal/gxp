/**
 * Copyright (c) 2010 OpenPlans
 */

/**
 * @require plugins/StyleWriter.js
 */

Ext.namespace("gxp.plugins");

/** api: (define)
 *  module = gxp.plugins
 *  class = GeoServerStyleWriter
 */

/** api: (extends)
 * srcipt/plugins/StyleWriter.js
 */


/** api: constructor
 *  .. class:: GeoServerStyleWriter(config)
 *   
 *      Save styles from :class:`gxp.WMSStylesDialog` or similar classes that
 *      have a ``layerRecord`` and a ``stylesStore`` with a ``userStyle``
 *      field. The plugin provides a save method, which will use the GeoServer
 *      RESTConfig API to persist style changes from the ``stylesStore`` to the
 *      server and associate them with the layer referenced in the target's
 *      ``layerRecord``.
 */
gxp.plugins.GeoServerStyleWriter = Ext.extend(gxp.plugins.StyleWriter, {
    
    /** api: config[baseUrl]
     *  ``String``
     *  The object that this plugin is plugged into.
     */
    baseUrl: "/geoserver/rest",
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;
        Ext.apply(this, config);
        
        gxp.plugins.GeoServerStyleWriter.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
        gxp.plugins.GeoServerStyleWriter.superclass.init.apply(this, arguments);
        this.target = target;
    },
    
    /** api: method[write]
     *  :arg options: ``Object``
     *
     *  Saves the styles of the target's ``layerRecord`` using GeoServer's
     *  RESTconfig API.
     *  
     *  Supported options:
     *  * defaultStyle - ``String`` If set, the default style will be set.
     *  * success - ``Function`` A function to call when all styles were
     *    written successfully.
     *  * scope - ``Object`` A scope to call the ``success`` function with.
     */
    write: function(options) {
        var modifiedRecs = this.target.stylesStore.getModifiedRecords();
        var dispatchQueue = [];
        for (var i=0, len=modifiedRecs.length; i<len; ++i) {
            this.writeStyle(modifiedRecs[i], dispatchQueue);
        }
        var success = function() {
            // we don't need any callbacks for deleting styles.
            this.deleteStyles();
            this.target.stylesStore.commitChanges();
            options.success && options.success.call(options.scope);
        }
        if(dispatchQueue.length > 0) {
            gxp.util.dispatch(dispatchQueue, function() {
                this.assignStyles(options.defaultStyle, success);
            }, this);
        } else {
            this.assignStyles(options.defaultStyle, success);
        }
    },
    
    /** private: method[writeStyle] 
     *  :arg styleRec: ``Ext.data.Record`` the record from the target's
     *      ``stylesStore`` to write
     *  :arg dispatchQueue: ``Array(Function)`` the dispatch queue the write
     *      funciton is added to.
     * 
     *  This method does not actually write styles, it just adds a function to
     *  the provided ``dispatchQueue`` that will do so.
     */
    writeStyle: function(styleRec, dispatchQueue) {
        var styleName = styleRec.get("userStyle").name;
        dispatchQueue.push(function(callback, storage) {
            Ext.Ajax.request({
                method: styleRec.phantom === true ? "POST" : "PUT",
                url: this.baseUrl + "/styles" + (styleRec.phantom === true ?
                    "" : "/" + styleName + ".xml"),
                headers: {
                    "Content-Type": "application/vnd.ogc.sld+xml; charset=UTF-8"
                },
                xmlData: this.target.createSLD({
                    userStyles: [styleName]
                }),
                success: styleRec.phantom === true ? function(){
                    Ext.Ajax.request({
                        method: "POST",
                        url: this.baseUrl + "/layers/" +
                            this.target.layerRecord.get("name") + "/styles.json",
                        jsonData: {
                            "style": {
                                "name": styleName
                            }
                        },
                        success: callback,
                        scope: this
                    })
                } : callback,
                scope: this
            });
        });
    },

    /** private: method[assignStyles]
     *  :arg defaultStyle: ``String`` The default style. Optional.
     *  :arg callback: ``Function`` The function to call when all operations
     *      succeeded. Will be called in the scope of this instance. Optional.
     */
    assignStyles: function(defaultStyle, callback) {
        var styles = [];
        this.target.stylesStore.each(function(rec) {
            if (!defaultStyle && rec.get("userStyle").isDefault === true) {
                defaultStyle = rec.get("name");
            }
            if (rec.get("name") !== defaultStyle &&
                                this.deletedStyles.indexOf(rec.id) === -1) {
                styles.push({"name": rec.get("name")})
            }
        }, this);
        Ext.Ajax.request({
            method: "PUT",
            url: this.baseUrl + "/layers/" +
                this.target.layerRecord.get("name") + ".json",
            jsonData: {
                "layer": {
                    "defaultStyle": {
                        "name": defaultStyle
                    },
                    "styles": {
                        "style": styles
                    },
                    "enabled": true
                }
            },
            success: callback,
            scope: this
        });
    },
    
    /** private: method[deleteStyles]
     *  Deletes styles that are no longer assigned to the layer.
     */
    deleteStyles: function() {
        for (var i=0, len=this.deletedStyles.length; i<len; ++i) {
            Ext.Ajax.request({
                method: "DELETE",
                url: this.baseUrl + "/styles/" + this.deletedStyles[i] +
                    "?purge=true"
            });
        }
    }

});

/** api: ptype = gx-geoserverstylewriter */
Ext.preg("gx-geoserverstylewriter", gxp.plugins.GeoServerStyleWriter);
