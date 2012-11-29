/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FormFieldHelp
 */

Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SchemaAnnotations
 *
 *    Module for getting annotations from the WFS DescribeFeatureType schema.
 */
gxp.plugins.SchemaAnnotations = {

    /** api: method[getAnnotationsFromSchema]
     *
     *  :arg r: ``Ext.data.Record`` a record from the AttributeStore
     *  :returns: ``Object`` Object with label and helpText properties or
     *  null if no annotation was found.
     */
    getAnnotationsFromSchema: function(r) {
        var result = null;
        var annotation = r.get('annotation');
        if (annotation !== undefined) {
            result = {};
            var lang = GeoExt.Lang.locale.split("-").shift();
            var i, ii;
            for (i=0, ii=annotation.appinfo.length; i<ii; ++i) {
                var json = Ext.decode(annotation.appinfo[i]);
                if (json.title && json.title[lang]) {
                    result.label = json.title[lang];
                    break;
                }
            }
            for (i=0, ii=annotation.documentation.length; i<ii; ++i) {
                if (annotation.documentation[i].lang === lang) {
                    result.helpText = annotation.documentation[i].textContent;
                    break;
                }
            }
        }
        return result;
    }
};
