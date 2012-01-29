/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

Ext.namespace("gxp");

/** api: (define)
 *  module = gxp
 *  class = CrumbPanel
 *  base_link = `Ext.TabPanel <http://extjs.com/deploy/dev/docs/?class=Ext.TabPanel>`_
 */

/** api: constructor
 *  .. class:: CrumbPanel(config)
 *
 *    Panel that accommodates modal dialogs and displays their hierarchy as
 *    crumbs in tabs, from left to right. Clicking on a crumb left of the
 *    rightmost one will close all dialogs that are hosted in tabs on its
 *    right.
 */   
gxp.CrumbPanel = Ext.extend(Ext.TabPanel, {
    
    onAdd: function(cmp) {
        gxp.CrumbPanel.superclass.onAdd.apply(this, arguments);
        this.setActiveTab(this.items.getCount() - 1);
    },
    
    onRender: function(cmp) {
        if (!this.initialConfig.itemTpl) {
            this.itemTpl = new Ext.Template(
                 '<li class="{cls}" id="{id}"><div class="gxp-crumb-separator"></div>',
                 '<a class="x-tab-right" href="#"><em class="x-tab-left">',
                 '<span class="x-tab-strip-inner"><span class="x-tab-strip-text {iconCls}">{text}</span></span></span>',
                 '</em></a></li>'
            );
        }
        gxp.CrumbPanel.superclass.onRender.apply(this, arguments);
        this.getEl().addClass("gxp-crumbpanel");
    },
    
    setActiveTab: function(item) {
        var index = this.items.indexOf(item);
        if (~index) {
            for (var i=this.items.getCount()-1; i>index; --i) {
                this.remove(this.get(i));
            }
        }
        gxp.CrumbPanel.superclass.setActiveTab.apply(this, arguments);
    }

});

/** api: xtype = gxp_crumbpanel */
Ext.reg('gxp_crumbpanel', gxp.CrumbPanel);
