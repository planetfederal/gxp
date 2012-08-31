/**
 * @requires GeoExt/Lang.js
 */

GeoExt.Lang.add("lv", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Slānis"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Pievienot slāņus",
        addActionTip: "Pievienot slāņus",
        addServerText: "Pievienot jaunu WMS serveri",
        addButtonText: "Pievienot slāņus",
        untitledText: "Bez nosaukuma",
        addLayerSourceErrorText: "Neizdevās iegūt WMS aprakstu ({msg}).\nPārbaudiet ievadīto adresi.",
        availableLayersText: "Pieejamie slāņi",
        expanderTemplateText: "<p><b>Apraksts:</b> {abstract}</p>",
        panelTitleText: "Nosaukums",
        layerSelectionText: "Apskatīt pieejamos datus no:",
        doneText: "Labi",
        uploadText: "Augšupielādēt slāņus"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Bing slāņi",
        roadTitle: "Ceļu karte (Bing Roads)",
        aerialTitle: "Satelītkarte (Bing Aerial)",
        labeledAerialTitle: "Satelītkarte ar uzrakstiem (Bing Aerial With Labels)"
    },

    "gxp.plugins.FeatureEditor.prototype": {
        splitButtonText: "Rediģēt",
        createFeatureActionText: "Izveidot jaunu",
        editFeatureActionText: "Rediģēt esošu",
        createFeatureActionTip: "Veidot jaunu objektu",
        editFeatureActionTip: "Rediģēt esošu objektu"
    },
    
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Parādīt uz kartes",
        firstPageTip: "Pirmā lapa",
        previousPageTip: "Iepriekšējā lapa",
        zoomPageExtentTip: "Pietuvināt karti pēc objektiem",
        nextPageTip: "Nākamā lapa",
        lastPageTip: "Pēdējā lapa",
        totalMsg: "Rāda {1} - {2} objektus (kopā {0})"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        menuText: "3D Skats",
        tooltip: "Pārslēgties uz 3D skatu"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google slāņi",
        roadmapAbstract: "Ielu karte",
        satelliteAbstract: "Satelītkarte",
        hybridAbstract: "Satelītkarte ar uzrakstiem",
        terrainAbstract: "Ielu karte ar reljefu"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Slāņa iestatījumi",
        toolTip: "Slāņa iestatījumi"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        shortTitle: "Slāņi",
        rootNodeText: "Slāņi",
        overlayNodeText: "Virsslāņi",
        baseNodeText: "Fona slāņi"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Kartes apzīmējumi",
        tooltip: "Parādīt kartes apzīmējumus"
    },

    "gxp.plugins.LoadingIndicator.prototype": {
        loadingMapMessage: "Ielādē karti..."
    },

    "gxp.plugins.MapBoxSource.prototype": {
        title: "MapBox slāņi",
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
        buttonText: "Mērīšana",
        lengthMenuText: "Garums",
        areaMenuText: "Platība",
        lengthTooltip: "Garums",
        areaTooltip: "Platība",
        measureTooltip: "Mērīt"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Pārvietot karti",
        tooltip: "Pārvietot karti"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Kartes iepriekšējais skatījums",
        nextMenuText: "Kartes nākamais skatījums",
        previousTooltip: "Kartes iepriekšējais skatījums",
        nextTooltip: "Kartes nākamais skatījums"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap slāņi",
        mapnikAttribution: "Dati CC-By-SA no <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Dati CC-By-SA no <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        buttonText:"Drukāt",
        menuText: "Drukāt karti",
        tooltip: "Drukāt karti",
        previewText: "Priekšskatījums",
        notAllNotPrintableText: "Dažus slāņus nav iespējams drukāt",
        nonePrintableText: "Nevienu no aktīvajiem slāņiem nevar drukāt"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest slāņi",
        osmAttribution: "Karte Courtesy no <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap karte",
        naipAttribution: "Karte Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest satelītkarte"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Meklēt",
        queryButtonText: "Meklēt",
        queryMenuText: "Meklēt datus pēc atribūtiem",
        queryActionTip: "Meklēt atzīmētajā slānī",
        queryByLocationText: "Meklēt tikai redzamajā kartes daļā",
        queryByAttributesText: "Meklēt pēc atribūtiem",
        queryMsg: "Meklē...",
        cancelButtonText: "Atcelt",
        noFeaturesTitle: "Netika atrasts",
        noFeaturesMessage: "Netika atrasts neviens objekts."
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Noņemt slāni",
        removeActionTip: "Noņemt slāni"
    },
    
    "gxp.plugins.Styler.prototype": {
        menuText: "Labot apzīmējumus",
        tooltip: "Labot slāņa apzīmējumus"

    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        buttonText:"Identificēt",
        infoActionTip: "Informācija par kartes objektiem",
        popupTitle: "Objektu informācija"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomMenuText: "Tuvināšana",
        zoomInMenuText: "Pietuvināt",
        zoomOutMenuText: "Attālināt",
        zoomTooltip: "Pietuvināt iezīmētajā taisnstūrī",
        zoomInTooltip: "Pietuvināt",
        zoomOutTooltip: "Attālināt"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Kartes kopskats",
        tooltip: "Kartes kopskats"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Atlasīto objektu kopskats",
        tooltip: "Atlasīto objektu kopskats"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Slāņa kopskats",
        tooltip: "Slāņa kopskats"
    },
    
    "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Pietuvināt atzīmētos objektus",
        tooltip: "Pietuvināt atzīmētos objektus"
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Saglabāt izmaiņas?",
        closeMsg: "Objektam ir izdarītas izmaiņas. Vai saglabāt?",
        deleteMsgTitle: "Dzēst objektu?",
        deleteMsg: "Vai esat drošs, ka vēlaties dzēst objektu?",
        editButtonText: "Labot",
        editButtonTooltip: "Labot objektu",
        deleteButtonText: "Dzēst",
        deleteButtonTooltip: "Dzēst objektu",
        cancelButtonText: "Atcelt",
        cancelButtonTooltip: "Pārtraukt labošanu un atcelt izmaiņas",
        saveButtonText: "Saglabāt",
        saveButtonTooltip: "Saglabāt izmaiņas"
    },
    
    "gxp.FillSymbolizer.prototype": {
        fillText: "Aizpildījums",
        colorText: "Krāsa",
        opacityText: "Caurspīdīgums"
    },
    
    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["jebkuram", "visiem", "nevienam", "ne visiem"],
        preComboText: "Atbilst",
        postComboText: "no nosacījumiem:",
        addConditionText: "pievienot nosacījumu",
        addGroupText: "pievienot nosacījumu grupu",
        removeConditionText: "noņemt nosacījumu"
    },
    
    "gxp.grid.CapabilitiesGrid.prototype": {
        nameHeaderText : "Slānis",
        titleHeaderText : "Nosaukums",
        queryableHeaderText : "Meklēšanas iespēja",
        layerSelectionLabel: "Pieejamie dati no:",
        layerAdditionLabel: "vai pievienot jaunu serveri.",
        expanderTemplateText: "<p><b>Apraksts:</b> {abstract}</p>"
    },
    
    "gxp.PointSymbolizer.prototype": {
        graphicCircleText: "aplis",
        graphicSquareText: "kvadrāts",
        graphicTriangleText: "trīsstūris",
        graphicStarText: "zvaigzne",
        graphicCrossText: "krusts",
        graphicXText: "x",
        graphicExternalText: "internetā",
        urlText: "adrese (URL)",
        opacityText: "caurspīdīgums",
        symbolText: "Simbols",
        sizeText: "Izmērs",
        rotationText: "Rotācija"
    },

    "gxp.QueryPanel.prototype": {
        queryByLocationText: "Meklēt kartes skatā",
        currentTextText: "Kartes skats",
        queryByAttributesText: "Meklēt pēc atribūtiem",
        layerText: "Slānis"
    },
    
    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} Mērogs 1:{scale}",
        labelFeaturesText: "Uzraksti",
        labelsText: "Uzraksti",
        basicText: "Galvenais",
        advancedText: "Papildiespējas",
        limitByScaleText: "Ierobežot pēc mēroga",
        limitByConditionText: "Ierobežot pēc nosacījuma",
        symbolText: "Kartes simbols",
        nameText: "Nosaukums"
    },
    
    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Mērogs 1:{scale}",
        minScaleLimitText: "Minimālais mērogs",
        maxScaleLimitText: "Maksimālais mērogs"
    },
    
    "gxp.StrokeSymbolizer.prototype": {
        solidStrokeName: "parasts",
        dashStrokeName: "raustīts",
        dotStrokeName: "punktots",
        titleText: "Līnija",
        styleText: "Veids",
        colorText: "Krāsa",
        widthText: "Biezums",
        opacityText: "Caurspīdīgums"
    },
    
    "gxp.StylePropertiesDialog.prototype": {   
        titleText: "Vispārīgi",
        nameFieldText: "Stils",
        titleFieldText: "Nosaukums",
        abstractFieldText: "Apraksts"
    },
    
    "gxp.TextSymbolizer.prototype" : {
		labelValuesText : "Uzrakstu atribūts",
		haloText : "Kontūra",
		sizeText : "Izmērs",
		priorityText : "Prioritāte",
		labelOptionsText : "Papildiespējas",
		autoWrapText : "Nolīdzināt",
		followLineText : "Sekot līnijai",
		maxDisplacementText : "Maksimālā novirze",
		repeatText : "Atkārtot",
		forceLeftToRightText : "No kreisās uz labo",
		graphicResizeText : "Graphic resize",
		graphicMarginText : "Graphic margin",
		graphicTitle : "Graphic",
		fontColorTitle : "Krāsa un caurspīdīgums",
		positioningText : "Novietojums",
		anchorPointText : "Piesaistes punkts",
		displacementXText : "Nobīde (pa X asi)",
		displacementYText : "Nobīde (pa Y asi)",
		perpendicularOffsetText : "Perpend. nobīde",
		priorityHelp : "The higher the value of the specified field, the sooner the label will be drawn (which makes it win in the conflict resolution game)",
		autoWrapHelp : "Pikseļu skaits, par kuru garākus uzrakstus automātiski pārnest jaunā rindā",
		followLineHelp : "Vai uzrakstam jāseko līnijas ģeometrijai?",
		maxDisplacementHelp : "Maksimālā uzraksta novirze pikseļos no sākotnējās vietas gadījumos, kad uzraksta vieta pārklāj citu uzrakstu vai objektu",
		repeatHelp : "Atkārtot uzrakstus pēc noteikta attāluma pikseļos",
		forceLeftToRightHelp : "Uzraksti tiks automātiski pagriezti, lai būtu labāk lasāmi no kreisās uz labo pusi. Šo neizmantot, ja uzrakstiem ir svarīgs virziens, piemēram, uzraksta simbols ir virziena bulta",
		graphic_resizeHelp : "Specifies a mode for resizing label graphics (such as highway shields) to fit the text of the label. The default mode, ‘none’, never modifies the label graphic. In stretch mode, GeoServer will resize the graphic to exactly surround the label text, possibly modifying the image’s aspect ratio. In proportional mode, GeoServer will expand the image to be large enough to surround the text while preserving its original aspect ratio.",
		graphic_marginHelp : "Similar to the margin shorthand property in CSS for HTML, its interpretation varies depending on how many margin values are provided: 1 = use that margin length on all sides of the label 2 = use the first for top & bottom margins and the second for left & right margins. 3 = use the first for the top margin, second for left & right margins, third for the bottom margin. 4 = use the first for the top margin, second for the right margin, third for the bottom margin, and fourth for the left margin."
	},
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "Par..",
        titleText: "Nosaukums",
        nameText: "Slānis",
        descriptionText: "Apraksts",
        displayText: "Izskats",
        opacityText: "Caurspīdīgums",
        formatText: "Formāts",
        transparentText: "Caurspīdīgs",
        cacheText: "Kešotā karte",
        cacheFieldText: "Lietot kešoto karti",
        stylesText: "Apzīmējumi",
        infoFormatText: "Informācijas formāts",
        infoFormatEmptyText: "Izvēlieties formātu"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Jūsu karte ir gatava publicēšanai internetā! Vienkārši iekopējiet HTML fragmentu mājas lapā:",
        heightLabel: 'Augstums',
        widthLabel: 'Platums',
        mapSizeLabel: 'Kartes izmērs',
        miniSizeLabel: 'Mini',
        smallSizeLabel: 'Maza',
        premiumSizeLabel: 'Liela',
        largeSizeLabel: 'Vidēja'
    },
    
    "gxp.WMSStylesDialog.prototype": {
         addStyleText: "Pievienot",
         addStyleTip: "Pievienot jaunus apzīmējumus",
         chooseStyleText: "Izvēlēties apzīmējumus",
         deleteStyleText: "Dzēst",
         deleteStyleTip: "Dzēst iezīmētos apzīmējumus",
         editStyleText: "Labot",
         editStyleTip: "Labot iezīmētos apzīmējumus",
         duplicateStyleText: "Kopēt",
         duplicateStyleTip: "Kopēt iezimētos apzīmējumus",
         addRuleText: "Pievienot",
         addRuleTip: "Pievienot jaunu apzīmējumu",
         newRuleText: "Jauns apzīmējums",
         deleteRuleText: "Dzēst",
         deleteRuleTip: "Dzēst iezīmēto apzīmējumu",
         editRuleText: "Labot",
         editRuleTip: "Labot iezīmēto apzīmējumu",
         duplicateRuleText: "Kopēt",
         duplicateRuleTip: "Kopēt iezīmēto apzīmējumu",
         cancelText: "Atcelt",
         saveText: "Saglabāt",
         styleWindowTitle: "Apzīmējumi: {0}",
         ruleWindowTitle: "Apzīmējuma nosacījums: {0}",
         stylesFieldsetTitle: "Apzīmējumi",
         rulesFieldsetTitle: "Apzīmējuma nosacījumi"
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Nosaukums",
        titleEmptyText: "Slāņa nosaukums",
        abstractLabel: "Apraksts",
        abstractEmptyText: "Slāņa apraksts",
        fileLabel: "Dati",
        fieldEmptyText: "Paņemt arhīvfailu...",
        uploadText: "Augšupielādēt",
        waitMsgText: "Augšupielādē jūsu datus...",
        invalidFileExtensionText: "Failam jābūt vienam no: ",
        optionsText: "Iespējas",
        workspaceLabel: "Darba vide",
        workspaceEmptyText: "Noklusētā darba vide",
        dataStoreLabel: "Datu glabātuve",
        dataStoreEmptyText: "Izveidot jaunu glabātuvi",
        defaultDataStoreEmptyText: "Noklusētā glabātuve"
    },
    
    "gxp.NewSourceDialog.prototype": {
        title: "Pievienot jaunu serveri...",
        cancelText: "Atcelt",
        addServerText: "Pievienot serveri",
        invalidURLText: "Ievadiet WMS servisa adresi (piemēram, http://example.com/geoserver/wms)",
        contactingServerText: "Savienojas ar serveri..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Tuvinājums"
    }

});
