/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/CatalogueSearchPanel.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = CatalogueSearch
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: CatalogueSearch(config)
 *
 *    Plugin for searching a CS-W.
 */
gxp.plugins.CatalogueSearch = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_cataloguesearch */
    ptype: "gxp_cataloguesearch",

    /** api: config[selectedSource]
     *  ``String`` The catalogue source that will be searched upon initially.
     */
    selectedSource: null,

    /** api: method[addActions]
     */
    addActions: function() {
        var actions = gxp.plugins.CatalogueSearch.superclass.addActions.apply(this, [{
            tooltip : "Search for layers",
            text: "Search",
            menuText: "Search for layers",
            iconCls: "gxp-icon-addlayers",
            handler : this.addOutput,
            scope: this
        }]);

        this.target.on("ready", function() {actions[0].enable();});
        return actions;
    },

    addWMSLayer: function(sourceKey, layerConfig) {
        var source = this.target.layerSources[sourceKey];
        var record = source.createLayerRecord(layerConfig);
        this.target.mapPanel.layers.add(record);
    },

    addOutput: function() {
        var sources = {};
        for (var key in this.target.layerSources) {
            var source = this.target.layerSources[key];
            if (source instanceof gxp.plugins.CatalogueSource) {
                var obj = {};
                obj[key] = source;
                Ext.apply(sources, obj);
            }
        }
        return gxp.plugins.CatalogueSearch.superclass.addOutput.apply(this, [{
            plugin: this,
            sources: sources,
            selectedSource: this.selectedSource,
            xtype: 'gxp_cataloguesearchpanel'
        }]);
    }

});

Ext.preg(gxp.plugins.CatalogueSearch.prototype.ptype, gxp.plugins.CatalogueSearch);
