/**
 * @requires GeoExt/Lang.js
 */

GeoExt.Lang.add("hr", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Sloj"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Dodaj sloj",
        addActionTip: "Dodaj slojeve",
        addServerText: "Dodaj server",
        addButtonText: "Dodaj slojeve",
        untitledText: "Neimenovano",
        addLayerSourceErrorText: "Greška u dohvatu WMS mogućnosti ({msg}).\nMolimo pregledajte i pokušajte ponovno.",
        availableLayersText: "Dostupni slojevi",
        expanderTemplateText: "<p><b>Sažetak:</b> {abstract}</p>",
        panelTitleText: "Naziv",
        layerSelectionText: "Pregledaj dostupne podatke iz:",
        doneText: "Gotovo",
        layerNameText: 'Naziv',
        layerAbstractText: 'Sažetak',
        layerQueryableText: 'Pretraživo',
        searchLayersEmptyText: 'Pretraži slojeve',
        searchLayersSearchText: 'Traži',
        sortLayersText: 'Poredaj po abecedi',
        uploadText: "Podizanje slojeva",
        addFeedActionMenuText: "Dodaj feed",
        searchText: "pretraži slojeve",
        findActionMenuText: "Pronađi slojeve",
        findActionTip: "Pronađi slojeve u katalogu"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Bing slojevi",
        roadTitle: "Bing ceste",
        aerialTitle: "Bing satelitske snimke",
        labeledAerialTitle: "Bing satelit s oznakama"
    },

    "gxp.plugins.FeatureEditor.prototype": {
        splitButtonText: "Izmjeni",
        createFeatureActionText: "Kreiraj",
        editFeatureActionText: "Izmjeni",
        createFeatureActionTip: "Kreiraj novi objekt",
        editFeatureActionTip: "Izmjeni postojeće objekte",
        commitTitle: "Poruka izmjene",
        commitText: "Molimo unesite poruku izmjene za ovo uređivanje:"
    },
    
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Prikaži na karti",
        firstPageTip: "Prva strana",
        previousPageTip: "Prethodna strana",
        zoomPageExtentTip: "Prikaži na čitavoj strani",
        nextPageTip: "Slijedeća strana",
        lastPageTip: "Posljednja strana",
        totalMsg: "Objekti {1} do {2} od {0}"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        menuText: "3D Google preglednik",
        tooltip: "Prebaci na 3D preglednik"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google slojevi",
        roadmapAbstract: "Prikaži street map",
        satelliteAbstract: "Prikaži satelitske snimke",
        hybridAbstract: "Prikaži satelitske snimke s nazivima ulica",
        terrainAbstract: "Prikaži prometnice i reljef"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Svojstva sloja",
        toolTip: "Svojstva sloja"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        shortTitle: "Slojevi",
        rootNodeText: "Slojevi",
        overlayNodeText: "Slojevi",
        baseNodeText: "Podloge"
    },

    "gxp.plugins.LayerManager.prototype": {
        baseNodeText: "Podloge"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Prikaži legendu",
        tooltip: "Prikaži legendu"
    },

    "gxp.plugins.LoadingIndicator.prototype": {
        loadingMapMessage: "Učitavanje karte..."
    },

    "gxp.plugins.MapBoxSource.prototype": {
        title: "MapBox slojevi",
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
        buttonText: "Izmjeri",
        lengthMenuText: "Duljina",
        areaMenuText: "Površina",
        lengthTooltip: "Izmjeri duljinu",
        areaTooltip: "Izmjeri površinu",
        measureTooltip: "Veličina"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Pomakni kartu",
        tooltip: "Pomakni kartu"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zumiraj na prethodni obuhvat",
        nextMenuText: "Zumiraj na slijedeći obuhvat",
        previousTooltip: "Zumiraj na prethodni obuhvat",
        nextTooltip: "Zumiraj na slijedeći obuhvat"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap slojevi",
        mapnikAttribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        buttonText:"Ispiši",
        menuText: "Ispiši kartu",
        tooltip: "Ispiši kartu",
        previewText: "Pretpregled ispisa",
        notAllNotPrintableText: "Ne mogu se ispisati svi slojevi",
        nonePrintableText: "Niti jedan sloj sa karte se ne može ispisati"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest slojevi",
        osmAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest Imagery"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Pretraži",
        queryMenuText: "Pretraži sloj",
        queryActionTip: "Pretraži odabrani sloj",
        queryByLocationText: "Pretraži unutar vidljivog područja",
        queryByAttributesText: "Pretraži po atributima",
        queryMsg: "Pretraga...",
        cancelButtonText: "Odustani",
        noFeaturesTitle: "Nema rezultata pretrage",
        noFeaturesMessage: "Upit nije dohvatio niti jedan rezultat."
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Ukloni sloj",
        removeActionTip: "Ukloni sloj"
    },
    
    "gxp.plugins.Styler.prototype": {
        menuText: "Stilovi sloja",
        tooltip: "Stilovi sloja"

    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        buttonText:"Informacije",
        infoActionTip: "Dohvati informacije o objektu",
        popupTitle: "Informacije"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomMenuText: "Zumiranje na područje",
        zoomInMenuText: "Približi",
        zoomOutMenuText: "Udalji",
        zoomTooltip: "Zumiraj iscrtavanjem područja",
        zoomInTooltip: "Približi",
        zoomOutTooltip: "Udalji"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zumiranje na maksimalni obuhvat",
        tooltip: "Zumiranje na maksimalni obuhvat"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zumiranje na obuhvat sloja",
        tooltip: "Zumiranje na obuhvat sloja"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zumiranje na obuhvat sloja",
        tooltip: "Zumiranje na obuhvat sloja"
    },
    
    "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Zumiranje na odabrane objekte",
        tooltip: "Zumiranje na odabrane slojeve"
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Spremi promjene?",
        closeMsg: "Podaci sadržavaju nespremljene promjene. Želite li spremiti promjene?",
        deleteMsgTitle: "Izbriši objekte?",
        deleteMsg: "Želite li izbrisati ovaj objekt?",
        editButtonText: "Uredi",
        editButtonTooltip: "Učini ovaj objekt izmjenjivim",
        deleteButtonText: "Izbriši",
        deleteButtonTooltip: "Izbriši ovaj objekt",
        cancelButtonText: "Odustani",
        cancelButtonTooltip: "Zaustavi izmjenu, zanemari izmjene",
        saveButtonText: "Spremi",
        saveButtonTooltip: "Spremi izmjene"
    },
    
    "gxp.FillSymbolizer.prototype": {
        fillText: "Ispuna",
        colorText: "Boja",
        opacityText: "Prozinost"
    },
    
    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["jednom", "svima", "niti jednom", "ne svima"],
        preComboText: "Odgovara",
        postComboText: "od slijedećih uvjeta:",
        addConditionText: "dodaj uvjet",
        addGroupText: "dodaj grupu",
        removeConditionText: "ukloni uvjet"
    },
    
    "gxp.grid.CapabilitiesGrid.prototype": {
        nameHeaderText :"Naziv",
        titleHeaderText : "Naslov",
        queryableHeaderText : "Pretraživ",
        layerSelectionLabel: "Pregledaj raspoložive podatke iz:",
        layerAdditionLabel: "ili dodaj novi poslužitelj.",
        expanderTemplateText: "<p><b>Sažetak:</b> {abstract}</p>"
    },
    
    "gxp.PointSymbolizer.prototype": {
        graphicCircleText: "krug",
        graphicSquareText: "kvadrat",
        graphicTriangleText: "trokut",
        graphicStarText: "zvijezda",
        graphicCrossText: "križ",
        graphicXText: "x",
        graphicExternalText: "vanjski",
        urlText: "URL",
        opacityText: "prozironost",
        symbolText: "Simbol",
        sizeText: "Veličina",
        rotationText: "Rotacija"
    },

    "gxp.QueryPanel.prototype": {
        queryByLocationText: "Pretraži po lokaciji",
        currentTextText: "Trenutno vidljivo područje",
        queryByAttributesText: "Pretraži po atributima",
        layerText: "Sloj",
        cancelButtonText: "Odustani"
    },
    
    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} mjerilo 1:{scale}",
        labelFeaturesText: "Labeliraj objekte",
        labelsText: "Labele",
        basicText: "Osnovno",
        advancedText: "Napredno",
        limitByScaleText: "Ograniči prikaz mjerilom",
        limitByConditionText: "Ograniči prikaz uvjetom",
        symbolText: "Simbol",
        nameText: "Ime"
    },
    
    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} mjerilo 1:{scale}",
        minScaleLimitText: "Min mjerilo",
        maxScaleLimitText: "Max mjerilo"
    },
    
    "gxp.StrokeSymbolizer.prototype": {
        solidStrokeName: "puna",
        dashStrokeName: "isprekidana",
        dotStrokeName: "točkasta",
        titleText: "Vrsta linije",
        styleText: "Stil",
        colorText: "Boja",
        widthText: "Širina",
        opacityText: "Prozirnost"
    },
    
    "gxp.StylePropertiesDialog.prototype": {   
        titleText: "Općenito",
        nameFieldText: "Ime",
        titleFieldText: "Naziv",
        abstractFieldText: "Abstract"
    },
    
    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Vrijednosti labela",
        haloText: "Halo",
        sizeText: "Veličina"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        attributionText: "Atribut",
        aboutText: "O sloju",
        titleText: "Naslov",
        nameText: "Ime",
        descriptionText: "Opis",
        displayText: "Prikaz",
        opacityText: "Prozirnost",
        formatText: "Format",
        transparentText: "Transparentno",
        cacheText: "Predmemorija",
        cacheFieldText: "Koristi predmemoriranu verziju",
        stylesText: "Dostupni stilovi",
        infoFormatText: "Info format",
        infoFormatEmptyText: "Odaberi format",
        displayOptionsText: "Mogućnosti prikaza",
        queryText: "Ograniči filtrom",
        scaleText: "Ograniči mjerilom",
        minScaleText: "Min. mjerilo",
        maxScaleText: "Max. mjerilo",
        switchToFilterBuilderText: "Povratak na izradu filtra",
        cqlPrefixText: "ili ",
        cqlText: "koristi CQL filter",
        singleTileText: "Single tile",
        singleTileFieldText: "Ne koristi mozaični prikaz"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Vaša karta je spremna za objavu na webu! Kopirajte slijedeći HTML kod da bi ovu kartu ugradili na vašu web stranicu:",
        heightLabel: 'Visina',
        widthLabel: 'Širina',
        mapSizeLabel: 'Veličina karte',
        miniSizeLabel: 'Mini',
        smallSizeLabel: 'Mali',
        premiumSizeLabel: 'Premium',
        largeSizeLabel: 'Veliki'
    },
    
    "gxp.StylesDialog.prototype": {
         addStyleText: "Dodaj",
         addStyleTip: "Dodaj novi stil",
         chooseStyleText: "Odaberi stil",
         deleteStyleText: "Ukloni",
         deleteStyleTip: "Ukloni odabrani stil",
         editStyleText: "Uredi",
         editStyleTip: "Uredi odabrani stil",
         duplicateStyleText: "Dupliciraj",
         duplicateStyleTip: "Dupliciraj odabrani stil",
         addRuleText: "Dodaj",
         addRuleTip: "Dodaj novo pravilo",
         newRuleText: "Novo pravilo",
         deleteRuleText: "Ukloni",
         deleteRuleTip: "Ukloni odabrano pravilo",
         editRuleText: "Uredi",
         editRuleTip: "Uredi odabrano pravilo",
         duplicateRuleText: "Dupliciraj",
         duplicateRuleTip: "Dupliciraj odabrano pravilo",
         cancelText: "Odustani",
         saveText: "Spremi",
         styleWindowTitle: "Uređeni stil: {0}",
         ruleWindowTitle: "Pravilo stila: {0}",
         stylesFieldsetTitle: "Stilovi",
         rulesFieldsetTitle: "Pravila"
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Naslov",
        titleEmptyText: "Naslov sloja",
        abstractLabel: "Opis",
        abstractEmptyText: "Opis sloja",
        fileLabel: "Podaci",
        fieldEmptyText: "Pregledaj za arhivu podataka...",
        uploadText: "Prijenos",
        uploadFailedText: "Neuspješan prijenos",
        processingUploadText: "Obrada prijenosa...",
        waitMsgText: "Prijenos vaših podataka...",
        invalidFileExtensionText: "Ekstenzija datoteke mora biti jedna od: ",
        optionsText: "Mogućnosti",
        workspaceLabel: "Radni prostor",
        workspaceEmptyText: "Zadani radni prostor",
        dataStoreLabel: "Mjesto pohrane",
        dataStoreEmptyText: "Stvori novo mjesto pohrane",
        defaultDataStoreEmptyText: "Zadano mjesto pohrane",
        dataStoreNewText: "Stvori novo mjesto pohrane",
        crsLabel: "CRS",
        crsEmptyText: "ID koordinatnog referentnog sustava",
        invalidCrsText: "CRS identifikator mora biti EPSG kod (npr. EPSG:4326)"
    },
    
    "gxp.NewSourceDialog.prototype": {
        title: "Dodaj novi poslužitelj...",
        cancelText: "Odustani",
        addServerText: "Dodaj poslužitelj",
        invalidURLText: "Unesi ispravan URL do WMS poslužitelja (npr. http://geoportal.dgu.hr/wms)",
        contactingServerText: "Kontaktiranje poslužitelja..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Razina zumiranja"
    },

    "gxp.Viewer.prototype": {
        saveErrorText: "Problem prilikom spremanja: "
    },

    "gxp.FeedSourceDialog.prototype": {
        feedTypeText: "Izvor",
        addPicasaText: "Picasa Photos",
        addYouTubeText: "YouTube Videos",
        addRSSText: "Drugi GeoRSS Feed",
        addFeedText: "Dodaj na kartu",
        addTitleText: "Naslov",
        keywordText: "Ključna riječ",
        doneText: "Gotovo",
        titleText: "Dodaj feed-ove",
        maxResultsText: "Maksimalno objekata"
    },
    
    "gxp.CatalogueSearchPanel.prototype": {
        searchFieldEmptyText: "Pretraži",
        searchButtonText: "Pretraži",
        addTooltip: "Kreiraj filter",
        addMapTooltip: "dodaj na kartu",
        advancedTitle: "Napredno",
        datatypeLabel: "Tip podatlka",
        extentLabel: "Prostorni obuhvat",
        categoryLabel: "Kategorija",
        datasourceLabel: "Izvor podatka",
        filterLabel: "Filtriraj po",
        removeSourceTooltip: "Povratak na početni izvor",
        showMetaDataTooltip: "Prikaži kompletne metapodatke"
    }

});
