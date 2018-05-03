/**
 * @requires GeoExt/Lang.js
 */

GeoExt.Lang.add("de", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Layer"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Layer hinzufügen",
        addActionTip: "Layer hinzufügen",
        addServerText: "Neuen Server hinzufügen",
        addButtonText: "Layer hinzufügen",
        addButtonTextTip: "Diesen Layer zur Karte hinzufügen",
        addButtonInfo: "Metadaten für diesen Layer anzeigen",
        untitledText: "ohne Titel",
        addLayerSourceErrorText: "Fehler beim Abfragen der WMS Capabilities ({msg}).\nBitte URL prüfen und erneut versuchen.",
        availableLayersText: "Verfügbare Layer",
        expanderTemplateText: "<p><b>Kurzbeschreibung:</b> {abstract}</p>",
        panelTitleText: "Titel",
        layerSelectionText: "Verfügbare Daten anzeigen von&nbsp;&nbsp;",
        doneText: "Fertig",
        layerNameText: "Name",
        layerAbstractText: "Beschreibung",
        layerQueryableText: "Abfragbar",
        searchLayersEmptyText: 'Layer suchen...',
        searchLayersSearchText: 'Suchen',
        sortLayersText: 'Alphabetisch sortieren',
        sortLayersTextTip: 'Layer alphabetisch (auf-/absteigend) nach Name sortieren.',
        uploadText: "Layer hochladen",
        addFeedActionMenuText: "Feeds hinzufügen",
        searchText: "Nach Layer suchen",
        findActionMenuText: "Layer finden",
        findActionTip: "Layer im Katalog finden"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Bing Layer",
        roadTitle: "Bing Strassen",
        aerialTitle: "Bing Luftbilder",
        labeledAerialTitle: "Bing Luftbilder mit Beschriftung"
    },

    "gxp.plugins.FeatureEditor.prototype": {
        splitButtonText: "Editieren",
        createFeatureActionText: "Erzeugen",
        editFeatureActionText: "Bearbeiten",
        createFeatureActionTip: "Neues Objekt erstellen",
        editFeatureActionTip: "Bestehendes Objekt bearbeiten",
        commitTitle: "Nachricht verfassen",
        commitText: "Bitte geben Sie eine Bestätigungsnachricht f�r diese Änderung ein:"
    },
    
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "auf der Karte darstellen",
        firstPageTip: "erste Seite",
        previousPageTip: "vorherige Seite",
        zoomPageExtentTip: "Zoom zur max. Ausdehnung",
        nextPageTip: "nächste Seite",
        lastPageTip: "letzte Seite",
        totalMsg: "{1} bis {2} von {0} Datensätzen"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        menuText: "3D Viewer",
        tooltip: "zum 3D Viewer wechseln"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google Layers",
        roadmapAbstract: "Strassenkarte zeigen",
        satelliteAbstract: "Luftbilder zeigen",
        hybridAbstract: "Luftbilder mit Strassennamen zeigen",
        terrainAbstract: "Strassenkarte mit Gelände zeigen"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Layer Eigenschaften",
        toolTip: "Layer Eigenschaften"
    },

    "gxp.plugins.OpacitySlider.prototype": {
        menuText: "Tranzparenz ändern",
        toolTip: "Layer Tranzparenz ändern"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        shortTitle: "Layer",
        rootNodeText: "Layer",
        overlayNodeText: "überlagernde Layer",
        baseNodeText: "Basiskarten"
    },
    
    "gxp.plugins.LayerManager.prototype": {
        baseNodeText: "Basiskarte"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Legende zeigen",
        tooltip: "Legende zeigen"
    },

    "gxp.plugins.LoadingIndicator.prototype": {
        loadingMapMessage: "Karte laden..."
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
        buttonText: "Messen",
        lengthMenuText: "Länge",
        areaMenuText: "Fläche",
        lengthTooltip: "Länge messen",
        areaTooltip: "Fläche messen",
        measureTooltip: "Messen"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Kartenausschnitt verschieben",
        tooltip: "Kartenausschnitt verschieben"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Kartenausschnitt zurück",
        nextMenuText: "Kartenausschnitt vorwärts",
        previousTooltip: "Vorherigen Kartenausschnitt anzeigen",
        nextTooltip: "Nächsten Kartenausschnit anzeigen"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap Layer",
        mapnikAttribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        buttonText:"Drucken",
        menuText: "Karte drucken",
        tooltip: "Karte drucken",
        previewText: "Druckansicht",
        notAllNotPrintableText: "Es können nicht alle Layer gedruckt werden.",
        nonePrintableText: "Keiner der aktuellen Kartenlayer kann gedruckt werden."
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest Layers",
        osmAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest Imagery"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Abfrage",
        queryMenuText: "Abfrage Layer",
        queryActionTip: "Selektierten Layer abfragen",
        queryByLocationText: "Abfrage nach aktuellem Kartenausschnitt",
        queryByAttributesText: "Attributabfrage",
        queryMsg: "Abfrage wird ausgeführt",
        cancelButtonText: "Abbrechen",
        noFeaturesTitle: "Keine Übereinstimmung",
        noFeaturesMessage: "Ihre Abfrage liefert keine Resultate."
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Layer löschen",
        removeActionTip: "Layer löschen"
    },
    
    "gxp.plugins.Styler.prototype": {
        menuText: "Stile bearbeiten",
        tooltip: "Layer Stile verwalten"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        buttonText:"Objektinformation",
        infoActionTip: "Objektinformation abfragen",
        popupTitle: "Objektinformation"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomMenuText: "Zoom Box",
        zoomInMenuText: "Vergrössern",
        zoomOutMenuText: "Verkleinern",
        zoomTooltip: "Box aufziehen zum Zoomen",
        zoomInTooltip: "Vergrössern",
        zoomOutTooltip: "Verkleinern"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Maximale Ausdehnung",
        tooltip: "Maximale Ausdehnung anzeigen"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Auf Layer zoomen",
        tooltip: "Auf Layer zoomen"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Auf Layer zoomen",
        tooltip: "Auf Layer zoomen"
    },
    
    "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Auf selektierte Objekte zoomen",
        tooltip: "Auf selektierte Objekte zoomen"
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Änderung speichern?",
        closeMsg: "Ungespeicherte Änderungen. Möchten Sie die Änderungen speichern?",
        deleteMsgTitle: "Objekt löschen?",
        deleteMsg: "Sind Sie sicher, dass Sie dieses Objekt löschen möchten?",
        editButtonText: "Bearbeiten",
        editButtonTooltip: "Objekt editieren",
        deleteButtonText: "Löschen",
        deleteButtonTooltip: "Objekt löschen",
        cancelButtonText: "Abbrechen",
        cancelButtonTooltip: "Bearbeitung beenden, Änderungen verwerfen.",
        saveButtonText: "Speichern",
        saveButtonTooltip: "Änderungen speichern"
    },
    
    "gxp.FillSymbolizer.prototype": {
        fillText: "Füllung",
        colorText: "Farbe",
        opacityText: "Transparenz"
    },
    
    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["beliebige", "alle", "keine", "nicht alle"],
        preComboText: "Übereinstimmung ",
        postComboText: "der Bedingung(en):",
        addConditionText: "Bedingung hinzufügen",
        addGroupText: "Gruppe hinzufügen",
        removeConditionText: "Bedingung entfernen"
    },
    
    "gxp.grid.CapabilitiesGrid.prototype": {
        nameHeaderText : "Name",
        titleHeaderText : "Titel",
        queryableHeaderText : "abfragbar",
        layerSelectionLabel: "Verfügbare Daten anzeigen von:",
        layerAdditionLabel: "oder neuen Server hinzufügen.",
        expanderTemplateText: "<p><b>Kurzbeschreibung:</b> {abstract}</p>"
    },
    
    "gxp.PointSymbolizer.prototype": {
        graphicCircleText: "Kreis",
        graphicSquareText: "Rechteck",
        graphicTriangleText: "Dreieck",
        graphicStarText: "Stern",
        graphicCrossText: "Kreuz",
        graphicXText: "x",
        graphicExternalText: "extern",
        urlText: "URL",
        opacityText: "Transparenz",
        symbolText: "Symbol",
        sizeText: "Grösse",
        rotationText: "Rotation"
    },

    "gxp.QueryPanel.prototype": {
        queryByLocationText: "Lagebezogene Abfrage",
        currentTextText: "Aktuelle Ausdehnung",
        queryByAttributesText: "Attributabfrage",
        layerText: "Layer"
    },
    
    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} Ma&#223;stab 1:{scale}",
        labelFeaturesText: "Objekte beschriften",
        labelsText: "Beschriftung",
        basicText: "Basis",
        advancedText: "Erweitert",
        limitByScaleText: "Einschränkung durch Ma&#223;stab",
        limitByConditionText: "Einschränkung durch Filter",
        symbolText: "Symbol",
        nameText: "Name"
    },
    
    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Ma&#223;stab 1:{scale}",
        minScaleLimitText: "Min. Ma&#223;stab",
        maxScaleLimitText: "Max. Ma&#223;stab"
    },
    
    "gxp.StrokeSymbolizer.prototype": {
        solidStrokeName: "ausgezogen",
        dashStrokeName: "gestrichelt",
        dotStrokeName: "gepunktet",
        titleText: "Linie",
        styleText: "Stil",
        colorText: "Farbe",
        widthText: "Breite",
        opacityText: "Transparenz"
    },
    
    "gxp.StylePropertiesDialog.prototype": {   
        titleText: "Allgemein",
        nameFieldText: "Name",
        titleFieldText: "Titel",
        abstractFieldText: "Kurzbeschreibung"
    },
    
    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Feld",
        haloText: "Umrahmung",
        sizeText: "&nbsp;Grö&#223;e",
        priorityText: "Priorität",
        labelOptionsText: "Textoptionen",
        autoWrapText: "Zeilenumbruch",
        followLineText: "Linie folgend",
        maxDisplacementText: "Max. Verschiebung",
        repeatText: "Wiederholen",
        forceLeftToRightText: "Links nach Rechts",
        groupText: "Gruppieren",
        spaceAroundText: "Puffer",
        labelAllGroupText: "Alle Segmente in der Gruppe beschriften",
        maxAngleDeltaText: "Max. delta Winkel",
        conflictResolutionText: "Konfliktlösung",
        goodnessOfFitText: "Goodness of fit",
        polygonAlignText: "Polygonausrichtung",
        graphicResizeText: "Grafikgrö&#223;e",
        graphicMarginText: "Grafikrand",
        graphicTitle: "Grafik",
        fontColorTitle: "Textfarbe und Transparenz",
        positioningText: "Textplatzierung",
        anchorPointText: "Ankerpunkt",
        displacementXText: "Verschiebung (X-Richtung)",
        displacementYText: "Verschiebung (Y-Richtung)",
        perpendicularOffsetText: "Senkrechter Offset",
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
        attributionText: "Zuordnung",
        aboutText: "Über",
        titleText: "Titel",
        nameText: "Name",
        descriptionText: "Beschreibung",
        displayText: "Anzeige",
        opacityText: "Transparenz",
        formatText: "Bild-Format",
        transparentText: "transparent",
        cacheText: "Cache",
        cacheFieldText: "Version aus dem Cache benützen",
        stylesText: "Verfügbare Stile",
        infoFormatText: "Info-Format",
        infoFormatEmptyText: "Format auswählen",
        displayOptionsText: "Anzeigeoptionen",
        queryText: "Einschränkung durch Filter",
        scaleText: "Einschränkung durch Ma&#223;stab",
        minScaleText: "Minimal",
        maxScaleText: "Maximal",
        switchToFilterBuilderText: "Zurück zur Filter-Auswahl",
        cqlPrefixText: "&nbsp;&nbsp;ODER&nbsp;&nbsp;",
        cqlText: "CQL Filter eingeben",
        singleTileText: "Kachel",
        singleTileFieldText: "einzelne Kachel nutzen"
    },

    "gxp.WMSStylesDialog.prototype": {
         chooseStyleText: "Stil wählen",
         stylesFieldsetTitle: "Stile",
         rulesFieldsetTitle: "Regeln"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Ihre Karte ist für die Publikation im Web bereit. Kopieren Sie einfach den folgenden HTML-Code, um die Karte in Ihre Webseite einzubinden:",
        heightLabel: 'Höhe',
        widthLabel: 'Breite',
        mapSizeLabel: 'Kartengrösse',
        miniSizeLabel: 'Mini',
        smallSizeLabel: 'Klein',
        premiumSizeLabel: 'Premium',
        largeSizeLabel: 'Gross'
    },
    
    "gxp.StylesDialog.prototype": {
         addStyleText: "Hinzufügen",
         addStyleTip: "Neuen Stil hinzufügen",
         chooseStyleText: "Stil wählen",
         deleteStyleText: "Löschen",
         deleteStyleTip: "Selektierten Stil löschen",
         editStyleText: "Bearbeiten",
         editStyleTip: "Selektierten Stil bearbeiten",
         duplicateStyleText: "Duplizieren",
         duplicateStyleTip: "Selektierten Stil duplizieren",
         addRuleText: "Hinzufügen",
         addRuleTip: "Neue Regel hinzufügen",
         newRuleText: "Neue Regel",
         deleteRuleText: "Entfernen",
         deleteRuleTip: "Selektierte Regel löschen",
         editRuleText: "Bearbeiten",
         editRuleTip: "Selektierte Regel bearbeiten",
         duplicateRuleText: "Duplizieren",
         duplicateRuleTip: "Selektierte Regel duplizieren",
         cancelText: "Abbrechen",
         saveText: "Speichern",
         styleWindowTitle: "User Stil: {0}",
         ruleWindowTitle: "Stil Regel: {0}",
         stylesFieldsetTitle: "Stile",
         rulesFieldsetTitle: "Regeln"
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Titel",
        titleEmptyText: "Layertitel",
        abstractLabel: "Beschreibung",
        abstractEmptyText: "Layerbeschreibung",
        fileLabel: "Daten",
        fieldEmptyText: "Datenarchiv durchsuchen...",
        uploadText: "Hochladen",
        uploadFailedText: "Hochladen fehlgeschlagen",
        processingUploadText: "Upload wird bearbeitet",
        waitMsgText: "Ihre Daten werden hochgeladen...",
        invalidFileExtensionText: "Dateierweiterung muss eine sein von: ",
        optionsText: "Optionen",
        workspaceLabel: "Workspace",
        workspaceEmptyText: "Standard Workspace",
        dataStoreLabel: "Store",
        dataStoreEmptyText: "Neuen Store erzeugen",
        dataStoreNewText: "Neuen Store erzeugen",
        crsLabel: "CRS",
        crsEmptyText: "Koordinaten Referenz System Kennung",
        invalidCrsText: "CRS Kennung sollte ein EPSG-Code sein (z.B. EPSG:4326)"
    },
    
    "gxp.NewSourceDialog.prototype": {
        title: "Neuen Server hinzufügen...",
        cancelText: "Abbrechen",
        addServerText: "Server hinzufügen",
        invalidURLText: "Fügen Sie eine gültige URL zu einem WMS Service ein (z.B. http://example.com/geoserver/wms)",
        contactingServerText: "Server wird kontaktiert..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Zoomstufe"
    },

    "gxp.Viewer.prototype": {
        saveErrorText: "Beim Speichern ist ein Problem aufgetreten: "
    },

    "gxp.FeedSourceDialog.prototype": {
        feedTypeText: "Quelle",
        addPicasaText: "Picasa Fotos",
        addYouTubeText: "YouTube Videos",
        addRSSText: "Anderer GeoRSS Feed",
        addFeedText: "Zur Karte hinzufügen",
        addTitleText: "Titel",
        keywordText: "Schlüsselwort",
        doneText: "Fertig",
        titleText: "Feeds hinzufügen",
        maxResultsText: "Max. Anzahl"
    },

    "gxp.CatalogueSearchPanel.prototype": {
        searchFieldEmptyText: "Suchen nach...",
        searchButtonText: "Suchen",
        addTooltip: "Filter anlegen",
        addMapTooltip: "Zur Karte hinzufügen",
        advancedTitle: "Erweitert",
        datatypeLabel: "Datentyp",
        extentLabel: "Räumliche Ausdehnung",
        categoryLabel: "Kategorie",
        datasourceLabel: "Datenquelle",
        filterLabel: "Filtersuche mit",
        removeSourceTooltip: "Zurück zur Originalquelle",
        showMetaDataTooltip: "Alle Metadaten zeigen"
    }

});
