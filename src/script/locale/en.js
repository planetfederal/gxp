/**
 * @requires GeoExt/Lang.js
 */

GeoExt.Lang.add("en", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Layer"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Add layers",
        addActionTip: "Add layers",
        addServerText: "Add a New Server",
        addButtonText: "Add layers",
        addButtonTextTip: "Add this layer to the map",
        addButtonInfo: "Show metadata for this Layer",
        untitledText: "Untitled",
        addLayerSourceErrorText: "Error getting WMS capabilities ({msg}).\nPlease check the url and try again.",
        availableLayersText: "Available Layers",
        expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>",
        panelTitleText: "Title",
        layerSelectionText: "View available data from:",
        doneText: "Done",
        layerNameText: 'Name',
        layerAbstractText: 'Abstract',
        layerQueryableText: 'Queryable',
        searchLayersEmptyText: 'Search layers',
        searchLayersSearchText: 'Search',
        sortLayersText: 'Sort alphabetically',
        sortLayersTextTip: 'Sort the layers alphabetically (asc/descending) by title.',
        uploadText: "Upload layers",
        addFeedActionMenuText: "Add feeds",
        searchText: "Search for layers",
        findActionMenuText: "Find layers",
        findActionTip: "Find layers in catalogue"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Bing Layers",
        roadTitle: "Bing Roads",
        aerialTitle: "Bing Aerial",
        labeledAerialTitle: "Bing Aerial With Labels"
    },

    "gxp.plugins.FeatureEditor.prototype": {
        splitButtonText: "Edit",
        createFeatureActionText: "Create",
        editFeatureActionText: "Modify",
        createFeatureActionTip: "Create a new feature",
        editFeatureActionTip: "Edit existing feature",
        commitTitle: "Commit message",
        commitText: "Please enter a commit message for this edit:"
    },
    
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Display on map",
        firstPageTip: "First page",
        previousPageTip: "Previous page",
        zoomPageExtentTip: "Zoom to page extent",
        nextPageTip: "Next page",
        lastPageTip: "Last page",
        totalMsg: "Features {1} to {2} of {0}"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        menuText: "3D Viewer",
        tooltip: "Switch to 3D Viewer"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google Layers",
        roadmapAbstract: "Show street map",
        satelliteAbstract: "Show satellite imagery",
        hybridAbstract: "Show imagery with street names",
        terrainAbstract: "Show street map with terrain"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Layer Properties",
        toolTip: "Layer Properties"
    },

    "gxp.plugins.OpacitySlider.prototype": {
        menuText: "Change Opacity",
        toolTip: "Change Layer Opacity"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        shortTitle: "Layers",
        rootNodeText: "Layers",
        overlayNodeText: "Overlays",
        baseNodeText: "Base Layers"
    },

    "gxp.plugins.LayerManager.prototype": {
        baseNodeText: "Base Maps"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Show legend",
        tooltip: "Show legend"
    },

    "gxp.plugins.LoadingIndicator.prototype": {
        loadingMapMessage: "Loading map..."
    },

    "gxp.plugins.MapBoxSource.prototype": {
        title: "MapBox Layers",
        blueMarbleTopoBathyJanTitle: "Blue Marble Topography & Bathymetry (January)",
        blueMarbleTopoBathyJulTitle: "Blue Marble Topography & Bathymetry (July)",
        blueMarbleTopoJanTitle: "Blue Marble Topography (January)",
        blueMarbleTopoJulTitle: "Blue Marble Topography (July)",
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
        buttonText: "Measure",
        lengthMenuText: "Length",
        areaMenuText: "Area",
        lengthTooltip: "Measure length",
        areaTooltip: "Measure area",
        measureTooltip: "Measure"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Pan map",
        tooltip: "Pan map"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom to previous extent",
        nextMenuText: "Zoom to next extent",
        previousTooltip: "Zoom to previous extent",
        nextTooltip: "Zoom to next extent"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap Layers",
        mapnikAttribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        buttonText:"Print",
        menuText: "Print map",
        tooltip: "Print map",
        previewText: "Print Preview",
        notAllNotPrintableText: "Not All Layers Can Be Printed",
        nonePrintableText: "None of your current map layers can be printed"
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
        queryByLocationText: "Query by current map extent",
        queryByAttributesText: "Query by attributes",
        queryMsg: "Querying...",
        cancelButtonText: "Cancel",
        noFeaturesTitle: "No Match",
        noFeaturesMessage: "Your query did not return any results."
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Remove layer",
        removeActionTip: "Remove layer"
    },
    
    "gxp.plugins.Styler.prototype": {
        menuText: "Layer Styles",
        tooltip: "Layer Styles"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        buttonText:"Identify",
        infoActionTip: "Get Feature Info",
        popupTitle: "Feature Info"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomMenuText: "Zoom box",
        zoomInMenuText: "Zoom in",
        zoomOutMenuText: "Zoom out",
        zoomTooltip: "Zoom by dragging a box",
        zoomInTooltip: "Zoom in",
        zoomOutTooltip: "Zoom out"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom to max extent",
        tooltip: "Zoom to max extent"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom to layer extent",
        tooltip: "Zoom to layer extent"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom to layer extent",
        tooltip: "Zoom to layer extent"
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
        graphicCircleText: "Circle",
        graphicSquareText: "Square",
        graphicTriangleText: "Triangle",
        graphicStarText: "Star",
        graphicCrossText: "Cross",
        graphicXText: "X",
        graphicExternalText: "External",
        urlText: "URL",
        opacityText: "Opacity",
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
        labelsText: "Labels",
        basicText: "Basic",
        advancedText: "Advanced",
        limitByScaleText: "Limit by scale",
        limitByConditionText: "Limit by condition",
        symbolText: "Symbol",
        nameText: "Name"
    },
    
    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
        minScaleLimitText: "Min scale limit",
        maxScaleLimitText: "Max scale limit"
    },
    
    "gxp.StrokeSymbolizer.prototype": {
        solidStrokeName: "Solid",
        dashStrokeName: "Dash",
        dotStrokeName: "Dot",
        titleText: "Stroke",
        styleText: "Style",
        colorText: "Color",
        widthText: "Width (px)",
        opacityText: "Opacity"
    },
    
    "gxp.StylePropertiesDialog.prototype": {   
        titleText: "General",
        nameFieldText: "Name",
        titleFieldText: "Title",
        abstractFieldText: "Abstract"
    },
    
    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Label values",
        haloText: "Halo",
        sizeText: "Size",
        priorityText: "Priority",
        labelOptionsText: "Label options",
        autoWrapText: "Auto wrap",
        followLineText: "Follow line",
        maxDisplacementText: "Maximum displacement",
        repeatText: "Repeat",
        forceLeftToRightText: "Force left to right",
        groupText: "Grouping",
        spaceAroundText: "Space around",
        labelAllGroupText: "Label all segments in line group",
        maxAngleDeltaText: "Maximum angle delta",
        conflictResolutionText: "Conflict resolution",
        goodnessOfFitText: "Goodness of fit",
        polygonAlignText: "Polygon alignment",
        graphicResizeText: "Graphic resize",
        graphicMarginText: "Graphic margin",
        graphicTitle: "Graphic",
        fontColorTitle: "Font color and opacity",
        positioningText: "Label positioning",
        anchorPointText: "Anchor point",
        displacementXText: "Displacement (X-direction)",
        displacementYText: "Displacement (Y-direction)",
        perpendicularOffsetText: "Perpendicular offset",
        priorityHelp: "The higher the value of the specified field, the sooner the label will be drawn (which makes it win in the conflict resolution game)",
        autoWrapHelp: "Wrap labels that exceed a certain length in pixels",
        followLineHelp: "Should the label follow the geometry of the line?",
        maxDisplacementHelp: "Maximum displacement in pixels if label position is busy",
        repeatHelp: "Repeat labels after a certain number of pixels",
        forceLeftToRightHelp: "Labels are usually flipped to make them readable. If the character happens to be a directional arrow then this is not desirable",
        groupHelp: "Grouping works by collecting all features with the same label text, then choosing a representative geometry for the group. Road data is a classic example to show why grouping is useful. It is usually desirable to display only a single label for all of 'Main Street', not a label for every block of 'Main Street.'",
        spaceAroundHelp: "Overlapping and Separating Labels. By default GeoServer will not render labels 'on top of each other'. By using the spaceAround option you can either allow labels to overlap, or add extra space around labels. The value supplied for the option is a positive or negative size in pixels. Using the default value of 0, the bounding box of a label cannot overlap the bounding box of another label.",
        labelAllGroupHelp: "The labelAllGroup option makes sure that all of the segments in a line group are labeled instead of just the longest one.",
        conflictResolutionHelp: "By default labels are subjected to conflict resolution, meaning the renderer will not allow any label to overlap with a label that has been drawn already. Setting this parameter to false pull the label out of the conflict resolution game, meaning the label will be drawn even if it overlaps with other labels, and other labels drawn after it won’t mind overlapping with it.",
        goodnessOfFitHelp: "Geoserver will remove labels if they are a particularly bad fit for the geometry they are labeling. For Polygons: the label is sampled approximately at every letter. The distance from these points to the polygon is determined and each sample votes based on how close it is to the polygon. The default value is 0.5.",
        graphic_resizeHelp: "Specifies a mode for resizing label graphics (such as highway shields) to fit the text of the label. The default mode, ‘none’, never modifies the label graphic. In stretch mode, GeoServer will resize the graphic to exactly surround the label text, possibly modifying the image’s aspect ratio. In proportional mode, GeoServer will expand the image to be large enough to surround the text while preserving its original aspect ratio.",
        maxAngleDeltaHelp: "Designed to use used in conjuection with followLine, the maxAngleDelta option sets the maximum angle, in degrees, between two subsequent characters in a curved label. Large angles create either visually disconnected words or overlapping characters. It is advised not to use angles larger than 30.",
        polygonAlignHelp: "GeoServer normally tries to place horizontal labels within a polygon, and give up in case the label position is busy or if the label does not fit enough in the polygon. This options allows GeoServer to try alternate rotations for the labels. Possible options: the default value, only the rotation manually specified in the <Rotation> tag will be used (manual), If the label does not fit horizontally and the polygon is taller than wider the vertical alignement will also be tried (ortho), If the label does not fit horizontally the minimum bounding rectangle will be computed and a label aligned to it will be tried out as well (mbr).",
        graphic_marginHelp: "Similar to the margin shorthand property in CSS for HTML, its interpretation varies depending on how many margin values are provided: 1 = use that margin length on all sides of the label 2 = use the first for top & bottom margins and the second for left & right margins. 3 = use the first for the top margin, second for left & right margins, third for the bottom margin. 4 = use the first for the top margin, second for the right margin, third for the bottom margin, and fourth for the left margin.",
    },
    
    "gxp.WMSLayerPanel.prototype": {
        attributionText: "Attribution",
        aboutText: "About",
        titleText: "Title",
        nameText: "Name",
        descriptionText: "Description",
        displayText: "Display",
        opacityText: "Opacity",
        formatText: "Format",
        transparentText: "Transparent",
        cacheText: "Cache",
        cacheFieldText: "Use cached version",
        stylesText: "Available Styles",
        infoFormatText: "Info format",
        infoFormatEmptyText: "Select a format",
        displayOptionsText: "Display options",
        queryText: "Limit with filters",
        scaleText: "Limit by scale",
        minScaleText: "Min scale",
        maxScaleText: "Max scale",
        switchToFilterBuilderText: "Switch back to filter builder",
        cqlPrefixText: "or ",
        cqlText: "use CQL filter instead",
        singleTileText: "Single tile",
        singleTileFieldText: "Use a single tile"
    },

    "gxp.WMSStylesDialog.prototype": {
         chooseStyleText: "Choose style",
         stylesFieldsetTitle: "Styles",
         rulesFieldsetTitle: "Rules"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Your map is ready to be published to the web! Simply copy the following HTML to embed the map in your website:",
        heightLabel: 'Height',
        widthLabel: 'Width',
        mapSizeLabel: 'Map Size',
        miniSizeLabel: 'Mini',
        smallSizeLabel: 'Small',
        premiumSizeLabel: 'Premium',
        largeSizeLabel: 'Large'
    },
    
    "gxp.StylesDialog.prototype": {
         addStyleText: "Add",
         addStyleTip: "Add a new style",
         chooseStyleText: "Choose style",
         deleteStyleText: "Remove",
         deleteStyleTip: "Delete the selected style",
         editStyleText: "Edit",
         editStyleTip: "Edit the selected style",
         duplicateStyleText: "Duplicate",
         duplicateStyleTip: "Duplicate the selected style",
         addRuleText: "Add",
         addRuleTip: "Add a new rule",
         newRuleText: "New Rule",
         deleteRuleText: "Remove",
         deleteRuleTip: "Delete the selected rule",
         editRuleText: "Edit",
         editRuleTip: "Edit the selected rule",
         duplicateRuleText: "Duplicate",
         duplicateRuleTip: "Duplicate the selected rule",
         cancelText: "Cancel",
         saveText: "Save",
         styleWindowTitle: "User Style: {0}",
         ruleWindowTitle: "Style Rule: {0}",
         stylesFieldsetTitle: "Styles",
         rulesFieldsetTitle: "Rules"
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Title",
        titleEmptyText: "Layer title",
        abstractLabel: "Description",
        abstractEmptyText: "Layer description",
        fileLabel: "Data",
        fieldEmptyText: "Browse for data archive...",
        uploadText: "Upload",
        uploadFailedText: "Upload failed",
        processingUploadText: "Processing upload...",
        waitMsgText: "Uploading your data...",
        invalidFileExtensionText: "File extension must be one of: ",
        optionsText: "Options",
        workspaceLabel: "Workspace",
        workspaceEmptyText: "Default workspace",
        dataStoreLabel: "Store",
        dataStoreEmptyText: "Choose a store",
        dataStoreNewText: "Create new store",
        crsLabel: "CRS",
        crsEmptyText: "Coordinate Reference System ID",
        invalidCrsText: "CRS identifier should be an EPSG code (e.g. EPSG:4326)"
    },
    
    "gxp.NewSourceDialog.prototype": {
        title: "Add new server...",
        cancelText: "Cancel",
        addServerText: "Add Server",
        invalidURLText: "Enter a valid URL to a WMS endpoint (e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Contacting Server..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Zoom level"
    },

    "gxp.Viewer.prototype": {
        saveErrorText: "Trouble saving: "
    },

    "gxp.FeedSourceDialog.prototype": {
        feedTypeText: "Source",
        addPicasaText: "Picasa Photos",
        addYouTubeText: "YouTube Videos",
        addRSSText: "Other GeoRSS Feed",
        addFeedText: "Add to Map",
        addTitleText: "Title",
        keywordText: "Keyword",
        doneText: "Done",
        titleText: "Add Feeds",
        maxResultsText: "Max Items"
    },

    "gxp.CatalogueSearchPanel.prototype": {
        searchFieldEmptyText: "Search",
        searchButtonText: "Search",
        addTooltip: "Create filter",
        addMapTooltip: "Add to map",
        advancedTitle: "Advanced",
        datatypeLabel: "Data type",
        extentLabel: "Spatial extent",
        categoryLabel: "Category",
        datasourceLabel: "Data source",
        filterLabel: "Filter search by",
        removeSourceTooltip: "Switch back to original source",
        showMetaDataTooltip: "Show full metadata"
    }

});
