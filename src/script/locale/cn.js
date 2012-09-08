/**
 * @requires GeoExt/Lang.js
 */

GeoExt.Lang.add("en", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "图层"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "添加图层",
        addActionTip: "添加图层",
        addServerText: "添加新服务器",
        addButtonText: "添加图层",
        untitledText: "无标题",
        addLayerSourceErrorText: "Error getting WMS capabilities ({msg}).\nPlease check the url and try again.",
        availableLayersText: "Available Layers现有图层",
        expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>",
        panelTitleText: "Title标题",
        layerSelectionText: "View available data from:",
        doneText: "Done完成",
        uploadText: "Upload layers上传图层"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Bing LayersBing图层",
        roadTitle: "Bing道路",
        aerialTitle: "Bing AerialBing航空图片",
        labeledAerialTitle: "Bing Aerial With Labels"
    },

    "gxp.plugins.FeatureEditor.prototype": {
        splitButtonText: "Edit编辑",
        createFeatureActionText: "Create创建",
        editFeatureActionText: "Modify修改",
        createFeatureActionTip: "Create a new feature创建新图形",
        editFeatureActionTip: "Edit existing feature修改现有图形"
    },
    
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Display on map在地图上显示",
        firstPageTip: "First page首页",
        previousPageTip: "Previous page前一页",
        zoomPageExtentTip: "Zoom to page extent扩展到页面尺寸",
        nextPageTip: "Next page下一页",
        lastPageTip: "Last page最后一页",
        totalMsg: "Features {1} to {2} of {0}"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        menuText: "3D Viewer3D视角",
        tooltip: "Switch to 3D Viewer切换到3D视角"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google LayersGoogle图层",
        roadmapAbstract: "Show street map显示街道地图",
        satelliteAbstract: "Show satellite imagery显示卫星图",
        hybridAbstract: "Show imagery with street names显示卫星图及街道名称",
        terrainAbstract: "Show street map with terrain显示街道图和地形"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Layer Properties图层属性",
        toolTip: "Layer Properties图层属性"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        shortTitle: "Layers图层",
        rootNodeText: "Layers图层",
        overlayNodeText: "Overlays叠加",
        baseNodeText: "Base Layers底图层"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Show Legend显示图例",
        tooltip: "Show Legend显示图例"
    },

    "gxp.plugins.LoadingIndicator.prototype": {
        loadingMapMessage: "Loading Map...读取地图..."
    },

    "gxp.plugins.MapBoxSource.prototype": {
        title: "MapBox LayersMapBox图层",
        blueMarbleTopoBathyJanTitle: "Blue Marble Topography & Bathymetry (January)蓝大理石地形图和湖盆图（一月）",
        blueMarbleTopoBathyJulTitle: "Blue Marble Topography & Bathymetry (July)蓝大理石地形图和湖盆图（七月)",
        blueMarbleTopoJanTitle: "Blue Marble Topography (January)蓝大理石地形图（一月）",
        blueMarbleTopoJulTitle: "Blue Marble Topography (July)蓝大理石地形图（七月）",
        controlRoomTitle: "Control Room",
        geographyClassTitle: "Geography Class",
        naturalEarthHypsoTitle: "Natural Earth Hypsometric",
        naturalEarthHypsoBathyTitle: "Natural Earth Hypsometric & Bathymetry",
        naturalEarth1Title: "Natural Earth I",
        naturalEarth2Title: "Natural Earth II",
        worldDarkTitle: "World Dark",
        worldLightTitle: "World Light",
        worldPrintTitle: "World Print"
    },

    "gxp.plugins.Measure.prototype": {
        buttonText: "Measure测量",
        lengthMenuText: "Length长度",
        areaMenuText: "Area面积",
        lengthTooltip: "Measure length测量长度",
        areaTooltip: "Measure area测量面积",
        measureTooltip: "Measure测量"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Pan Map平移地图",
        tooltip: "Pan Map平移地图"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom To Previous Extent聚焦到前一尺寸",
        nextMenuText: "Zoom To Next Extent聚集到下一尺寸",
        previousTooltip: "Zoom To Previous Extent聚焦到前一尺寸",
        nextTooltip: "Zoom To Next Extent聚焦到下一尺寸"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap LayersOpenStreetMap图层",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        buttonText:"Print打印",
        menuText: "Print Map打印地图",
        tooltip: "Print Map打印地图",
        previewText: "Print Preview打印预览",
        notAllNotPrintableText: "Not All Layers Can Be Printed不是所有图层都可被打印",
        nonePrintableText: "None of your current map layers can be printed现有图层都不可打印"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest LayersMapQuest图层",
        osmAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest ImageryMapQuest图片"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Query搜索",
        queryMenuText: "Query layer搜索图层",
        queryActionTip: "Query the selected layer搜索被选择的图层",
        queryByLocationText: "Query by current map extent根据现有地图尺寸搜索",
        queryByAttributesText: "Query by attributes根据属性搜索",
        queryMsg: "Querying...搜索中...",
        cancelButtonText: "Cancel取消",
        noFeaturesTitle: "No Match没有吻合对象",
        noFeaturesMessage: "Your query did not return any results.您的搜索没有任何结果"
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Remove layer删除图层",
        removeActionTip: "Remove layer删除图层"
    },
    
    "gxp.plugins.Styler.prototype": {
        menuText: "Edit Styles修改式样",
        tooltip: "Manage layer styles管理图层式样"

    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        buttonText:"Identify",
        infoActionTip: "Get Feature Info获取图形信息",
        popupTitle: "Feature Info图形信息"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomMenuText: "Zoom Box聚焦框",
        zoomInMenuText: "Zoom In放大",
        zoomOutMenuText: "Zoom Out缩小",
        zoomTooltip: "Zoom by dragging a box通过划框聚焦",
        zoomInTooltip: "Zoom in放大",
        zoomOutTooltip: "Zoom out缩小"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom To Max Extent聚焦到最大尺寸",
        tooltip: "Zoom To Max Extent聚焦到最大尺寸"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom to layer extent聚焦到图层尺寸",
        tooltip: "Zoom to layer extent聚焦到图层尺寸"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom to layer extent聚焦到图层尺寸",
        tooltip: "Zoom to layer extent聚焦到图层尺寸"
    },
    
    "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Zoom to selected features聚焦到被选的图形",
        tooltip: "Zoom to selected features聚焦到被选的图形","
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Save Changes?保存修改",
        closeMsg: "This feature has unsaved changes. Would you like to save your changes?图形修改未被保存，您打算保存这些修改么？",
        deleteMsgTitle: "Delete Feature?删除图形?",
        deleteMsg: "Are you sure you want to delete this feature?确定您要删除这些图形？",
        editButtonText: "Edit修改",
        editButtonTooltip: "Make this feature editable",
        deleteButtonText: "Delete删除",
        deleteButtonTooltip: "Delete this feature删除这一图形",
        cancelButtonText: "Cancel取消",
        cancelButtonTooltip: "Stop editing, discard changes停止修改，放弃修改",
        saveButtonText: "Save保存",
        saveButtonTooltip: "Save changes保存修改"
    },
    
    "gxp.FillSymbolizer.prototype": {
        fillText: "Fill",
        colorText: "Color",
        opacityText: "Opacity"
    },
    
    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["any", "all", "none", "not all"],
        preComboText: "Match",
        postComboText: "of the following:",
        addConditionText: "add condition",
        addGroupText: "add group",
        removeConditionText: "remove condition"
    },
    
    "gxp.grid.CapabilitiesGrid.prototype": {
        nameHeaderText : "Name",
        titleHeaderText : "Title",
        queryableHeaderText : "Queryable",
        layerSelectionLabel: "View available data from:",
        layerAdditionLabel: "or add a new server.",
        expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>"
    },
    
    "gxp.PointSymbolizer.prototype": {
        graphicCircleText: "circle",
        graphicSquareText: "square",
        graphicTriangleText: "triangle",
        graphicStarText: "star",
        graphicCrossText: "cross",
        graphicXText: "x",
        graphicExternalText: "external",
        urlText: "URL",
        opacityText: "opacity",
        symbolText: "Symbol",
        sizeText: "Size",
        rotationText: "Rotation"
    },

    "gxp.QueryPanel.prototype": {
        queryByLocationText: "Query by location根据方位查询",
        currentTextText: "Current extent现有尺寸",
        queryByAttributesText: "Query by attributes根据属性查询",
        layerText: "Layer图层"
    },
    
    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
        labelFeaturesText: "Label Features",
        labelsText: "Labels",
        basicText: "Basic基本",
        advancedText: "Advanced高级",
        limitByScaleText: "Limit by scale",
        limitByConditionText: "Limit by condition",
        symbolText: "Symbol标志",
        nameText: "Name名字"
    },
    
    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
        minScaleLimitText: "Min scale limit",
        maxScaleLimitText: "Max scale limit"
    },
    
    "gxp.StrokeSymbolizer.prototype": {
        solidStrokeName: "solid实线",
        dashStrokeName: "dash虚线",
        dotStrokeName: "dot点线",
        titleText: "Stroke",
        styleText: "Style样式",
        colorText: "Color颜色",
        widthText: "Width宽度",
        opacityText: "Opacity"
    },
    
    "gxp.StylePropertiesDialog.prototype": {   
        titleText: "General常规",
        nameFieldText: "Name名称",
        titleFieldText: "Title标题",
        abstractFieldText: "Abstract简介"
    },
    
    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Label values",
        haloText: "Halo",
        sizeText: "Size"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "About关于",
        titleText: "Title标题",
        nameText: "Name名字",
        descriptionText: "Description描述",
        displayText: "Display显示",
        opacityText: "Opacity",
        formatText: "Format格式",
        transparentText: "Transparent透明度",
        cacheText: "Cache",
        cacheFieldText: "Use cached version",
        stylesText: "Styles式样",
        infoFormatText: "Info format格式信息",
        infoFormatEmptyText: "Select a format选择一种格式"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Your map is ready to be published to the web! Simply copy the following HTML to embed the map in your website:",
        heightLabel: 'Height高',
        widthLabel: 'Width宽',
        mapSizeLabel: 'Map Size地图大小',
        miniSizeLabel: 'Mini迷你',
        smallSizeLabel: 'Small小',
        premiumSizeLabel: 'Premium最佳',
        largeSizeLabel: 'Large大'
    },
    
    "gxp.WMSStylesDialog.prototype": {
         addStyleText: "Add添加",
         addStyleTip: "Add a new style添加新式样",
         chooseStyleText: "Choose style选择式样",
         deleteStyleText: "Remove移除",
         deleteStyleTip: "Delete the selected style删除选择的式样",
         editStyleText: "Edit修改",
         editStyleTip: "Edit the selected style修改选好的式样",
         duplicateStyleText: "Duplicate复制",
         duplicateStyleTip: "Duplicate the selected style复制选好的式样",
         addRuleText: "Add添加",
         addRuleTip: "Add a new rule添加新规则",
         newRuleText: "New Rule新规则",
         deleteRuleText: "Remove移除",
         deleteRuleTip: "Delete the selected rule删除选好的规则",
         editRuleText: "Edit修改",
         editRuleTip: "Edit the selected rule修改选好的规则",
         duplicateRuleText: "Duplicate复制",
         duplicateRuleTip: "Duplicate the selected rule复制选好的规则",
         cancelText: "Cancel取消",
         saveText: "Save保存",
         styleWindowTitle: "User Style: {0}",
         ruleWindowTitle: "Style Rule: {0}",
         stylesFieldsetTitle: "Styles式样",
         rulesFieldsetTitle: "Rules规则"
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Title标题",
        titleEmptyText: "Layer title图层标题",
        abstractLabel: "Description描述",
        abstractEmptyText: "Layer description图层描述",
        fileLabel: "Data数据",
        fieldEmptyText: "Browse for data archive...搜索数据档案",
        uploadText: "Upload上传",
        waitMsgText: "Uploading your data...上传您的数据",
        invalidFileExtensionText: "File extension must be one of: ",
        optionsText: "Options",
        workspaceLabel: "Workspace",
        workspaceEmptyText: "Default workspace",
        dataStoreLabel: "Store",
        dataStoreEmptyText: "Create new store",
        defaultDataStoreEmptyText: "Default data store"
    },
    
    "gxp.NewSourceDialog.prototype": {
        title: "Add New Server...添加新服务器...",
        cancelText: "Cancel取消",
        addServerText: "Add Server添加服务器",
        invalidURLText: "Enter a valid URL to a WMS endpoint 请添加有效的URL和WMS节点(比如e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Contacting Server...联接服务器中..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Zoom level"
    }

});
