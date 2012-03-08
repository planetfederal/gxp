/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.grid
 *  class = CheckColumn
 *  base_link = `Ext.grid.Column <http://extjs.com/deploy/dev/docs/?class=Ext.grid.Column>`_
 */
Ext.namespace("gxp.grid");

/** api: constructor
 *  .. class:: CheckColumn(config)
 *
 *      A checkbox column. Inspired by Ext.ux.grid.CheckColumn. 
 */
gxp.grid.CheckColumn = Ext.extend(Ext.grid.Column, {

    /** private: method[processEvent]
     *  Process and refire events routed from the GridView's processEvent method.
     */
    processEvent : function(name, e, grid, rowIndex, colIndex){
        if (name == 'mousedown') {
            var record = grid.store.getAt(rowIndex);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
            return false; // Cancel row selection.
        } else {
            return Ext.grid.ActionColumn.superclass.processEvent.apply(this, arguments);
        }
    },

    /** private: method[renderer]
     */
    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td';
        return String.format('<div class="x-grid3-check-col{0}">&#160;</div>', v ? '-on' : '');
    }

});

/** api: xtype = checkcolumn */
Ext.grid.Column.types.checkcolumn = gxp.grid.CheckColumn;
