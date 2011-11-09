/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.menu
 *  class = AnnotationMenu
 *  base_link = `Ext.menu.Menu <http://extjs.com/deploy/dev/docs/?class=Ext.menu.Menu>`_
 */
Ext.namespace("gxp.menu");

/** api: constructor
 *  .. class:: AnnotationMenu(config)
 *
 *    A menu to create annotations.
 */   
gxp.menu.AnnotationMenu = Ext.extend(Ext.menu.Menu, {

    /** i18n */
    showNotesText: "Show notes",
    addNoteText: "Add note",
    eventText: "Event",
    pointText: "Point",
    lineText: "Line",
    polygonText: "Polygon",

    /** private: method[initComponent]
     *  Private method called to initialize the component.
     */
    initComponent: function() {
        gxp.menu.AnnotationMenu.superclass.initComponent.apply(this, arguments);
        this.add([{
            xtype: "menucheckitem",
            text: this.showNotesText
        }, {
            xtype: "menuitem",
            iconCls: "gxp-icon-addnote",
            text: this.addNoteText,
            menu: new Ext.menu.Menu({items: [{
                xtype: "menuitem",
                text: this.eventText,
                iconCls: "gxp-icon-event"
            }, {
                xtype: "menuitem",
                text: this.pointText,
                iconCls: "gxp-icon-point"
            }, {
                xtype: "menuitem",
                text: this.lineText,
                iconCls: "gxp-icon-line"
            }, {
                xtype: "menuitem",
                text: this.polygonText,
                iconCls: "gxp-icon-polygon"
            }]})
        }]);
    }
    
});

Ext.reg('gxp_annotationmenu', gxp.menu.AnnotationMenu);
