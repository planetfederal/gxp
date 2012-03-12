Ext.ns("gxp.tree");

gxp.tree.SymbolizerLoader = function(config) {
    Ext.apply(this, config);
    gxp.tree.SymbolizerLoader.superclass.constructor.call(this);
};

Ext.extend(gxp.tree.SymbolizerLoader, Ext.util.Observable, {

    symbolizers: null,

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
                var symbolizer = symbolizers[i];
                var key = symbolizer.CLASS_NAME.substring(symbolizer.CLASS_NAME.lastIndexOf(".")+1);
                var child = this.createNode({type: key, expanded: true, iconCls: 'gxp-icon-symbolgrid-' + key.toLowerCase()});
                if (key === "Polygon" || key === "Point") {
                    var id = Ext.id();
                    var strokeSym = symbolizer.clone();
                    strokeSym.fill = false;
                    child.appendChild(this.createNode({type: 'Stroke', symbolizer: strokeSym, rendererId: id, preview: '<div id="'+id+'"></div>'}));
                    id = Ext.id();
                    var fillSym = symbolizer.clone();
                    fillSym.stroke = false;
                    child.appendChild(this.createNode({type: 'Fill', symbolizer: fillSym, rendererId: id, preview: '<div id="'+id+'"></div>'}));
                }
                node.appendChild(child);
            }
            if(typeof callback == "function"){
                callback();
            }

            this.fireEvent("load", this, node);
        }
    },

    /** api: method[createNode]
     *  :param attr: ``Object`` attributes for the new node
     *
     *  Override this function for custom TreeNode node implementation, or to
     *  modify the attributes at creation time.
     */
    createNode: function(attr) {
        if(this.baseAttrs){
            Ext.apply(attr, this.baseAttrs);
        }
        if(typeof attr.uiProvider == 'string'){
           attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
        }
        attr.nodeType = attr.nodeType || "node";
        return new Ext.tree.TreePanel.nodeTypes[attr.nodeType](attr);
    }

});
