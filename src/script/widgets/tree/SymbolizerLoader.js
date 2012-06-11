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
            // we need to group symbolizers per type, since we only
            // want one of them to show up in UI
            var symbolizers = {
                'Polygon': [],
                'Line': [],
                'Point': [],
                'Text': []
            };
            var i, ii;
            for (i=0, ii=this.symbolizers.length;i<ii;++i) {
                var symbolizer = this.symbolizers[i];
                var className = symbolizer.CLASS_NAME;
                var type = className.substr(className.lastIndexOf(".")+1);
                symbolizers[type].push(symbolizer);
            }
            var types = {
                'Polygon': ['Polygon', 'Point', 'Text'],
                'Line': ['Line', 'Text'],
                'Point': ['Point', 'Text'],
                'Text': ['Text']
            };
            var typesNeeded = types[this.symbolType];
            for (i=0, ii=typesNeeded.length; i<ii; ++i) {
                if (symbolizers[typesNeeded[i]].length === 0) {
                    // we should create one
                    symbolizers[typesNeeded[i]].push(new OpenLayers.Symbolizer[typesNeeded[i]]({checked: false}));
                }
            }
            for (var key in symbolizers) {
                if (symbolizers[key].length > 0) {
                    var id = Ext.id();
                    var child = this.createNode({
                        type: key,
                        symbolizer: [],
                        expanded: true,
                        rendererId: id,
                        iconCls: 'gxp-icon-symbolgrid-' + key.toLowerCase(),
                        preview: this.divTpl.applyTemplate({id: id})
                    });
                    for (var j=0, jj=symbolizers[key].length; j<jj; ++j) {
                        var overrides = {};
                        if (symbolizers[key][j].checked === false) {
                            overrides.checked = false;
                        }
                        var split = this.splitSymbolizer(symbolizers[key][j]);
                        for (var s in split) {
                            id = Ext.id();
                            child.attributes.symbolizer.push(split[s]);
                            child.appendChild(this.createNode({
                                type: s,
                                checked: true,
                                iconCls: "gxp-icon-symbolgrid-none",
                                symbolizer: split[s],
                                rendererId: id,
                                preview: this.divTpl.applyTemplate({id: id})
                            }, overrides));
                        }
                    }
                    node.appendChild(child);
                }
            }
            if(typeof callback == "function"){
                callback();
            }
            this.fireEvent("load", this, node);
        }
    },

    splitSymbolizer: function(symbolizer) {
        var result = {};
        if (symbolizer instanceof OpenLayers.Symbolizer.Polygon || symbolizer instanceof OpenLayers.Symbolizer.Point) {
            // split up in stroke and fill object hashes
            result.Fill = {
                stroke: false,
                fillColor: symbolizer.fillColor,
                fillOpacity: symbolizer.fillOpacity
            };
            result.Stroke = {
                fill: false,
                strokeColor: symbolizer.strokeColor,
                strokeOpacity: symbolizer.strokeOpacity,
                strokeWidth: symbolizer.strokeWidth,
                strokeLinecap: symbolizer.strokeLinecap,
                strokeDashstyle: symbolizer.strokeDashstyle
            };
        } else if (symbolizer instanceof OpenLayers.Symbolizer.Line) {
            result.Stroke = {
                fill: false,
                strokeColor: symbolizer.strokeColor,
                strokeOpacity: symbolizer.strokeOpacity,
                strokeWidth: symbolizer.strokeWidth,
                strokeLinecap: symbolizer.strokeLinecap,
                strokeDashstyle: symbolizer.strokeDashstyle
            };
        } else if (symbolizer instanceof OpenLayers.Symbolizer.Text) {
            result.Label = Ext.apply({}, symbolizer);
        }
        return result;
    },

    createSymbolizerPropertyGroup: function(fullSymbolizer, type, dummy) {
        var id = Ext.id(),
            overrides = {},
            config;
        if (fullSymbolizer.checked === false) {
            overrides.checked = false;
        }
        if (dummy === true) {
            overrides.dummy = true;
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
            child.appendChild(this.createSymbolizerPropertyGroup(fullSymbolizer, 'Fill'));
            child.appendChild(this.createSymbolizerPropertyGroup(fullSymbolizer, 'Stroke'));
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
