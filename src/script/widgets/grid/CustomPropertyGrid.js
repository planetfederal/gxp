/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.grid
 *  class = CustomPropertyGrid
 *  base_link = `Ext.grid.PropertyGrid <http://extjs.com/deploy/dev/docs/?class=Ext.grid.PropertyGrid>`_
 */
Ext.namespace("gxp.grid");

/** api: constructor
 *  .. class:: CustomPropertyGrid(config)
 *
 *      Create a new PropertyGrid displaying the attributes of a
 *     layer feature, with customizable labels
 */
gxp.grid.CustomPropertyGrid = Ext.extend(Ext.grid.PropertyGrid, {

    /** api: config[ignoreFields]
     *  ``Array`` of field names  that should not be
     *  displayed in the grid.
     */
    ignoreFields: null,

    /** api: config[includeFields]
     * ``Array`` of field names that should be
     * displayed in the grid, on order of the array.
     * All other fields will be ignored.
     *  Overrides config[ignoreFields]
     */
    includeFields: null,


    /** api: config[propertyNames]
     *  ``Object`` Property name/display name pairs. If specified, the display
     *  name will be shown as the property name.
     */
    propertyNames: null,

    // private
    initComponent : function(){
        this.customRenderers = this.customRenderers || {};
        this.customEditors = this.customEditors || {};
        this.lastEditRow = null;
        var store = new Ext.grid.PropertyStore(this);
        this.propStore = store;
        var cm = new Ext.grid.PropertyColumnModel(this, store);
        this.ignoreFields = ["feature", "state", "fid"].concat(this.ignoreFields);

        this.addEvents(
            /**
             * @event beforepropertychange
             * Fires before a property value changes.  Handlers can return false to cancel the property change
             * (this will internally call {@link Ext.data.Record#reject} on the property's record).
             * @param {Object} source The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId The record's id in the data store
             * @param {Mixed} value The current edited property value
             * @param {Mixed} oldValue The original property value prior to editing
             */
            'beforepropertychange',
            /**
             * @event propertychange
             * Fires after a property value has changed.
             * @param {Object} source The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId The record's id in the data store
             * @param {Mixed} value The current edited property value
             * @param {Mixed} oldValue The original property value prior to editing
             */
            'propertychange'
        );
        this.cm = cm;
        this.ds = store.store;
        Ext.grid.PropertyGrid.superclass.initComponent.call(this);

        this.mon(this.selModel, 'beforecellselect', function(sm, rowIndex, colIndex){
            if(colIndex === 0){
                this.startEditing.defer(200, this, [rowIndex, 1]);
                return false;
            }
        }, this);
    },

    setSource: function(o) {
        var filteredSource = new Object();
        if (this.includeFields){
            //Add fields in the order that they are contained in this.includeFields array
            for (var field in this.includeFields) {
                var name = this.includeFields[field];
                filteredSource[this.propertyNames ?
                    (this.propertyNames[name] || name) : name] = o[name];
            }
        } else {
            //Remove any fields contained in this.ignoreFields
            for(var k in o){
                if (this.ignoreFields.indexOf(k)==-1) {
                    filteredSource[this.propertyNames ?
                        (this.propertyNames[k] || k) : k] = o[k];
                }
            }
        }
        this.propStore.setSource(filteredSource);
    }

});



/** api: xtype = gxp_featuregrid */
Ext.reg('gxp_propertygrid', gxp.grid.CustomPropertyGrid);
