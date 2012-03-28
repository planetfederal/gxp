/**
 * @requires GeoExt/Lang.js
 */

GeoExt.Lang.add("pl", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Warstwa"
    },

    "gxp.plugins.AddLayers.prototype": {
        addMenuText: "Dodaj warstwy",
        addActionTip: "Dodaj warstwy",
        addServerText: "Dodaj serwer",
        addButtonText: "Dodaj warstwy",
        untitledText: "Bez tytułu",
        addLayerSourceErrorText: "Błąd w czasie pobierania parametrów serwera WMS ({msg}).\nProszę sprawdzić adres.",
        availableLayersText: "Dostępne warstwy",
        expanderTemplateText: "<p><b>Opis:</b> {abstract}</p>",
        panelTitleText: "Tytuł",
        layerSelectionText: "Pokaż dostępne warstwy z:",
        doneText: "Gotowe",
        uploadText: "Wyślij dane"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Bing Maps",
        roadTitle: "Bing - drogi",
        aerialTitle: "Bing - ortofoto",
        labeledAerialTitle: "Bing - ortofoto z etykietami"
    },    

    "gxp.plugins.FeatureEditor.prototype": {
        createFeatureActionTip: "Utwórz nowy obiekt",
        editFeatureActionTip: "Edytuj istniejący obiekt"
    },
    
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Pokaż na mapie",
        firstPageTip: "Pierwsza strona",
        previousPageTip: "Poprzednia strona",
        zoomPageExtentTip: "Powiększ do zasięgu strony",
        nextPageTip: "Następna strona",
        lastPageTip: "Ostatnia strona",
        totalMsg: "Razem: {0} wierszy"

    },
    
    "gxp.plugins.GoogleEarth.prototype": {
        menuText: "Przeglądarka 3D",
        tooltip: "Przełącz do widoku 3D"
    },
        
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google Maps",
        roadmapAbstract: "Mapa drogowa",
        satelliteAbstract: "Zdjęcia satelitarne",
        hybridAbstract: "Zdjęcia satelitarne z etykietami",
        terrainAbstract: "Mapa terenowa z etykietami"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Właściwości",
        toolTip: "Właściwości"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        shortTitle: "Mapa",
        rootNodeText: "Mapa",
        overlayNodeText: "Warstwy",
        baseNodeText: "Mapa referencyjna"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Legenda mapy",
        tooltip: "Legenda mapy"
    },

    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Długość",
        areaMenuText: "Powierzchnia",
        lengthTooltip: "Pomiar odległości",
        areaTooltip: "Pomiar powierzchni",
        measureTooltip: "Pomiary"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Przesuń mapę",
        tooltip: "Przesuń mapę"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Poprzedni widok",
        nextMenuText: "Kolejny widok",
        previousTooltip: "Poprzedni widok",
        nextTooltip: "Kolejny widok"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Drukuj",
        tooltip: "Drukuj",
        previewText: "Podgląd wydruku",
        notAllNotPrintableText: "Nie wszystkie warstwy mogą być wydrukowane",
        nonePrintableText: "Żadna z warstw nie może byc wydrukowana"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest",
        osmAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest Imagery"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Wyszukaj",
        queryMenuText: "Przeszukaj warstwę",
        queryActionTip: "Przeszukaj zaznaczoną warstwę",
        queryByLocationText: "Przeszukaj po współrzędnych",
        currentTextText: "Aktualny obszar",
        queryByAttributesText: "Przeszukaj po atrybutach",
        queryMsg: "Przeszukiwanie...",
        cancelButtonText: "Anuluj",
        noFeaturesTitle: "Brak danych",
        noFeaturesMessage: "Przeszukanie nie zwróciło żadnych danych."
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Usuń warstwę",
        removeActionTip: "Usuń warstwę"
    },
    
    "gxp.plugins.Styler.prototype": {
        menuText: "Eycja styli",
        tooltip: "Zarządzanie stylami warstwy"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Info o obiekcie",
        popupTitle: "Info o obiekcie"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Powiększ",
        zoomOutMenuText: "Pomniejsz",
        zoomInTooltip: "Powiększ",
        zoomOutTooltip: "Pomniejsz"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Cała mapa",
        tooltip: "Cała mapa"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Powiększ do zasięgu całej warstwy",
        tooltip: "Powiększ do zasięgu całej warstwy"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Powiększ do zasięgu całej warstwy",
        tooltip: "Powiększ do zasięgu całej warstwy"
    },
    
    "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Powiększ do wybranych obiektów",
        tooltip: "Powiększ do wybranych obiektów"
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Zapisać zmiany?",
        closeMsg: "Istnieją nie zapisane zmiany. Chcesz je zapisać?",
        deleteMsgTitle: "Usunąć obiekt?",
        deleteMsg: "Jesteś pewien że chcesz usunąć ten obiekt?",
        editButtonText: "Edytuj",
        editButtonTooltip: "Edytuj ten obiekt",
        deleteButtonText: "Usuń",
        deleteButtonTooltip: "Usuń ten obiekt",
        cancelButtonText: "Anuluj",
        cancelButtonTooltip: "Anuluj edycję i nie zapisuj zmian",
        saveButtonText: "Zapisz",
        saveButtonTooltip: "Zapisz zmiany"
    },
    
    "gxp.FillSymbolizer.prototype": {
        fillText: "Wypełnienie",
        colorText: "Kolor",
        opacityText: "Prześwit"
    },
    
    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["dowolny", "wszystkie", "żaden", "odwrotność"],
        preComboText: "Dopasuj",
        postComboText: "sposród:",
        addConditionText: "dodaj warunek",
        addGroupText: "dodaj grupę",
        removeConditionText: "usuń warunek"
    },
    
    "gxp.grid.CapabilitiesGrid.prototype": {
        nameHeaderText : "Nazwa",
        titleHeaderText : "Tytuł",
        queryableHeaderText : "Przeszukiwalna",
        layerSelectionLabel: "Zobacz dostępne dane z:",
        layerAdditionLabel: "lub dodaj serwer.",
        expanderTemplateText: "<p><b>Opis:</b> {abstract}</p>"
    },
    
    "gxp.PointSymbolizer.prototype": {
        graphicCircleText: "koło",
        graphicSquareText: "kwadrat",
        graphicTriangleText: "trójkąt",
        graphicStarText: "gwiazda",
        graphicCrossText: "krzyż",
        graphicXText: "x",
        graphicExternalText: "inny",
        urlText: "URL",
        opacityText: "Prześwit",
        symbolText: "Symbol",
        sizeText: "Rozmiar",
        rotationText: "Obrót"
    },

    "gxp.QueryPanel.prototype": {
        queryByLocationText: "Zapytanie przestrzenne",
        currentTextText: "Aktualne powiększenie",
        queryByAttributesText: "Zapytanie atrybutowe",
        layerText: "Warstwa"
    },
    
    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} Skala 1:{scale}",
        labelFeaturesText: "Etykiety obiektów",
        labelsText: "Etykiety",
        basicText: "Podstawowa",
        advancedText: "Zaawansowana",
        limitByScaleText: "Ograniczenie skalowe",
        limitByConditionText: "Ograniczenie warunkowe",
        symbolText: "Symbol",
        nameText: "Nazwa"
    },
    
    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Skala 1:{scale}",
        minScaleLimitText: "Skala min.",
        maxScaleLimitText: "Skala max"
    },
    
    "gxp.StrokeSymbolizer.prototype": {
        solidStrokeName: "ciągły",
        dashStrokeName: "kreskowany",
        dotStrokeName: "kropkowany",
        titleText: "Obrys",
        styleText: "Styl",
        colorText: "Kolor",
        widthText: "Grubość",
        opacityText: "Prześwit"
    },
    
    "gxp.StylePropertiesDialog.prototype": {   
        titleText: "Ogólny",
        nameFieldText: "Nazwa",
        titleFieldText: "Tytuł",
        abstractFieldText: "Opis"
    },
    
    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Wartości etykiet",
        haloText: "Efekt Halo",
        sizeText: "Rozmiar"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "O",
        titleText: "Tytuł",
        nameText: "Nazwa",
        descriptionText: "Opis",
        displayText: "Wyświetlanie",
        opacityText: "Prześwit",
        formatText: "Format",
        transparentText: "Przeźr.",
        cacheText: "Cache",
        cacheFieldText: "Użyj wersji cache",
        stylesText: "Style",
        infoFormatText: "Info format",
        infoFormatEmptyText: "Select a format"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Twoja mapa jest gotowa do publikacji! Po prostu wklej poniższy kod na swojej witrynie:",
        heightLabel: 'Wysokość',
        widthLabel: 'Szerokość',
        mapSizeLabel: 'Rozmiar mapy',
        miniSizeLabel: 'Mini',
        smallSizeLabel: 'Mały',
        premiumSizeLabel: 'Średni',
        largeSizeLabel: 'Duży'
    },
    
    "gxp.WMSStylesDialog.prototype": {
         addStyleText: "Dodaj",
         addStyleTip: "Dodaj nowy styl",
         chooseStyleText: "Wybierz styl",
         deleteStyleText: "Usuń",
         deleteStyleTip: "Usuń styl",
         editStyleText: "Edytuj",
         editStyleTip: "Edytuj wybrany styl",
         duplicateStyleText: "Stwórz kopię",
         duplicateStyleTip: "Stwórz kopię wybranego stylu",
         addRuleText: "Dodaj",
         addRuleTip: "Dodaj nową regułę",
         newRuleText: "Nowa reguła",
         deleteRuleText: "Usuń",
         deleteRuleTip: "Usuń wybraną regułę",
         editRuleText: "Edytuj",
         editRuleTip: "Edytuj wybraną regułę",
         duplicateRuleText: "Stwórz kopię",
         duplicateRuleTip: "Skopiuj wybraną regułę",
         cancelText: "Anuluj",
         saveText: "Zapisz",
         styleWindowTitle: "Styl użytkownika: {0}",
         ruleWindowTitle: "Reguła stylu: {0}",
         stylesFieldsetTitle: "Style",
         rulesFieldsetTitle: "Reguły"
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Tytuł",
        titleEmptyText: "Tytuł warstwy",
        abstractLabel: "Opis",
        abstractEmptyText: "Opis warstwy",
        fileLabel: "Dane",
        fieldEmptyText: "Wskaż lokalizację danych...",
        uploadText: "Prześlij",
        waitMsgText: "Przesyłanie danych...",
        invalidFileExtensionText: "Typ pliku musi być jednym z poniższych: ",
        optionsText: "Opcje",
        workspaceLabel: "Obszar roboczy",
        workspaceEmptyText: "Domyślny obszar roboczy",
        dataStoreLabel: "Magazyn danych",
        dataStoreEmptyText: "Domyślny magazyn danych"
    },
    
    "gxp.NewSourceDialog.prototype": {
        title: "Dodaj serwer...",
        cancelText: "Anuluj",
        addServerText: "Dodaj serwer",
        invalidURLText: "Podaj prawidłowy adres URL usługi WMS (n.p. http://example.com/geoserver/wms)",
        contactingServerText: "Łączenie z serwerem..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Poziom powiększenia"
    }

});
