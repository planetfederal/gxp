Ext.ns("gxp.tree");

gxp.tree.TreeGridNodeUI = Ext.extend(Ext.ux.tree.TreeGridNodeUI, {

    renderElements : function(n, a, targetNode, bulkRender){
        var t = n.getOwnerTree(),
            cols = t.columns,
            c = cols[0],
            i, buf, len;

        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var cb = Ext.isBoolean(a.checked);
        buf = [
             '<tbody class="x-tree-node">',
                '<tr ext:tree-node-id="', n.id ,'" class="x-tree-node-el x-tree-node-leaf ', a.cls, '">',
                    '<td class="x-treegrid-col">',
                        '<span class="x-tree-node-indent">', this.indentMarkup, "</span>",
                        '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
                        '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon', (a.icon ? " x-tree-node-inline-icon" : ""), (a.iconCls ? " "+a.iconCls : ""), '" unselectable="on" />',
                        cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
                        '<a hidefocus="on" class="x-tree-node-anchor" href="', a.href ? a.href : '#', '" tabIndex="1" ',
                            a.hrefTarget ? ' target="'+a.hrefTarget+'"' : '', '>',
                        '<span unselectable="on">', (c.tpl ? c.tpl.apply(a) : a[c.dataIndex] || c.text), '</span></a>',
                    '</td>'
        ];

        for(i = 1, len = cols.length; i < len; i++){
            c = cols[i];
            buf.push(
                    '<td class="x-treegrid-col ', (c.cls ? c.cls : ''), '">',
                        '<div unselectable="on" class="x-treegrid-text"', (c.align ? ' style="text-align: ' + c.align + ';"' : ''), '>',
                            (c.tpl ? c.tpl.apply(a) : a[c.dataIndex]),
                        '</div>',
                    '</td>'
            );
        }

        buf.push(
            '</tr><tr class="x-tree-node-ct"><td colspan="', cols.length, '">',
            '<table class="x-treegrid-node-ct-table" cellpadding="0" cellspacing="0" style="table-layout: fixed; display: none; width: ', t.innerCt.getWidth() ,'px;"><colgroup>'
        );
        for(i = 0, len = cols.length; i<len; i++) {
            buf.push('<col style="width: ', (cols[i].hidden ? 0 : cols[i].width) ,'px;" />');
        }
        buf.push('</colgroup></table></td></tr></tbody>');

        if(bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()){
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin", n.nextSibling.ui.getEl(), buf.join(''));
        }else{
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(''));
        }
        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1].firstChild.firstChild;
        var cs = this.elNode.firstChild.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        if (cb) {
            this.checkbox = cs[3];
            this.anchor = cs[4];
            this.textNode = cs[4].firstChild;
	    } else {
            this.anchor = cs[3];
            this.textNode = cs[3].firstChild;
        }
    }

});
