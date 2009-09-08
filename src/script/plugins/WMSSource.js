/**
 * @require plugins/ServiceType.js
 */

Ext.namespace("gxp.plugins");

gxp.plugins.WMSSource = Ext.extend(gxp.plugins.LayerSource, {

    createStore: function(callback) {
        var parts = this.url.split("?");
        var params = Ext.apply(parts[1] && Ext.urlDecode(parts[1]) || {}, {
            SERVICE: "WMS",
            REQUEST: "GetCapabilities"
        });
        var url = Ext.urlAppend(parts[0], Ext.urlEncode(params));
        
        var store = new GeoExt.data.WMSCapabilitiesStore({
            url: url,
            autoLoad: true,
            listeners: {
                load: callback
            }
        });
    }
    
});

/** api: ptype = gx-wmssource */
Ext.preg("gx-wmssource", gxp.plugins.WMSSource)