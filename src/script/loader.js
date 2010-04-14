(function() {

    var jsfiles = new Array(
        "util.js",
        "Lang.js",
        "data/WFSFeatureStore.js",
        "data/WFSProtocolProxy.js",
        "menu/LayerMenu.js",
        "widgets/FeatureEditPopup.js",
        "widgets/FilterBuilder.js",
        "widgets/QueryPanel.js",
        "widgets/WMSLayerPanel.js",
        "widgets/WMSStylesDialog.js",
        "widgets/NewSourceWindow.js",
        "widgets/FillSymbolizer.js",
        "widgets/StrokeSymbolizer.js",
        "widgets/PointSymbolizer.js",
        "widgets/LineSymbolizer.js",
        "widgets/PolygonSymbolizer.js",
        "widgets/ScaleLimitPanel.js",
        "widgets/TextSymbolizer.js",
        "widgets/Viewer.js",
        "widgets/form/ComparisonComboBox.js",
        "widgets/form/ColorField.js",
        "widgets/form/FilterField.js",
        "widgets/form/FontComboBox.js",
        "widgets/grid/CapabilitiesGrid.js",
        "widgets/grid/FeatureGrid.js",
        "widgets/GoogleEarthPanel.js",
        "widgets/tips/SliderTip.js",
        "plugins/LayerSource.js",
        "plugins/WMSSource.js",
        "plugins/GoogleSource.js"
    );
    
    var scripts = document.getElementsByTagName("script");
    var parts = scripts[scripts.length-1].src.split("/");
    parts.pop();
    var path = parts.join("/");

    var appendable = !(/MSIE/.test(navigator.userAgent) ||
                       /Safari/.test(navigator.userAgent));
    var pieces = new Array(jsfiles.length);

    var element = document.getElementsByTagName("head").length ?
                    document.getElementsByTagName("head")[0] :
                    document.body;
    var script, src;

    for(var i=0; i<jsfiles.length; i++) {
        src = path + "/" + jsfiles[i];
        if(!appendable) {
            pieces[i] = "<script src='" + src + "'></script>"; 
        } else {
            script = document.createElement("script");
            script.src = src;
            element.appendChild(script);
        }
    }
    if(!appendable) {
        document.write(pieces.join(""));
    }
})();
