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
    this.addEvents(
        /**
         * @event beforeload
         * Fires before loading the tree nodes.
         * @param {Object} This TreeLoader object.
         * @param {Object} node The {@link Ext.tree.TreeNode} object being loaded.
         * @param {Object} callback The callback function specified in the {@link #load} call.
         */
        "beforeload",
        /**
         * @event load
         * Fires when the node has been successfuly loaded.
         * @param {Object} This TreeLoader object.
         * @param {Object} node The {@link Ext.tree.TreeNode} object being loaded.
         * @param {Object} response The response object containing the data from the server.
         */
        "load",
        /**
         * @event nodeadded
         * Fires when a new node has been added after load.
         * @param {Object} This TreeLoader object.
         * @param {Object} node The {@link Ext.tree.TreeNode} object being added.
         */
        "nodeadded"
    );
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

    /** private: config[divTpl]
     *  ``Ext.Template`` The template used for the swatches.
     */
    divTpl: new Ext.Template('<div class="gxp-symbolgrid-swatch" id="{id}"></div>'),

    /** private: config[emptyIconCls]
     *  ``String`` The css class to use on nodes without an icon in front.
     */
    emptyIconCls: "gxp-icon-symbolgrid-none",

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
                Polygon: {
                    empty: true,
                    Stroke: [],
                    Fill: []
                },
                Line: {
                    empty: true,
                    Stroke: []
                },
                Point: {
                    empty: true,
                    Graphic: [],
                    Mark: []
                },
                Text: {
                    empty: true,
                    Label: []
                }
            };
            var i, ii, split, s, typeSeq = [];
            // SLD uses the painter's model so, first item in the list is
            // at the bottom
            for (i=this.symbolizers.length-1; i>=0; --i) {
                var symbolizer = this.symbolizers[i];
                var className = symbolizer.CLASS_NAME;
                var type = className.substr(className.lastIndexOf(".")+1);
                if (OpenLayers.Util.indexOf(typeSeq, type) === -1) {
                    typeSeq.splice(0, 0, type);
                }
                split = this.splitSymbolizer(symbolizer);
                for (s in split) {
                    symbolizers[type][s].push(split[s]);
                }
            }
            var types = {
                Polygon: ['Polygon', 'Line', 'Point', 'Text'],
                Line: ['Line', 'Text'],
                Point: ['Point', 'Text'],
                Text: ['Text']
            };
            // check if we are missing symbolizers, if yes, create one
            var typesNeeded = types[this.symbolType];
            for (i=0, ii=typesNeeded.length; i<ii; ++i) {
                if (symbolizers[typesNeeded[i]].empty || typesNeeded[i] === this.symbolType) {
                    var config = {};
                    if (typesNeeded[i] === 'Point') {
                         config.externalGraphic = null;
                    } else if (typesNeeded[i] === 'Text') {
                        config.graphic = false;
                    }
                    var sym = new OpenLayers.Symbolizer[typesNeeded[i]](config);
                    split = this.splitSymbolizer(sym);
                    for (s in split) {
                        var hasUnchecked = false;
                        for (var k=0, kk=symbolizers[typesNeeded[i]][s].length; k<kk; ++k) {
                            if (symbolizers[typesNeeded[i]][s][k].checked === false) {
                                hasUnchecked = true;
                            }
                        }
                        if (hasUnchecked === false) {
                            split[s].checked = false;
                            symbolizers[typesNeeded[i]].empty = false;
                            symbolizers[typesNeeded[i]][s].push(split[s]);
                        }
                    }
                    if (OpenLayers.Util.indexOf(typeSeq, typesNeeded[i]) === -1) {
                        typeSeq.splice(0, 0, typesNeeded[i]);
                    }
                }
            }
            // now we have aggregated the complete symbolizer structure, so process
            for (i=typeSeq.length-1; i>=0; --i) {
                var key = typeSeq[i];
                if (symbolizers[key].empty === false) {
                    var id = Ext.id();
                    var text = key;
                    if (key !== 'Text') {
                        text += 's'; // plural
                    }
                    var child = this.createNode({
                        type: key,
                        text: text,
                        symbolizer: [],
                        symbolType: key,
                        expanded: true,
                        rendererId: id,
                        iconCls: 'gxp-icon-symbolgrid-' + key.toLowerCase(),
                        preview: this.divTpl.applyTemplate({id: id})
                    });
                    for (var subKey in symbolizers[key]) {
                        for (var j=0, jj=symbolizers[key][subKey].length; j<jj; ++j) {
                            var overrides = {}; 
                            if (subKey === 'Label' && symbolizers[key][subKey][j].label) {
                                text = symbolizers[key][subKey][j].label;
                            } else {
                                text = subKey;
                            }
                            if (symbolizers[key][subKey][j].checked === false) {
                                overrides.checked = false;
                                delete symbolizers[key][subKey][j].checked;
                            }
                            id = Ext.id();
                            if (overrides.checked !== false) {
                                child.attributes.symbolizer.splice(0, 0, symbolizers[key][subKey][j]);
                            }
                            child.appendChild(this.createNode({
                                type: subKey,
                                text: text,
                                leaf: true,
                                symbolType: key,
                                checked: true,
                                listeners: {
                                    checkchange: this.onCheckChange,
                                    scope: this
                                },
                                iconCls: this.emptyIconCls,
                                symbolizer: symbolizers[key][subKey][j],
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

    /** private: method[onCheckChange]
     *  :param node: ``Ext.tree.TreeNode`` The node whose checkbox state is altered.
     *  :param checked: ``Boolean``
     *
     *  Handle the checkchange event, update the composite swatches.
     */
    onCheckChange: function(node, checked) {
        if (checked) {
            var type = node.attributes.type;
            // check if there is still an unchecked node of the same type
            var hasUnchecked = false;
            node.parentNode.cascade(function(subNode) {
                if (subNode.attributes.type === type && 
                  subNode.getUI().isChecked() === false) {
                    hasUnchecked = true;
                }
            });
            if (hasUnchecked === false) {
                var id = Ext.id();
                var symbolizer = {};
                symbolizer[type.toLowerCase()] = true;
                symbolizer = Ext.apply({
                    fill: false, 
                    stroke: false
                }, symbolizer);
                var child = this.createNode({
                    type: type,
                    text: type,
                    symbolType: node.parentNode.attributes.type,
                    checked: false,
                    listeners: {
                        checkchange: this.onCheckChange,
                        scope: this
                    },
                    iconCls: this.emptyIconCls,
                    symbolizer: symbolizer,
                    rendererId: id,
                    preview: this.divTpl.applyTemplate({id: id})
                });
                node.parentNode.appendChild(child);
                node.parentNode.sort(function(node1, node2) {
                    if (node1.attributes.type === 'Stroke' && node2.attributes.type === 'Fill') {
                        return -1;
                    }
                    else if (node1.attributes.type === 'Fill' && node2.attributes.type === 'Stroke') {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                this.fireEvent("nodeadded", this, child);
            }
        }
    },

    /** private: method[splitSymbolizer]
     *  :param symbolizer: ``OpenLayers.Symbolizer`` The symbolizer to split up.
     *
     *  Split up a symbolizer in its subTypes, such as a PolygonSymbolizer in
     *  Stroke and Fill.
     */
    splitSymbolizer: function(symbolizer) {
        var result = {}, config;
        if (symbolizer instanceof OpenLayers.Symbolizer.Polygon) {
            result.Fill = {
                stroke: false,
                checked: symbolizer.fill,
                fillColor: symbolizer.fillColor,
                fillOpacity: symbolizer.fillOpacity
            };
            result.Stroke = {
                fill: false,
                checked: symbolizer.stroke,
                strokeColor: symbolizer.strokeColor,
                strokeOpacity: symbolizer.strokeOpacity,
                strokeWidth: symbolizer.strokeWidth,
                strokeLinecap: symbolizer.strokeLinecap,
                strokeDashstyle: symbolizer.strokeDashstyle
            };
        } else if (symbolizer instanceof OpenLayers.Symbolizer.Point) {
            config = {
                pointRadius: symbolizer.pointRadius,
                rotation: symbolizer.rotation
            };
            if (symbolizer.externalGraphic !== undefined) {
                result.Graphic = Ext.apply({
                    externalGraphic: symbolizer.externalGraphic
                }, config);
            }
            result.Mark = Ext.apply({
                graphicName: symbolizer.graphicName,
                fillColor: symbolizer.fillColor,
                fillOpacity: symbolizer.fillOpacity,
                strokeColor: symbolizer.strokeColor,
                strokeOpacity: symbolizer.strokeOpacity,
                strokeWidth: symbolizer.strokeWidth,
                strokeLinecap: symbolizer.strokeLinecap,
                strokeDashstyle: symbolizer.strokeDashstyle
            }, config);
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
