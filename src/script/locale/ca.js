
GeoExt.Lang.add("ca", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Layer"
    },

    "gxp.plugins.AddLayers.prototype": {
        addMenuText: "Afegeix Capa",
        addActionTip: "Afegeix Capa",
        addServerText: "Afegeix servidor",
        untitledText: "Sense Títol",
        addLayerSourceErrorText: "Error obtenint les capabilities del WMS ({msg}).\nSi us plau, comproveu la URL i torneu-ho a intentar.",
        availableLayersText: "Capes disponibles",
        doneText: "Fet",
        uploadText: "Upload Data"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Bing Layers",
        roadTitle: "Bing Roads",
        aerialTitle: "Bing Aerial",
        labeledAerialTitle: "Bing Aerial With Labels"
    },    

    "gxp.plugins.FeatureEditor.prototype": {
        createFeatureActionTip: "Create a new feature",
        editFeatureActionTip: "Edit existing feature"
    },
    
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Display on map",
        firstPageTip: "First page",
        previousPageTip: "Previous page",
        zoomPageExtentTip: "Zoom to page extent",
        nextPageTip: "Next page",
        lastPageTip: "Last page"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google Layers",
        roadmapAbstract: "Show street map",
        satelliteAbstract: "Show satellite imagery",
        hybridAbstract: "Show imagery with street names",
        terrainAbstract: "Show street map with terrain"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Propietats de la capa",
        toolTip: "Propietats de la capa"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Capes",
        overlayNodeText: "Capes addicionals",
        baseNodeText: "Capa base"
    },

    "gxp.plugins.Legend.prototype": { 
        menuText: "Llegenda",
        tooltip: "Llegenda"
    },

    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Longitud",
        areaMenuText: "Àrea",
        lengthTooltip: "Mesura Longitud",
        areaTooltip: "Mesura Àrea",
        measureTooltip: "Mesura"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Desplaça mapa",
        tooltip: "Desplaça mapa"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Vista anterior",
        nextMenuText: "Vista següent",
        previousTooltip: "Vista anterior",
        nextTooltip: "Vista següent"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap Layers",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Imprimeix",
        tooltip: "Imprimeix",
        previewText: "Vista prèvia",
        notAllNotPrintableText: "No es poden imprimir totes les capes",
        nonePrintableText: "No es pot imprimir cap de les capes del mapa"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest Layers",
        osmAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest Imagery"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Query",
        queryMenuText: "Query layer",
        queryActionTip: "Query the selected layer",
        queryByLocationText: "Query by location",
        currentTextText: "Current extent",
        queryByAttributesText: "Query by attributes"
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Elimina Capa",
        removeActionTip: "Elimina Capa"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Consulta elements",
        popupTitle: "Informació dels elements"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Apropa",
        zoomOutMenuText: "Allunya",
        zoomInTooltip: "Apropa",
        zoomOutTooltip: "Allunya"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom To Max Extent",
        tooltip: "Zoom To Max Extent"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom to layer extent",
        tooltip: "Zoom to layer extent"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Ajusta vista a l'extensió de la capa",
        tooltip: "Ajusta vista a l'extensió de la capa"
    },
    
    "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Zoom to selected features",
        tooltip: "Zoom to selected features"
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Save Changes?",
        closeMsg: "This feature has unsaved changes. Would you like to save your changes?",
        deleteMsgTitle: "Delete Feature?",
        deleteMsg: "Are you sure you want to delete this feature?",
        editButtonText: "Edit",
        editButtonTooltip: "Make this feature editable",
        deleteButtonText: "Delete",
        deleteButtonTooltip: "Delete this feature",
        cancelButtonText: "Cancel",
        cancelButtonTooltip: "Stop editing, discard changes",
        saveButtonText: "Save",
        saveButtonTooltip: "Save changes"
    },
    
    "gxp.FillSymbolizer.prototype": {
        fillText: "Fill",
        colorText: "Color",
        opacityText: "Opacity"
    },

    "gxp.StrokeSymbolizer.prototype": {
        strokeText: "Stroke",
        styleText: "Style",
        colorText: "Color",
        widthText: "Width",
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
        layerSelectionLabel: "Llista les capes de:",
        layerAdditionLabel: "or add a new server.",
        expanderTemplateText: "<p><b>Resum:</b> {abstract}</p>"
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
        queryByLocationText: "Query by location",
        currentTextText: "Current extent",
        queryByAttributesText: "Query by attributes",
        layerText: "Layer"
    },
    
    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
        labelFeaturesText: "Label Features",
        advancedText: "Advanced",
        limitByScaleText: "Limit by scale",
        limitByConditionText: "Limit by condition",
        symbolText: "Symbol",
        nameText: "Name"
    },
    
    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
        maxScaleLimitText: "Max scale limit"
    },
    
    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Label values",
        haloText: "Halo",
        sizeText: "Size"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "About",
        titleText: "Title",
        nameText: "Name",
        descriptionText: "Description",
        displayText: "Display",
        opacityText: "Opacity",
        formatText: "Format",
        transparentText: "Transparent",
        cacheText: "Cache",
        cacheFieldText: "Use cached version"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Ja podeu incloure el vostre mapa a altres webs! Simplement copieu el següent codi HTML allà on desitgeu incrustar-ho:",
        heightLabel: 'Alçària',
        widthLabel: 'Amplada',
        mapSizeLabel: 'Mida',
        miniSizeLabel: 'Mínima',
        smallSizeLabel: 'Petita',
        premiumSizeLabel: 'Premium',
        largeSizeLabel: 'Gran'
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Title",
        titleEmptyText: "Layer title",
        abstractLabel: "Description",
        abstractEmptyText: "Layer description",
        fileLabel: "Data",
        fieldEmptyText: "Browse for data archive...",
        uploadText: "Upload",
        waitMsgText: "Uploading your data...",
        invalidFileExtensionText: "File extension must be one of: ",
        optionsText: "Options",
        workspaceLabel: "Workspace",
        workspaceEmptyText: "Default workspace",
        dataStoreLabel: "Store",
        dataStoreEmptyText: "Default datastore"
    }

});

