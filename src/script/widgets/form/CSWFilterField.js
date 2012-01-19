/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.form
 *  class = CSWFilterField
 *  base_link = `Ext.form.CompositeField <http://extjs.com/deploy/dev/docs/?class=Ext.form.CompositeField>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: CSWFilterField(config)
 *   
 *      A composite form field which uses a combobox to select values
 *      for a certain filter, and adds a button to the right of the combobox
 *      to remove the filter.
 */
gxp.form.CSWFilterField = Ext.extend(Ext.form.CompositeField, {

    /** api:config[name]
     *  ``String`` Name of the filter property.
     */
    name: null,

    /** api:config[comboFieldLabel]
     *  ``String`` fieldLabel to use for the combobox.
     */
    comboFieldLabel: null,

    /** api:config[comboStoreData]
     *  ``Array`` The data for the combo store, should contain 2 values 
     *  per entry: id and value.
     */
    comboStoreData: null,

    /** api:config[target]
     *  ``gxp.CatalogueSearchPanel`` The target on which to apply the filters.
     */
    target: null,

    /**
     * Method: initComponent
     */
    initComponent: function() {
        this.items = [{
            xtype: "combo",
            fieldLabel: this.comboFieldLabel,
            store: new Ext.data.ArrayStore({
                fields: ['id', 'value'],
                data: this.comboStoreData
            }),
            displayField: 'value',
            valueField: 'id',
            mode: 'local',
            listeners: {
                'select': function(cmb, record) {
                    var filter = {};
                    filter[this.name] = record.get('id');
                    this.target.addFilter(filter);
                    return false;
                },
                scope: this
            },
            emptyText: 'Select filter',
            triggerAction: 'all'
        }, {
            xtype: 'button',
            iconCls: 'gxp-icon-removelayers',
            handler: function(btn) {
                this.target.removeFilter(this.name);
            },
            scope: this
        }];
        this.hidden = true;
        gxp.form.CSWFilterField.superclass.initComponent.apply(this, arguments);
    },

    /**
     * Method: destroy
     */  
    destroy: function(){
        this.target = null;
        gxp.form.CSWFilterField.superclass.destroy.call(this);
    }

});

Ext.reg('cswfilterfield', gxp.form.CSWFilterField);
