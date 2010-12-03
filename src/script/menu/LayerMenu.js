/**
 * Copyright (c) 2008-2010 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

Ext.namespace("gxp.menu");

gxp.menu.LayerMenu = Ext.extend(Ext.menu.Menu, {
    
    /** api: config[layers]
     *  ``GeoExt.data.LayerStore``
     *  The store containing layer records to be viewed in this menu.
     */
    layers: null,
    
    /** private: method[initComponent]
     *  Private method called to initialize the component.
     */
    initComponent: function() {
        gxp.menu.LayerMenu.superclass.initComponent.apply(this, arguments);
        this.layers.on("add", this.onLayerAdd, this);
        this.onLayerAdd();
    },

    /** private: method[onRender]
     *  Private method called during the render sequence.
     */
    onRender : function(ct, position) {
        gxp.menu.LayerMenu.superclass.onRender.apply(this, arguments);
    },

    /** private: method[beforeDestroy]
     *  Private method called during the destroy sequence.
     */
    beforeDestroy: function() {
        if (this.layers && this.layers.on) {
            this.layers.un("add", this.onLayerAdd, this);
        }
        delete this.layers;
        gxp.menu.LayerMenu.superclass.beforeDestroy.apply(this, arguments);
    },
    
    /** private: method[onLayerAdd]
     *  Listener called when records are added to the layer store.
     */
    onLayerAdd: function() {
        this.removeAll();
        // this.getEl().addClass("gx-layer-menu");
        // this.getEl().applyStyles({
        //     width: '',
        //     height: ''
        // });
        this.add(
            {
                iconCls: "gx-layer-visibility",
                text: "Layer",
                canActivate: false
            },
            "-"
        );
        this.layers.each(function(record) {
            var layer = record.get("layer");
            if(layer.displayInLayerSwitcher) {
                var item = new Ext.menu.CheckItem({
                    text: record.get("title"),
                    checked: record.get("layer").getVisibility(),
                    group: record.get("group"),
                    listeners: {
                        checkchange: function(item, checked) {
                            record.get("layer").setVisibility(checked);
                        }
                    }
                });
                if (this.items.getCount() > 2) {
                    this.insert(2, item);
                } else {
                    this.add(item);
                }
            }
        }, this);
        
    }
    
});

Ext.reg('gx_layermenu', gxp.menu.LayerMenu);
