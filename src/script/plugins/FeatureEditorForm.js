/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeatureEditorForm
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.FormPanel>`_
 */

Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeatureEditorForm(config)
 *
 *    Plugin for editing feature attributes in a form.
 */
gxp.plugins.FeatureEditorForm = Ext.extend(Ext.FormPanel, {

    ptype: 'gxp_editorform',

    schema: null,

    feature: null,

    fields: null,

    excludeFields: null,

    propertyNames: null,

    readOnly: null,

    defaults: {
        anchor: "98%", 
        disabled: true
    },

    monitorValid: true,
            
    bodyStyle: "padding: 5px 5px 0",
            
    labelWidth: 100,
    
    autoScroll: true,

    /** private: method[initComponent]
     */
    initComponent : function() {
        this.listeners = {
            clientvalidation: function(panel, valid) {
                if (valid) {
                    this.featureEditor.setFeatureState(this.featureEditor.getDirtyState());
                }
            },
            scope: this
        };

        gxp.plugins.FeatureEditorForm.superclass.initComponent.call(this);

        if (!this.excludeFields) {
            this.excludeFields = [];
        }

        // all remaining fields
        var excludeFields = [];
        for (var i=0, ii=this.excludeFields.length; i<ii; ++i) {
            excludeFields[i] = this.excludeFields[i].toLowerCase();
        }

        if (this.schema) {
            this.schema.each(function(r) {
                var name = r.get("name");
                var lower = name.toLowerCase();
                if (excludeFields.indexOf(lower) != -1) {
                    return;
                }
                var type = r.get("type");
                if (type.match(/^[^:]*:?((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry))/)) {
                    // exclude gml geometries
                    return;
                }
                var fieldCfg = GeoExt.form.recordToField(r);
                fieldCfg.value = this.feature.attributes[name];
                if (fieldCfg.value && fieldCfg.xtype == "datefield") {
                    var dateFormat = "Y-m-d";
                    fieldCfg.format = dateFormat;
                    fieldCfg.value = Date.parseDate(fieldCfg.value.replace(/Z$/, ""), dateFormat);
                }
                this.add(fieldCfg);
            }, this);
        } else {
            for (var name in this.feature.attributes) {
                var fieldCfg = {
                    xtype: "textfield",
                    fieldLabel: name,
                    value: this.feature.attributes[name]
                };
                this.add(fieldCfg);
            }
        }
    },

    init: function(cmp) {
        this.featureEditor = cmp;
        this.featureEditor.on("startedit", this.onStartEdit, this);
        this.featureEditor.on("stopedit", this.onStopEdit, this);
        this.featureEditor.on("canceledit", this.onCancelEdit, this);
        this.featureEditor.add(this);
        this.featureEditor.doLayout();
    },

    destroy: function() {
        this.featureEditor.un("startedit", this.onStartEdit, this);
        this.featureEditor.un("stopedit", this.onStopEdit, this);
        this.featureEditor.un("canceledit", this.onCancelEdit, this);
        this.featureEditor = null;
        gxp.plugins.FeatureEditorForm.superclass.destroy.call(this);
    },

    onStartEdit: function() {
        this.getForm().items.each(function(){
             this.readOnly !== true && this.enable();
        });
    },

    onStopEdit: function() {
        this.getForm().items.each(function(){
             this.disable();
        });
    },

    onCancelEdit: function(panel, feature) {
        if (feature) {
            this.getForm().reset();
        }
    }

});

Ext.preg(gxp.plugins.FeatureEditorForm.prototype.ptype, gxp.plugins.FeatureEditorForm);
