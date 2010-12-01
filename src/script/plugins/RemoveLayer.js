/**
 * @requires plugins/Tool.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.RemoveLayer = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_removelayer */
    ptype: "gx_removelayer",
    
    /** api: method[addActions]
     */
    addActions: function() {
        var selectedLayer;
        var removeLayerAction = gxp.plugins.RemoveLayer.superclass.addActions.apply(this, [{
            menuText: "Remove layer",
            iconCls: "gx-icon-removelayers",
            disabled: true,
            tooltip: "Remove layer",
            handler: function() {
                var record = selectedLayer;
                if(record) {
                    this.target.mapPanel.layers.remove(record);
                }
            },
            scope: this
        }])[0];

        this.target.on("layerselectionchange", function(tool, record) {
            selectedLayer = record;
            removeLayerAction.setDisabled(
                this.target.mapPanel.layers.getCount() <= 1 || !record
            );
        }, this);
        var enforceOne = function(store) {
            removeLayerAction.setDisabled(
                !selectedLayer || store.getCount() <= 1
            );
        }
        this.target.mapPanel.layers.on({
            "add": enforceOne,
            "remove": enforceOne
        })
        
        return removeLayerAction;
    }
        
});

Ext.preg(gxp.plugins.RemoveLayer.prototype.ptype, gxp.plugins.RemoveLayer);
