gxp.plugins.FeatureEditorGrid = Ext.extend(Ext.grid.PropertyGrid,
{
    ptype:'gxp_editorgrid',
    initComponent: function(){
        //TODO This is a workaround for maintaining the order of the
        // feature attributes. Decide if this should be handled in
        // another way.
        var origSort = Ext.data.Store.prototype.sort;
        Ext.data.Store.prototype.sort = function(){};
        //make a dummy source to be overwritten by the init function
        this.source = {'foo':'bar'};
        gxp.plugins.FeatureEditorGrid.superclass.initComponent.apply(this, arguments);
        Ext.data.Store.prototype.sort = origSort;
    },
    init: function(cmp){
        var customEditors = {};
        var customRenderers = {};
        var feature = cmp.feature;
        if (cmp.schema) {
            cmp.schema.each(function(r){
                var type = r.get("type");
                if (type.match(/^[^:]*:?((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry))/)) {
                    // exclude gml geometries
                    return;
                }
                var name = r.get("name");
                var value = feature.attributes[name];
                var fieldCfg = GeoExt.form.recordToField(r);
                var listeners;
                if (typeof value == "string") {
                    var format;
                    switch (type.split(":").pop()) {
                        case "date":
                            format = cmp.dateFormat;
                            fieldCfg.editable = false;
                            break;
                        case "dateTime":
                            if (!format) {
                                format = cmp.dateFormat + " " + cmp.timeFormat;
                                // make dateTime fields editable because the
                                // date picker does not allow to edit time
                                fieldCfg.editable = true;
                            }
                            fieldCfg.format = format;
                            //TODO When http://trac.osgeo.org/openlayers/ticket/3131
                            // is resolved, remove the listeners assignment below
                            listeners = {
                                "startedit": function(el, value){
                                    if (!(value instanceof Date)) {
                                        var date = Date.parseDate(value.replace(/Z$/, ""), "c");
                                        if (date) {
                                            cmp.setValue(date);
                                        }
                                    }
                                }
                            };
                            customRenderers[name] = (function(){
                                return function(value){
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
                                "startedit": function(el, value){
                                    cmp.setValue(Boolean(value));
                                }
                            };
                            break;
                    }
                }
                customEditors[name] = new Ext.grid.GridEditor({
                    field: Ext.create(fieldCfg),
                    listeners: listeners
                });
            }, this);
        }
        
        var ucExcludeFields = cmp.excludeFields ? cmp.excludeFields.join(",").toUpperCase().split(",") : [];
        var gridConfig = {
            border: false,
            source: feature.attributes,
            customEditors: customEditors,
            customRenderers: customRenderers,
            propertyNames: cmp.propertyNames,
            viewConfig: {
                forceFit: true,
                getRowClass: function(record){
                    if (ucExcludeFields.indexOf(record.get("name").toUpperCase()) !== -1) {
                        return "x-hide-nosize";
                    }
                }
            },
            listeners: {
                "beforeedit": function(){
                    return cmp.editing;
                },
                "propertychange": function(){
                    cmp.setFeatureState(cmp.getDirtyState());
                },
                scope: this
            }
        };
        Ext.apply(this.initialConfig,gridConfig);
        Ext.apply(this,gridConfig);
        //re-init component with proper configuration
        gxp.plugins.FeatureEditorGrid.superclass.initComponent(gridConfig);
        
        /**
         * TODO: This is a workaround for getting attributes with undefined
         * values to show up in the property grid.  Decide if this should be
         * handled in another way.
         */
        this.propStore.isEditableValue = function(){
            return true;
        };
    }
});
Ext.preg(gxp.plugins.FeatureEditorGrid.prototype.ptype, gxp.plugins.FeatureEditorGrid);