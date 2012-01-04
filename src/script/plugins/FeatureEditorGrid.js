/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeatureEditorGrid
 *  base_link = `Ext.grid.PropertyGrid <http://extjs.com/deploy/dev/docs/?class=Ext.grid.PropertyGrid>`_
 */

Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeatureEditorGrid(config)
 *
 *    Plugin for editing a feature in a property grid.
 */
gxp.plugins.FeatureEditorGrid = Ext.extend(Ext.grid.PropertyGrid, {

    ptype: "gxp_editorgrid",

    feature: null,

    schema: null,

    fields: null,

    excludeFields: null,

    propertyNames: null,

    readOnly: null,

    border: false,

    /** private: method[initComponent]
     */
    initComponent : function() {
        this.source = this.feature.attributes;
        if (!this.dateFormat) {
            this.dateFormat = Ext.form.DateField.prototype.format;
        }
        if (!this.timeFormat) {
            this.timeFormat = Ext.form.TimeField.prototype.format;
        }
        var customEditors = {};
        var customRenderers = {};
        if(this.schema) {
            var attributes = {};
            if (this.fields) {
                if (!this.excludeFields) {
                    this.excludeFields = [];
                }
                // determine the order of attributes
                for (var i=0,ii=this.fields.length; i<ii; ++i) {
                    attributes[this.fields[i]] = null;
                }
            }
            var ucFields = this.fields ?
                this.fields.join(",").toUpperCase().split(",") : [];
            this.schema.each(function(r) {
                var type = r.get("type");
                if (type.match(/^[^:]*:?((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry))/)) {
                    // exclude gml geometries
                    return;
                }
                var name = r.get("name");
                if (this.fields) {
                    if (ucFields.indexOf(name.toUpperCase()) == -1) {
                        this.excludeFields.push(name);
                    }
                }
                var value = feature.attributes[name];
                var fieldCfg = GeoExt.form.recordToField(r);
                var listeners;
                if (typeof value == "string") {
                    var format;
                    switch(type.split(":").pop()) {
                        case "date":
                            format = this.dateFormat;
                            fieldCfg.editable = false;
                            break;
                        case "dateTime":
                            if (!format) {
                                format = this.dateFormat + " " + this.timeFormat;
                                // make dateTime fields editable because the
                                // date picker does not allow to edit time
                                fieldCfg.editable = true;
                            }
                            fieldCfg.format = format;
                            //TODO When http://trac.osgeo.org/openlayers/ticket/3131
                            // is resolved, remove the listeners assignment below
                            listeners = {
                                "startedit": function(el, value) {
                                    if (!(value instanceof Date)) {
                                        var date = Date.parseDate(value.replace(/Z$/, ""), "c");
                                        if (date) {
                                            this.setValue(date);
                                        }
                                    }
                                }
                            };
                            customRenderers[name] = (function() {
                                return function(value) {
                                    //TODO When http://trac.osgeo.org/openlayers/ticket/3131
                                    // is resolved, change the 5 lines below to
                                    // return value.format(format);
                                    var date = value;
                                    if (typeof value == "string") {
                                        date = Date.parseDate(value.replace(/Z$/, ""), "c");
                                    }
                                    return date ? date.format(format) : value;
                                };
                            })();
                            break;
                        case "boolean":
                            listeners = {
                                "startedit": function(el, value) {
                                    this.setValue(Boolean(value));
                                }
                            };
                            break;
                    }
                }
                customEditors[name] = new Ext.grid.GridEditor({
                    field: Ext.create(fieldCfg),
                    listeners: listeners
                });
                attributes[name] = value;
            }, this);
            feature.attributes = attributes;
        }
        this.customEditors = customEditors;
        this.customRenderers = customRenderers;
        var ucExcludeFields = this.excludeFields ?
            this.excludeFields.join(",").toUpperCase().split(",") : [];
        this.viewConfig = {
            forceFit: true,
            getRowClass: function(record) {
                if (ucExcludeFields.indexOf(record.get("name").toUpperCase()) !== -1) {
                    return "x-hide-nosize";
                }
            }
        };
        this.listeners = {
            "beforeedit": function() {
                return this.featureEditor.editing;
            },
            "propertychange": function() {
                this.featureEditor.setFeatureState(this.featureEditor.getDirtyState());
            },
            scope: this
        };
        //TODO This is a workaround for maintaining the order of the
        // feature attributes. Decide if this should be handled in
        // another way.
        var origSort = Ext.data.Store.prototype.sort;
        Ext.data.Store.prototype.sort = function() {};
        gxp.plugins.FeatureEditorGrid.superclass.initComponent.apply(this, arguments);
        Ext.data.Store.prototype.sort = origSort;

        /**
         * TODO: This is a workaround for getting attributes with undefined
         * values to show up in the property grid.  Decide if this should be 
         * handled in another way.
         */
        this.propStore.isEditableValue = function() {return true;};
    },

    init: function(cmp) {
        this.featureEditor = cmp;
        this.featureEditor.on("canceledit", this.onCancelEdit, this);
        this.featureEditor.add(this);
        this.featureEditor.doLayout();
    },

    destroy: function() {
        this.featureEditor.un("canceledit", this.onCancelEdit, this);
        this.featureEditor = null;
        gxp.plugins.FeatureEditorGrid.superclass.destroy.call(this);
    },

    onCancelEdit: function(panel, feature) {
        if (feature) {
            this.setSource(feature.attributes);
        }
    }

});

Ext.preg(gxp.plugins.FeatureEditorGrid.prototype.ptype, gxp.plugins.FeatureEditorGrid);
