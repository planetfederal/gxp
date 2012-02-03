/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.form
 *  class = ExtendedDateField
 *  base_link = `Ext.form.DateField <http://extjs.com/deploy/dev/docs/?class=Ext.form.DateField>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: ExtendedDateField(config)
 *   
 *      It has been noted that to support the entire date range of earth's
 *      history, we'll need an approach that does not totally rely on date
 *      objects. A reasonable approach is to use a big integer (or
 *      long) that represents the number of seconds before or after
 *      1970-01-01. This allows us to use date objects with little effort when
 *      a value is within the supported range and to use a date-like object
 *      (ignores things like leap-year, etc.) when the value is outside of
 *      that range.
 */
gxp.form.ExtendedDateField = Ext.extend(Ext.form.DateField, {

    getValue : function() {
        var value = Ext.form.DateField.superclass.getValue.call(this);
        var date = this.parseDate(value);
        return (date) ? date.getTime()/1000 : "";
    },

    setValue: function(v) {
        return Ext.form.DateField.superclass.setValue.call(this, this.formatDate(new Date(v*1000)));
    }

});

Ext.reg('gxp_datefield', gxp.form.ExtendedDateField);
