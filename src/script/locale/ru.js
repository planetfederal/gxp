/**
 * @requires GeoExt/Lang.js
 */

GeoExt.Lang.add("ru", {

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Слой"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Добавить слои",
        addActionTip: "Добавить слои",
        addServerText: "Добавить новый сервер",
        addButtonText: "Добавить слои",
        untitledText: "Без названия",
        addLayerSourceErrorText: "Не удалось подключиться к WMS ({msg}).\nПроверьте ссылку и попробуйте снова.",
        availableLayersText: "Доступные слои",
        expanderTemplateText: "<p><b>Аннотация:</b> {abstract}</p>",
        panelTitleText: "Заголовок",
        layerSelectionText: "Просмотр доступных данных из:",
        doneText: "Готово",
        uploadText: "Загрузить слои",
        addFeedActionMenuText: "Добавить каналы (feeds)",
        searchText: "Поиск слоёв"
    },

    "gxp.plugins.BingSource.prototype": {
        title: "Bing",
        roadTitle: "Bing схема",
        aerialTitle: "Bing спутник",
        labeledAerialTitle: "Bing спутник с метками"
    },

    "gxp.plugins.FeatureEditor.prototype": {
        splitButtonText: "Редактировать",
        createFeatureActionText: "Создать",
        editFeatureActionText: "Изменить",
        createFeatureActionTip: "Создать новую запись таблицы атрибутов",
        editFeatureActionTip: "Редактировать существующую запись таблицы атрибутов",
        commitTitle: "Описание для подтверждения изменений",
        commitText: "Введите описание этого изменения:"
    },

    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Показать на карте",
        firstPageTip: "Первая страница",
        previousPageTip: "Предыдущая страница",
        zoomPageExtentTip: "Увеличить до области страницы",
        nextPageTip: "Следующая страница",
        lastPageTip: "Последняя страница",
        totalMsg: "Записи с {1} по {2} из {0}"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        menuText: "3D-просмотр",
        tooltip: "Включить 3D-просмотр"
    },

    "gxp.plugins.GoogleSource.prototype": {
        title: "Google",
        roadmapAbstract: "Google схема",
        satelliteAbstract: "Google спутник",
        hybridAbstract: "Google спутник с метками",
        terrainAbstract: "Google ландшафт"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Свойства слоя",
        toolTip: "Свойства слоя"
    },

    "gxp.plugins.LayerTree.prototype": {
        shortTitle: "Слои",
        rootNodeText: "Слои",
        overlayNodeText: "Тематические слои",
        baseNodeText: "Базовая карта"
    },

    "gxp.plugins.LayerManager.prototype": {
        baseNodeText: "Базовая карта"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Легенда",
        tooltip: "Показать легенду"
    },

    "gxp.plugins.LoadingIndicator.prototype": {
        loadingMapMessage: "Загрузка карты..."
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
        buttonText: "Измерения",
        lengthMenuText: "Длина",
        areaMenuText: "Площадь",
        lengthTooltip: "Измерение длины",
        areaTooltip: "Измерение площади",
        measureTooltip: "Измерение"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Сдвиг",
        tooltip: "Сдвинуть карту"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Предыдущая область",
        nextMenuText: "Следующая область",
        previousTooltip: "Показать предыдущую область",
        nextTooltip: "Показать следующую область"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap",
        mapnikAttribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> авторы",
        osmarenderAttribution: "Данные CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        buttonText:"Печать",
        menuText: "Печать",
        tooltip: "Печать карты",
        previewText: "Предварительный просмотр",
        notAllNotPrintableText: "Не все слои могут быть напечатаны",
        nonePrintableText: "Ни один из текующих слоев карты не может быть напечатан"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest",
        osmAttribution: "Предоставлено <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Предоставлено <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest спутник"
    },

    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Запрос",
        queryMenuText: "Выполнить запрос в слое",
        queryActionTip: "Выполнить запрос в текущем слое",
        queryByLocationText: "Запрос по текущей области карты",
        queryByAttributesText: "Запрос по атрибутам",
        queryMsg: "Выполнение запроса...",
        cancelButtonText: "Отмена",
        noFeaturesTitle: "Не найдено",
        noFeaturesMessage: "Ваш запрос не дал результатов."
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Удалить слой",
        removeActionTip: "Удалить слой"
    },

    "gxp.plugins.Styler.prototype": {
        menuText: "Стили",
        tooltip: "Стили слоя"

    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        buttonText:"Информация",
        infoActionTip: "Получить атрибутивную информацию по объектам карты",
        popupTitle: "Атрибутивная информация объекта"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomMenuText: "Изменение масштаба путем выделения области",
        zoomInMenuText: "Увеличить масштаб",
        zoomOutMenuText: "Уменьшить масштаб",
        zoomTooltip: "Изменение масштаба путем выделения области",
        zoomInTooltip: "Увеличить масштаб",
        zoomOutTooltip: "Уменьшить масштаб"
    },

    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Показать всю карту",
        tooltip: "Увеличить до максимальной области карты"
    },

    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Показать весь слой",
        tooltip: "Увеличить до максимальной области слоя"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Показать весь слой",
        tooltip: "Увеличить до максимальной области слоя"
    },

    "gxp.plugins.ZoomToSelectedFeatures.prototype": {
        menuText: "Показать выбранные объекты",
        tooltip: "Увеличить до выбранных объектов"
    },

    "gxp.FeatureEditPopup.prototype": {
        closeMsgTitle: "Сохранить изменения?",
        closeMsg: "Этот объект имеет несохраненные изменения. Сохранить изменения?",
        deleteMsgTitle: "Удалить объект?",
        deleteMsg: "Вы действительно хотите удалить этот объект?",
        editButtonText: "Редактировать",
        editButtonTooltip: "Сделать этот объект редактируемым",
        deleteButtonText: "Удалить",
        deleteButtonTooltip: "Удалить этот объект",
        cancelButtonText: "Отмена",
        cancelButtonTooltip: "Завершить редактирование и отменить изменения",
        saveButtonText: "Сохранить",
        saveButtonTooltip: "Сохранить изменения"
    },

    "gxp.FillSymbolizer.prototype": {
        fillText: "Заливка",
        colorText: "Цвет",
        opacityText: "Прозрачн."
    },

    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["любой", "все", "ни один", "не все"],
        preComboText: "Совпадает",
        postComboText: "со следующим:",
        addConditionText: "добавить условие",
        addGroupText: "добавить группу",
        removeConditionText: "удалить условие"
    },

    "gxp.grid.CapabilitiesGrid.prototype": {
        nameHeaderText : "Наименование",
        titleHeaderText : "Заголовок",
        queryableHeaderText : "Доступный для выполнения запросов",
        layerSelectionLabel: "Посмотреть доступные данные из:",
        layerAdditionLabel: "или добавить новый сервер.",
        expanderTemplateText: "<p><b>Аннотация:</b> {abstract}</p>"
    },

    "gxp.PointSymbolizer.prototype": {
        graphicCircleText: "окружность",
        graphicSquareText: "квадрат",
        graphicTriangleText: "треугольник",
        graphicStarText: "звезда",
        graphicCrossText: "крест",
        graphicXText: "икс",
        graphicExternalText: "внешний",
        urlText: "Ссылка",
        opacityText: "прозрачн.",
        symbolText: "символ",
        sizeText: "Размер",
        rotationText: "Поворот"
    },

    "gxp.QueryPanel.prototype": {
        queryByLocationText: "Запрос по местонахождению",
        currentTextText: "Текущая область",
        queryByAttributesText: "Запрос по атрибутам",
        layerText: "Слой"
    },

    "gxp.RulePanel.prototype": {
        scaleSliderTemplate: "{scaleType} Масштаб 1:{scale}",
        labelFeaturesText: "Подписывать объекты",
        labelsText: "Подписи",
        basicText: "Базовый",
        advancedText: "Расширенный",
        limitByScaleText: "Ограничить по масштабу",
        limitByConditionText: "Ограничить по условию",
        symbolText: "Символ",
        nameText: "Наименование"
    },

    "gxp.ScaleLimitPanel.prototype": {
        scaleSliderTemplate: "{scaleType} Масштаб 1:{scale}",
        minScaleLimitText: "Масштаб от",
        maxScaleLimitText: "Масштаб до"
    },

    "gxp.StrokeSymbolizer.prototype": {
        solidStrokeName: "сплошная",
        dashStrokeName: "пунктирная",
        dotStrokeName: "точечная",
        titleText: "Контур",
        styleText: "Стиль",
        colorText: "Цвет",
        widthText: "Ширина",
        opacityText: "Прозрачн."
    },

    "gxp.StylePropertiesDialog.prototype": {
        titleText: "Основные",
        nameFieldText: "Название",
        titleFieldText: "Заголовок",
        abstractFieldText: "Абстракт"
    },

    "gxp.TextSymbolizer.prototype": {
        labelValuesText: "Поле для надписей",
        haloText: "Контур",
        sizeText: "Размер"
    },

    "gxp.WMSLayerPanel.prototype": {
        attributionText: "Опред-ие",
        aboutText: "О слое",
        titleText: "Заголовок",
        nameText: "Название",
        descriptionText: "Описание",
        displayText: "Отображание",
        opacityText: "Непрозрачн.",
        formatText: "Формат",
        transparentText: "Прозрачность",
        cacheText: "Кэш",
        cacheFieldText: "Использовать кэшированную версию",
        stylesText: "Доступные стили",
        infoFormatText: "Формат",
        infoFormatEmptyText: "Выбрать формат",
        displayOptionsText: "Параметры отображения",
        queryText: "Ограничение по запросу",
        scaleText: "Ограничение по масштабу",
        minScaleText: "Мин. масштаб",
        maxScaleText: "Макс. масштаб",
        switchToFilterBuilderText: "Переключиться к построителю фильтров",
        cqlPrefixText: "или ",
        cqlText: "использовать CQL-фильтр",
        singleTileText: "Одиночный тайл",
        singleTileFieldText: "Использовать одиночный тайл"
    },

    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Ваша карта готова к публикации в веб! Скопируйте следующий HTML-код, чтобы встроить карту в ваш сайт:",
        heightLabel: 'Высота',
        widthLabel: 'Ширина',
        mapSizeLabel: 'Размер карты',
        miniSizeLabel: 'Минимальный',
        smallSizeLabel: 'Маленький',
        premiumSizeLabel: 'Премиум',
        largeSizeLabel: 'Большой'
    },

    "gxp.WMSStylesDialog.prototype": {
         addStyleText: "Добавить",
         addStyleTip: "Добавить новый стиль",
         chooseStyleText: "Выбрать стиль",
         deleteStyleText: "Удалить",
         deleteStyleTip: "Удалить выбранный стиль",
         editStyleText: "Редакт.",
         editStyleTip: "Редактировать выбранный стиль",
         duplicateStyleText: "Дубл.",
         duplicateStyleTip: "Дублировать выбранный стиль",
         addRuleText: "Добавить",
         addRuleTip: "Добавить новое правило",
         newRuleText: "Новое правило",
         deleteRuleText: "Удалить",
         deleteRuleTip: "Удалить выбранное правило",
         editRuleText: "Редакт.",
         editRuleTip: "Редактировать выбранное правило",
         duplicateRuleText: "Дубл.",
         duplicateRuleTip: "Дублировать выбранное правило",
         cancelText: "Отмена",
         saveText: "Сохранить",
         styleWindowTitle: "Пользовательский стиль: {0}",
         ruleWindowTitle: "Правило стиля: {0}",
         stylesFieldsetTitle: "Стили",
         rulesFieldsetTitle: "Правила",
         classifyStyleText: "Classify",
         classifyStyleTip: "Classify the layer based on attributes"
    },

    "gxp.LayerUploadPanel.prototype": {
        titleLabel: "Заголовок",
        titleEmptyText: "Заголовок слоя",
        abstractLabel: "Описание",
        abstractEmptyText: "Описание слоя",
        fileLabel: "Данные",
        fieldEmptyText: "Выбрать архив с данными...",
        uploadText: "Загрузить",
        uploadFailedText: "Не удалось загрузить",
        processingUploadText: "Загрузка...",
        waitMsgText: "Загрузка ваших данных...",
        invalidFileExtensionText: "Расширение файла должно быть одним из: ",
        optionsText: "Параметры",
        workspaceLabel: "Рабочая область",
        workspaceEmptyText: "Рабочая область по умолчанию",
        dataStoreLabel: "Хранилище",
        dataStoreEmptyText: "Выбрать хранилище",
        dataStoreNewText: "Создать новое хранилище",
        crsLabel: "Система координат",
        crsEmptyText: "ID системы координат",
        invalidCrsText: "Идентификатор должен быть кодом EPSG (например EPSG:4326)"
    },

    "gxp.NewSourceDialog.prototype": {
        title: "Добавить новый сервер...",
        cancelText: "Отмена",
        addServerText: "Добавить сервер",
        invalidURLText: "Введите правильный адрес сервера WMS (например http://example.com/geoserver/wms)",
        contactingServerText: "Подключение к серверу..."
    },

    "gxp.ScaleOverlay.prototype": {
        zoomLevelText: "Масштабный уровень"
    },

    "gxp.Viewer.prototype": {
        saveErrorText: "Сбой сохранения: "
    },

    "gxp.FeedSourceDialog.prototype": {
        feedTypeText: "Источник потоковых данных",
        addPicasaText: "Фото Picasa",
        addYouTubeText: "Видео YouTube",
        addRSSText: "GeoRSS канал",
        addFeedText: "Добавить на карту",
        addTitleText: "Заголовок",
        keywordText: "Ключевое слово",
        doneText: "Готово",
        titleText: "Добавить каналы",
        maxResultsText: "Максимальное количество элементов"
    },

    "gxp.ClassificationPanel.prototype": {
        classNumberText: 'Classes',
        classifyText: "Classify",
        rampBlueText: "Blue",
        rampRedText: "Red",
        rampOrangeText: "Orange",
        rampJetText: "Blue-Red",
        rampGrayText: "Gray",
        rampRandomText: "Random",
        rampCustomText: "Custom",
        selectColorText: "Select colors",
        colorStartText: "Start Color",
        colorEndText: "End Color",
        colorRampText: 'Color Ramp',
        methodText: "Method",
        methodUniqueText: "Unique Values",
        methodQuantileText: "Quantile",
        methodEqualText: "Equal Intervals",
        methodJenksText: "Jenks Natural Breaks",
        selectMethodText: "Select method",
        standardDeviationText: "Standard Deviations",
        attributeText: "Attribute",
        selectAttributeText: "Select attribute",
        startColor: "#FEE5D9",
        endColor: "#A50F15",
        generateRulesText: "Apply",
        reverseColorsText: "Reverse colors"
    }

});
