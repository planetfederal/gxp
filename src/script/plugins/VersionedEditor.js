/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/FeatureEditorGrid.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.VersionedEditor = Ext.extend(Ext.TabPanel, {

    /* i18n */
    attributesTitle: "Attributes",
    historyTitle: "History",
    /* end i18n */

    border: false,
    activeTab: 0,

    editor: null,

    /** api: ptype = gxp_versionededitor */
    ptype: "gxp_versionededitor",

    initComponent: function() {
        gxp.plugins.VersionedEditor.superclass.initComponent.call(this);
        var config = Ext.apply({
            xtype: this.editor || "gxp_editorgrid",
            title: this.attributesTitle}, this.initialConfig);
        this.editor = Ext.ComponentMgr.create(config);
        this.add(this.editor);
        this.add({title: this.historyTitle});
    },

    /** private: method[init]
     *
     *  :arg target: ``gxp.FeatureEditPopup`` The feature edit popup 
     *  initializing this plugin.
     */
    init: function(target) {
        // make sure the editor is not added, we will take care
        // of adding the editor to our container later on
        target.on('beforeadd', OpenLayers.Function.False, this);
        this.editor.init(target);
        target.un('beforeadd', OpenLayers.Function.False, this);
        target.add(this);
        target.doLayout();
    }

});

Ext.preg(gxp.plugins.VersionedEditor.prototype.ptype, gxp.plugins.VersionedEditor);
