/**
 * @requires GeoExt/Lang.js
 */

GeoExt.Lang.add("it", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Layer"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Aggiungi dei layer",
        addActionTip: "Aggiungi dei layer",
        addServerText: "Aggiungi Nuovo Server",
        addButtonText: "Aggiungi layer",
        untitledText: "Senza titolo",
        addLayerSourceErrorText: "Errore nel recupero delle WMS capabilities ({msg}).\nPer favore verificate la url e riprovare.",
        availableLayersText: "Layer disponibili",
        expanderTemplateText: "<p><b>In sintesi:</b> {abstract}</p>",
        panelTitleText: "Titolo",
        layerSelectionText: "Visualizza i dati disponibili da:",
        doneText: "Fatto",
        uploadText: "Upload dei layer",
        addFeedActionMenuText: "Aggiungi feed",
        searchText: "Ricerca dei layer"
    },

    "gxp.plugins.BingSource.prototype": {
        title: "Layer di Bing",
        roadTitle: "Bing Stradale",
        aerialTitle: "Bing Aereo",
        labeledAerialTitle: "Bing Aereo con Etichette"
    },

    "gxp.plugins.FeatureEditor.prototype": {
        splitButtonText: "Modifica",
        createFeatureActionText: "Crea",
        editFeatureActionText: "Modifica",
        createFeatureActionTip: "Crea una nuova feature",
        editFeatureActionTip: "Modifica una feature esistente",
        commitTitle: "Messaggio di completamento",
        commitText: "Per favore inserire un messaggio di completamento per questa modifica:"
    },

    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Visualizza sulla mappa",
        firstPageTip: "Prima pagina",
        previousPageTip: "Pagina precedente",
        zoomPageExtentTip: "Zoom all'estensione della pagina",
        nextPageTip: "Prossima pagina",
        lastPageTip: "Ultima pagina",
        totalMsg: "Le Feature da {1} a {2} di {0}"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        menuText: "Visualizzatore 3D",
        tooltip: "Passa al Visualizzatore 3D"
    },

    "gxp.plugins.GoogleSource.prototype": {
        title: "Layer di Google",
        roadmapAbstract: "Mostra mappa stradale",
        satelliteAbstract: "Mostra immagine satellitare",
        hybridAbstract: "Mostra immagine con nomi stradali",
        terrainAbstract: "Mostra mappa stradale con vista terreno"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Proprietà Layer",
        toolTip: "Proprietà Layer"
    },

    "gxp.plugins.LayerTree.prototype": {
        shortTitle: "Layer",
        rootNodeText: "Layer",
        overlayNodeText: "Sovrapposizioni",
        baseNodeText: "Layer di base"
    },

    "gxp.plugins.LayerManager.prototype": {
        baseNodeText: "Mappe di base"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Mostra legenda",
        tooltip: "Mostra legenda"
    },

    "gxp.plugins.LoadingIndicator.prototype": {
        loadingMapMessage: "Mappa in caricamento..."
    },

    "gxp.plugins.MapBoxSource.prototype": {
        title: "Layer di MapBox",
        blueMarbleTopoBathyJanTitle: "Topografia & Batimetria (Gennaio) di Blue Marble",
        blueMarbleTopoBathyJulTitle: "Topografia & Batimetria (Luglio) di Blue Marble",
        blueMarbleTopoJanTitle: "Topografia (Gennaio) di Blue Marble",
        blueMarbleTopoJulTitle: "Topografia (Luglio) di Blue Marble",
        controlRoomTitle: "Punto di Controllo",
        geographyClassTitle: "Classe geografica",
        naturalEarthHypsoTitle: "Ipsometria Natural Earth",
        naturalEarthHypsoBathyTitle: "Ipsometria e Batimetria Natural Earth",
        naturalEarth1Title: "Natural Earth I",
        naturalEarth2Title: "Natural Earth II",
        worldDarkTitle: "World Dark",
        worldLightTitle: "World Light",
        worldPrintTitle: "World Print"
    },

    "gxp.plugins.Measure.prototype": {
        buttonText: "Misura",
        lengthMenuText: "Lunghezza",
        areaMenuText: "Area",
        lengthTooltip: "Misura lunghezza",
        areaTooltip: "Misura area",
        measureTooltip: "Misura"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Sposta mappa",
        tooltip: "Sposta mappa"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom alla precedente estensione",
        nextMenuText: "Zoom alla successiva estensione",
        previousTooltip: "Zoom alla precedente estensione",
        nextTooltip: "Zoom alla successiva estensione"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "Layer di OpenStreetMap",
        mapnikAttribution: "&Copyright; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> di attribuzione",
        osmarenderAttribution: "Dati rilasciati con licenza CC-By-SA da <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        buttonText: "Stampa",
        menuText: "Stampa mappa",
        tooltip: "Stampa mappa",
        previewText: "Stampa Anteprima",
        notAllNotPrintableText: "Non tutti i layer possono essere stampati",
        nonePrintableText: "Nessuno dei tuoi attuali layer può essere stampato"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "Layer di MapQuest",
        osmAttribution: "Tile a cura di <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "OpenStreetMap di MapQuest",
        naipAttribution: "Tile a cura di <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "Immagini MapQuest"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Ricerca",
        queryMenuText: "Interroga layer",
        queryActionTip: "Interroga il layer selezionato",
        queryByLocationText: "Interroga in base all'estensione corrente",
        queryByAttributesText: "Interroga in base agli attributi",
        queryMsg: "Ricerca in corso...",
        cancelButtonText: "Cancella",
        noFeaturesTitle: "Nessun risultato",
        noFeaturesMessage: "Non è stato trovato alcun risultato."
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Rimuovi layer",
        removeActionTip: "Rimuovi layer"
    },

    "gxp.plugins.Styler.prototype": {
        menuText: "Stili dei layer",
        tooltip: "Stili dei layer"

    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        buttonText: "Identifica",
        infoActionTip: "Ottieni Informazioni sulla feature",
        popupTitle: "Informazioni feature"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomMenuText: "Zoom rettangolare",
        zoomInMenuText: "Zoom avanti",
        zoomOutMenuText: "Zoom indietro",
        zoomTooltip: "Zoom da estensione rettangolare",
        zoomInTooltip: "Zoom avanti",
        zoomOutTooltip: "Zoom indietro"
    },

    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom alla massima estensione",
        tooltip: "Zoom alla massima estensione"
    },

    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom all'estensione del layer",
        tooltip: "Zoom all'estensione del layer"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom all'estensione del layer",
        tooltip: "Zoom all'estensione del layer"
    },

    "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Zoom alle feature selezionate",
        tooltip: "Zoom alle feature selezionate"
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Vuoi salvare le modifiche alla feature?",
        closeMsg: "Questa feature ha modifiche non salvate. Vorresti salvarle?",
        deleteMsgTitle: "Vuoi cancellare la feature?",
        deleteMsg: "Sei sicuro di voler cancellare questa feature?",
        editButtonText: "Modifica",
        editButtonTooltip: "Rendi questa feature modificabile",
        deleteButtonText: "Elimina",
        deleteButtonTooltip: "Elimina questa feature",
        cancelButtonText: "Annulla",
        cancelButtonTooltip: "Blocca e annulla le modifiche",
        saveButtonText: "Salva",
        saveButtonTooltip: "Salva le modifiche"
    },

    "gxp.FillSymbolizer.prototype": {
        fillText: "Riempimento",
        colorText: "Colore",
        opacityText: "Opacità"
    },

    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["qualsiasi", "tutte", "nessuna", "non tutte"],
        preComboText: "Corrispondenza",
        postComboText: "del seguente:",
        addConditionText: "aggiungi condizione",
        addGroupText: "aggiungi gruppo",
        removeConditionText: "elimina condizione"
    },

    "gxp.grid.CapabilitiesGrid.prototype": {
        nameHeaderText: "Nome",
        titleHeaderText: "Titolo",
        queryableHeaderText: "Interrogabile",
        layerSelectionLabel: "Visualizza i dati disponibili da:",
        layerAdditionLabel: "o aggiungi nuovo server.",
        expanderTemplateText: "<p><b>In sintesi:</b> {abstract}</p>"
    },

    "gxp.PointSymbolizer.prototype": {
        graphicCircleText: "cerchio",
        graphicSquareText: "quadrato",
        graphicTriangleText: "triangolo",
        graphicStarText: "stella",
        graphicCrossText: "attraversamento",
        graphicXText: "x",
        graphicExternalText: "esterno",
        urlText: "URL",
        opacityText: "opacità",
        symbolText: "Simbolo",
        sizeText: "Grandezza",
        rotationText: "Rotazione"
    },

    "gxp.QueryPanel.prototype": {
        queryByLocationText: "Interroga in base alla posizione",
        currentTextText: "Estensione Currente",
        queryByAttributesText: "Interroga in base agli attributi",
        layerText: "Layer"
    },

    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scala 1:{scale}",
        labelFeaturesText: "Etichetta Feature",
        labelsText: "Etichette",
        basicText: "Base",
        advancedText: "Avanzate",
        limitByScaleText: "Limita in base alla scala",
        limitByConditionText: "Limita in base alla condizione",
        symbolText: "Simbolo",
        nameText: "Nome"
    },

    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Scala 1:{scale}",
        minScaleLimitText: "Limite scala Min",
        maxScaleLimitText: "Limite scala Max"
    },

    "gxp.StrokeSymbolizer.prototype": {
        solidStrokeName: "continua",
        dashStrokeName: "tratteggiata",
        dotStrokeName: "puntiforme",
        titleText: "Linea",
        styleText: "Stile",
        colorText: "Colore",
        widthText: "Larghezza",
        opacityText: "Opacità"
    },

    "gxp.StylePropertiesDialog.prototype": {
        titleText: "Generale",
        nameFieldText: "Nome",
        titleFieldText: "Titolo",
        abstractFieldText: "In sintesi"
    },

    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Valori etichetta",
        haloText: "Halo",
        sizeText: "Grandezza"
    },

    "gxp.WMSLayerPanel.prototype": {
        attributionText: "Attribuzione",
        aboutText: "Informazioni",
        titleText: "Titolo",
        nameText: "Nome",
        descriptionText: "Descrizione",
        displayText: "Visualizzazione",
        opacityText: "Opacità",
        formatText: "Formato",
        transparentText: "Transparente",
        cacheText: "Cache",
        cacheFieldText: "Usa versione in cache",
        stylesText: "Stili disponibili",
        infoFormatText: "Formato informazioni",
        infoFormatEmptyText: "Seleziona un formato",
        displayOptionsText: "Visualizza opzioni",
        queryText: "Limitazione con filtri",
        scaleText: "Limitazione in base alla scala",
        minScaleText: "Scala Min",
        maxScaleText: "Scala Max",
        switchToFilterBuilderText: "Ritorna al compositore di filtri",
        cqlPrefixText: "o ",
        cqlText: "usa piuttosto un filtro CQL",
        singleTileText: "Tile singolo",
        singleTileFieldText: "Usa un singolo tile"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "La vostra mappa è pronta ad essere pubblicata sul Web! Copia semplicemente il seguente HTML per inserire la mappa all'interno del tuo sito web:",
        heightLabel: 'Altezza',
        widthLabel: 'Larghezza',
        mapSizeLabel: 'Grandezza mappa',
        miniSizeLabel: 'Minima',
        smallSizeLabel: 'Piccola',
        premiumSizeLabel: 'Gigante',
        largeSizeLabel: 'Larga'
    },

    "gxp.WMSStylesDialog.prototype": {
        addStyleText: "Aggiungi",
        addStyleTip: "Aggiungi un nuovo stile",
        chooseStyleText: "Scegli stile",
        deleteStyleText: "Elimina",
        deleteStyleTip: "Elimina lo stile selezionato",
        editStyleText: "Modifica",
        editStyleTip: "Modifica lo stile selezionato",
        duplicateStyleText: "Duplica",
        duplicateStyleTip: "Duplica lo stile selezionato",
        addRuleText: "Aggiungi",
        addRuleTip: "Aggiungi una nuova regola",
        newRuleText: "Nuova Regola",
        deleteRuleText: "Elimina",
        deleteRuleTip: "Elimina la regola selezionata",
        editRuleText: "Modifica",
        editRuleTip: "Modifica la regola selezionata",
        duplicateRuleText: "Duplica",
        duplicateRuleTip: "Duplica la regola selezionata",
        cancelText: "Cancella",
        saveText: "Salva",
        styleWindowTitle: "Stile Utente: {0}",
        ruleWindowTitle: "Regola dello stile: {0}",
        stylesFieldsetTitle: "Stili",
        rulesFieldsetTitle: "Regole"
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Titolo",
        titleEmptyText: "Titolo Layer",
        abstractLabel: "Descrizione",
        abstractEmptyText: "descrizione Layer",
        fileLabel: "Dati",
        fieldEmptyText: "Consulta l'archivio dati...",
        uploadText: "Upload",
        uploadFailedText: "Upload fallito",
        processingUploadText: "Sto effettuando l'upload...",
        waitMsgText: "Sto effettuando l'upload dei tuoi dati...",
        invalidFileExtensionText: "L'estensione del file deve essere una tra: ",
        optionsText: "Opzioni",
        workspaceLabel: "Workspace",
        workspaceEmptyText: "Workspace di base",
        dataStoreLabel: "Store",
        dataStoreEmptyText: "Scegli uno store",
        dataStoreNewText: "Crea nuovo store",
        crsLabel: "CRS",
        crsEmptyText: "ID del Sistema di Riferimento delle Coordinate",
        invalidCrsText: "L'identificativo CRS dovrebbe essere un codice EPSG (Es.: EPSG:4326)"
    },

    "gxp.NewSourceDialog.prototype": {
        title: "Aggiungi nuovo server...",
        cancelText: "Cancella",
        addServerText: "Aggiungi Server",
        invalidURLText: "Inserisci una URL valida di un servizio WMS (Es.: http://example.com/geoserver/wms)",
        contactingServerText: "Collegamento al server..."
    },

    "gxp.ScaleOverlay.prototype": {
        zoomLevelText: "Livello di Zoom"
    },

    "gxp.Viewer.prototype": {
        saveErrorText: "Problemi nel salvataggio: "
    },

    "gxp.FeedSourceDialog.prototype": {
        feedTypeText: "Sorgente",
        addPicasaText: "Foto Picasa",
        addYouTubeText: "Video YouTube",
        addRSSText: "Altri Feed GeoRSS",
        addFeedText: "Aggiungi alla Mappa",
        addTitleText: "Titolo",
        keywordText: "Parole chiave",
        doneText: "Fatto",
        titleText: "Aggiungi Feed",
        maxResultsText: "Numero Max risultati"
    }

});