/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires widgets/tree/TreeGridNodeUI.js
 */

/** api: (define)
 *  module = gxp.tree
 *  class = SymbolizerLoader
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.ns("gxp.tree");

gxp.tree.SymbolizerLoader = function(config) {
    Ext.apply(this, config);
    gxp.tree.SymbolizerLoader.superclass.constructor.call(this);
};

/** api: constructor
 *  .. class:: SymbolizerLoader(config)
 *
 *      Create a new tree loader displaying symbolizers and its subtypes.
 */
Ext.extend(gxp.tree.SymbolizerLoader, Ext.util.Observable, {

    /** api: config[symbolizers]
     *  ``Array`` Array of symbolizers to display.
     */
    symbolizers: null,

    divTpl: new Ext.Template('<div class="gxp-symbolgrid-swatch" id="{id}"></div>'),

    /** private: method[load]
     *  :param node: ``Ext.tree.TreeNode`` The node to add children to.
     *  :param callback: ``Function``
     */
    load: function(node, callback) {
        if(this.fireEvent("beforeload", this, node)) {
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            for (var i=0, ii=this.symbolizers.length;i<ii;++i) {
                var symbolizer = this.symbolizers[i];
                this.addSymbolizer(node, symbolizer);
            }
            if(typeof callback == "function"){
                callback();
            }
            this.fireEvent("load", this, node);
        }
    },

    createSymbolizerPropertyGroup: function(fullSymbolizer, type) {
        var id = Ext.id(),
            overrides = {},
            config;
        if (fullSymbolizer.checked === false) {
            overrides.checked = false;
        }
        if (type === 'Stroke') {
            var strokeSym = fullSymbolizer.clone();
            // delete all properties which have to do with fill
            var fillProperties = ['fillColor', 'fillOpacity'];
            for (var f=0, ff=fillProperties.length; f<ff; ++f) {
                delete strokeSym[fillProperties[f]];
            }
            strokeSym.fill = false;
            config = {
                checked: fullSymbolizer.stroke !== undefined ? fullSymbolizer.stroke : true,
                iconCls: "gxp-icon-symbolgrid-none",
                type: type,
                symbolizer: strokeSym,
                rendererId: id,
                preview: this.divTpl.applyTemplate({id: id})
            };
        } else if (type === 'Fill') {
            var fillSym = fullSymbolizer.clone();
            // delete all properties which have to do with stroke
            // TODO store these in a more central place in GXP?
            var strokeProperties = ['strokeDashstyle', 'strokeColor', 'strokeWidth', 'strokeOpacity'];
            for (var s=0, ss=strokeProperties.length; s<ss; ++s) {
                delete fillSym[strokeProperties[s]];
            }
            fillSym.stroke = false;
            config = {
                checked: fullSymbolizer.fill !== undefined ? fullSymbolizer.fill : true,
                iconCls: "gxp-icon-symbolgrid-none",
                type: type,
                symbolizer: fillSym,
                rendererId: id,
                preview: this.divTpl.applyTemplate({id: id})
            };
        } else if (type === 'Label') {
            var labelSym = fullSymbolizer.clone();
            labelSym.graphic = false;
            config = {
                checked: true,
                iconCls: "gxp-icon-symbolgrid-none",
                type: type,
                symbolizer: labelSym,
                rendererId: id,
                preview: this.divTpl.applyTemplate({id: id})
            };
        } else if (type === 'Graphic') {
            var graphicSym = fullSymbolizer.clone();
            graphicSym.label = "";
            config = {
                checked: fullSymbolizer.graphic,
                iconCls: "gxp-icon-symbolgrid-none",
                type: type,
                symbolizer: graphicSym,
                rendererId: id,
                preview: this.divTpl.applyTemplate({id: id})
            };
        }
        return this.createNode(config, overrides);
    },

    addSymbolizer: function(node, symbolizer) {
        var divTpl = new Ext.Template('<div class="gxp-symbolgrid-swatch" id="{id}"></div>');
        var key = symbolizer.CLASS_NAME.substring(symbolizer.CLASS_NAME.lastIndexOf(".")+1);
        var fullSymbolizer = symbolizer.clone();
        if (key === 'Text') {
            fullSymbolizer.label = "Ab";
            if (fullSymbolizer.fillColor || fullSymbolizer.graphicName) {
                fullSymbolizer.graphic = true;
            }
        }
        var id = Ext.id();
        var child = this.createNode({
            type: key, 
            expanded: true, 
            rendererId: id, 
            originalSymbolizer: symbolizer,
            symbolizer: fullSymbolizer, 
            iconCls: 'gxp-icon-symbolgrid-' + key.toLowerCase(),
            preview: divTpl.applyTemplate({id: id})
        });
        if (key === "Polygon" || key === "Point") {
            child.appendChild(this.createSymbolizerPropertyGroup(fullSymbolizer, 'Stroke'));
            child.appendChild(this.createSymbolizerPropertyGroup(fullSymbolizer, 'Fill'));
        } else if (key === "Line") {
            child.appendChild(this.createSymbolizerPropertyGroup(fullSymbolizer, 'Stroke'));
        } else if (key === "Text") {
            child.appendChild(this.createSymbolizerPropertyGroup(fullSymbolizer, 'Label'));
            child.appendChild(this.createSymbolizerPropertyGroup(fullSymbolizer, 'Graphic'));
        }
        node.appendChild(child);
        return child;
    },

    /** api: method[createNode]
     *  :param attr: ``Object`` attributes for the new node
     *
     *  Override this function for custom TreeNode node implementation, or to
     *  modify the attributes at creation time.
     */
    createNode: function(attr, overrides) {
        if(this.baseAttrs){
            Ext.apply(attr, this.baseAttrs);
        }
        if(overrides){
            Ext.apply(attr, overrides);
        }
        if (!attr.uiProvider) {
            attr.uiProvider = gxp.tree.TreeGridNodeUI;
        }
        attr.nodeType = attr.nodeType || "node";
        return new Ext.tree.TreePanel.nodeTypes[attr.nodeType](attr);
    }

});
