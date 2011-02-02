Ext.QuickTips.init();

var form = new gxp.LayerUploadForm({
    renderTo: "container",
    url: "/geoserver",
    width: 350,
    frame: true,
    title: "Upload Layer Data",
    autoHeight: true,
    bodyStyle: "padding: 10px 10px 0 10px;",
    labelWidth: 65,
    defaults: {
        anchor: "95%",
        allowBlank: false,
        msgTarget: "side"
    },
    listeners: {
        uploadcomplete: function(panel, detail) {
            Ext.Msg.show({
                title: "Success",
                msg: "Added new layer: " + detail.name,
                minWidth: 200,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
            });
        }
    }
});
