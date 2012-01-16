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

    source: null,

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

    addWMSLayer: function(layerConfig) {
        var source = this.target.layerSources[this.source];
        var record = source.createLayerRecord(layerConfig);
        this.target.mapPanel.layers.add(record);
    },

    addOutput: function() {
        return gxp.plugins.CatalogueSearch.superclass.addOutput.apply(this, [{
            plugin: this,
            source: this.target.layerSources[this.source], 
            xtype: 'gxp_cataloguesearchpanel'
        }]);
    }

});

Ext.preg(gxp.plugins.CatalogueSearch.prototype.ptype, gxp.plugins.CatalogueSearch);
