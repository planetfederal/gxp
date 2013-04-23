/**
 * @requires GeoExt/Lang.js
 */

GeoExt.Lang.add("pt-br", {

    "gxp.menu.LayerMenu.prototype":{
        layerText:"Camada"
    },

    "gxp.plugins.AddLayers.prototype":{
        addActionMenuText:"Adicionar camadas",
        addActionTip:"Adicionar camadas",
        addServerText:"Adicionar novo servidor",
        addButtonText:"Adicionar camadas",
        untitledText:"Sem título",
        addLayerSourceErrorText:"Erro ao pegar o WMS capabilities ({msg}).\nPor favor, verifique a URL e tente novamente.",
        availableLayersText:"Camadas Disponíveis",
        expanderTemplateText:"<p><b>Resumo:</b> {abstract}</p>",
        panelTitleText:"Título",
        layerSelectionText:"Ver dados disponíveis de:",
        doneText:"Concluído",
        uploadText:"Carregar camadas",
        addFeedActionMenuText:"Adicionar feeds",
        searchText:"Procurar camadas",
		zoomToLayerExtentQuestionText: "Deseja aplicar zoom para esta camada?"
    },

    "gxp.plugins.BingSource.prototype":{
        title:"Bing Layers",
        roadTitle:"Bing Roads",
        aerialTitle:"Bing Aerial",
        labeledAerialTitle:"Bing Aerial com Labels"
    },

    "gxp.plugins.FeatureEditor.prototype":{
        splitButtonText:"Editar",
        splitButtonTooltip: "Editar feições na camada WMS selecionada",
        createFeatureActionText:"Criar",
        editFeatureActionText:"Modificar",
        createFeatureActionTip:"Criar nova feição",
        editFeatureActionTip:"Editar feição existente",
        commitTitle:"Salvar mensagem",
        commitText:"Por favor entre com uma mensagem para o commit desta edição:"
    },

    "gxp.plugins.FeatureGrid.prototype":{
        displayFeatureText:"Mostrar no mapa",
        firstPageTip:"Primeira página",
        previousPageTip:"Página anterior",
        zoomPageExtentTip:"Zoom na extensão da tela",
        nextPageTip:"Próxima página",
        lastPageTip:"Página anterior",
        totalMsg:"Feições {1} para {2} de {0}"
    },

    "gxp.plugins.GoogleEarth.prototype":{
        menuText:"Visão 3D",
        tooltip:"Mudar para visão 3D"
    },

    "gxp.plugins.GoogleSource.prototype":{
        title:"Google Layers",
        roadmapAbstract:"Mostrar mapas de rua",
        satelliteAbstract:"Mostrar imagens de satélite",
        hybridAbstract:"Mostrar imagens de satélite com nomes de ruas",
        terrainAbstract:"Mostrar mapa de rua com terrenos"
    },

    "gxp.plugins.LayerProperties.prototype":{
        menuText:"Propriedades do Camada",
        toolTip:"Propriedades do Camada"
    },

    "gxp.plugins.LayerTree.prototype":{
        shortTitle:"Camadas",
        rootNodeText:"Camadas",
        overlayNodeText:"Sobreposições",
        baseNodeText:"Camadas de base"
    },

    "gxp.plugins.LayerManager.prototype":{
        baseNodeText:"Mapas de base"
    },

    "gxp.plugins.Legend.prototype":{
        menuText:"Mostrar Legenda",
        tooltip:"Mostrar Legenda"
    },

    "gxp.plugins.LoadingIndicator.prototype":{
        loadingMapMessage:"Carregando mapa..."
    },

    "gxp.plugins.MapBoxSource.prototype":{
        title:"Camadas do MapBox",
        blueMarbleTopoBathyJanTitle:"Blue Marble Topography & Bathymetry (January)",
        blueMarbleTopoBathyJulTitle:"Blue Marble Topography & Bathymetry (July)",
        blueMarbleTopoJanTitle:"Blue Marble Topography (January)",
        blueMarbleTopoJulTitle:"Blue Marble Topography (July)",
        controlRoomTitle:"Control Room",
        geographyClassTitle:"Geography Class",
        naturalEarthHypsoTitle:"Natural Earth Hypsometric",
        naturalEarthHypsoBathyTitle:"Natural Earth Hypsometric & Bathymetry",
        naturalEarth1Title:"Natural Earth I",
        naturalEarth2Title:"Natural Earth II",
        worldDarkTitle:"World Dark",
        worldLightTitle:"World Light",
        worldPrintTitle:"World Print"
    },

    "gxp.plugins.Measure.prototype":{
        buttonText:"Medir",
        lengthMenuText:"Tamanho",
        areaMenuText:"Área",
        lengthTooltip:"Tamanho da medida",
        areaTooltip:"Tamanho da Área",
        measureTooltip:"Medida"
    },

    "gxp.plugins.Navigation.prototype":{
        menuText:"Navegar no mapa",
        tooltip:"Navegar no mapa"
    },

    "gxp.plugins.NavigationHistory.prototype":{
        previousMenuText:"Voltar para o último zoom",
        nextMenuText:"Ir para o próximo zoom",
        previousTooltip:"Voltar para o último zoom",
        nextTooltip:"Ir para o próximo zoom"
    },

    "gxp.plugins.OSMSource.prototype":{
        title:"OpenStreetMap Layers",
        mapnikAttribution:"&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
        osmarenderAttribution:"Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype":{
        buttonText:"Imprimir",
        menuText:"Imprimir mapa",
        tooltip:"Imprimir mapa",
        previewText:"Visualizar Impressão",
        notAllNotPrintableText:"Nem todos as suas camadas poderão ser impressos...",
        nonePrintableText:"Nenhuma das suas Camadas selecionadas poderão ser impressas..."
    },

    "gxp.plugins.MapQuestSource.prototype":{
        title:"MapQuest Layers",
        osmAttribution:"Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle:"MapQuest OpenStreetMap",
        naipAttribution:"Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle:"MapQuest Imagery"
    },

    "gxp.plugins.QueryForm.prototype":{
        queryActionText:"Consulta",
        queryMenuText:"Consultar camada",
        queryActionTip:"Consultar a camada selecionada",
        queryByLocationText:"Consultar por visualização do mapa corrente",
        queryByAttributesText:"Consulta por atributos",
        queryMsg:"Consultando ...",
        CancelButtonText:"Cancelar",
        noFeaturesTitle:"Nenhum registro para a consulta",
        noFeaturesMessage:"Sua consulta não retornou nenhum resultado."
    },

    "gxp.plugins.RemoveLayer.prototype":{
        removeMenuText:"Remover camada",
        removeActionTip:"Remover camada"
    },

    "gxp.plugins.Styler.prototype":{
        menuText:"Estilos da Camada",
        tooltip:"Estilos da Camada"

    },

    "gxp.plugins.WMSGetFeatureInfo.prototype":{
        buttonText:"Identificar",
        infoActionTip:"Obter informações da feição",
        popupTitle:"Informações da feição"
    },

    "gxp.plugins.Zoom.prototype":{
        zoomMenuText:"Zoom de seleção",
        zoomInMenuText:"Zoom in",
        zoomOutMenuText:"Zoom out",
        zoomTooltip:"Zoom selecionando uma área",
        zoomInTooltip:"Zoom in",
        zoomOutTooltip:"Zoom out"
    },

    "gxp.plugins.ZoomToExtent.prototype":{
        menuText:"Zoom para ponto máximo",
        tooltip:"Zoom na medida max"
    },

    "gxp.plugins.ZoomToDataExtent.prototype":{
        menuText:"Extender zoom na camada",
        tooltip:"Extender zoom na camada"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype":{
        menuText:"Extender zoom na camada",
        tooltip:"Extender zoom na camada"
    },

    "gxp.plugins.ZoomToSelectedFeatures.prototype":{
        menuText:"Zoom nas feições selecionadas",
        tooltip:"Zoom nas feições selecionadas"
    },

    "gxp.FeatureEditPopup.prototype":{
        closeMsgTitle:"Salvar alterações?",
        closeMsg:". Esse recurso tem alterações não salvas, gostaria de salvar as alterações?",
        deleteMsgTitle:"Excluir Feição",
        deleteMsg:"Tem certeza de que deseja excluir este recurso",
        editButtonText:"Editar",
        editButtonTooltip:"Fazer este recurso editável",
        deleteButtonText:"Excluir",
        deleteButtonTooltip:"Excluir este recurso",
        CancelButtonText:"Cancelar",
        cancelButtonTooltip:"Parar edição e descartar as alterações",
        saveButtonText:"Salvar",
        saveButtonTooltip:"Salvar alterações"
    },

    "gxp.FillSymbolizer.prototype":{
        fillText:"Preencher",
        colorText:"Cor",
        opacityText:"Opacidade"
    },

    "gxp.FilterBuilder.prototype":{
        builderTypeNames:["qualquer", "todos", "nenhum", "nem todos"],
        preComboText:"Combinar",
        postComboText:"do seguinte:",
        addConditionText:"adicionar condição",
        addGroupText:"adicionar grupo",
        removeConditionText:"remover condição"
    },

    "gxp.grid.CapabilitiesGrid.prototype":{
        nameHeaderText:"Nome",
        titleHeaderText:"Título",
        queryableHeaderText:"Consultável",
        layerSelectionLabel:"Ver dados disponíveis de:",
        layerAdditionLabel:"ou adicione um novo servidor.",
        expanderTemplateText:"<p><b>Resumo:</b> {abstract}</p>"
    },

    "gxp.PointSymbolizer.prototype":{
        graphicCircleText:"círculo",
        graphicSquareText:"quadrado",
        graphicTriangleText:"triângulo",
        graphicStarText:"estrela",
        graphicCrossText:"através",
        graphicXText:"x",
        graphicExternalText:"externo",
        urlText:"URL",
        opacityText:"opacidade",
        symbolText:"Símbolo",
        sizeText:"Tamanho",
        rotationText:"Rotação"
    },

    "gxp.QueryPanel.prototype":{
        queryByLocationText:"Consulta por Localição",
        currentTextText:"Escala atual",
        queryByAttributesText:"Consulta por atributos",
        layerText:"Camada"
    },

    "gxp.RulePanel.prototype":{
        scaleSliderTemplate:"{scaleType} Escala 1:{scale}",
        labelFeaturesText:"Rótulos das feições",
        labelsText:"Rótulos",
        basicText:"Basico",
        advancedText:"Avançado",
        limitByScaleText:"Limit por escala",
        limitByConditionText:"Limite por condição",
        symbolText:"Símbolo",
        nameText:"Nome"
    },

    "gxp.ScaleLimitPanel.prototype":{
        scaleSliderTemplate:"{scaleType} Escala 1:{scale}",
        minScaleLimitText:"Limite minímo de escala",
        maxScaleLimitText:"Limite máximo de escala"
    },

    "gxp.StrokeSymbolizer.prototype":{
        solidStrokeName:"sólido",
        dashStrokeName:"traço",
        dotStrokeName:"ponto",
        titleText:"Traço",
        styleText:"Estilo",
        colorText:"Cor",
        widthText:"Largura",
        opacityText:"Opacidade"
    },

    "gxp.StylePropertiesDialog.prototype":{
        titleText:"Geral",
        nameFieldText:"Nome",
        titleFieldText:"Título",
        abstractFieldText:"Abstrato"
    },

    "gxp.TextSymbolizer.prototype":{
        labelValuesText:"Valores dos rótulos",
        haloText:"Círculo",
        sizeText:"Tamanho"
    },

    "gxp.WMSLayerPanel.prototype":{
        aboutText:"Sobre",
        titleText:"Título",
        nameText:"Nome",
        descriptionText:"Descrição",
        displayText:"Display",
        opacityText:"Opacidade",
        formatText:"Formatar",
        transparentText:"Transparente",
        cacheText:"Cache",
        cacheFieldText:"Use a versão em cache",
        stylesText:"Estilos disponíveis",
        infoFormatText:"Informações do formato",
        infoFormatEmptyText:"Selecione um formato",
        displayOptionsText:"Opções de visualização",
        querytext:"Limite com filtros",
        scaleText:"Limite de escala",
        minScaleText:"Escala Miníma",
        maxScaleText:"Escala Máxima",
        switchToFilterBuilderText:"Voltar para o construtor de filtro",
        cqlPrefixText:"ou",
        cqlText:"usar CQL ao invés de filtro",
        singleTileText:"Imagem(Tile) única",
        singleTileFieldText:"Usar uma imagem(Tile) única"
    },

    "gxp.EmbedMapDialog.prototype":{
        publishMessage:"O seu mapa está pronto para ser publicado na web, basta copiar o seguinte código HTML para incorporar o mapa em seu site:",
        heightLabel:'Altura',
        widthLabel:'Largura',
        mapSizeLabel:'Tamanho do Mapa',
        miniSizeLabel:'Mini',
        smallSizeLabel:'Pequeno',
        premiumSizeLabel:'Prêmio',
        largeSizeLabel:'Grandes'
    },

    "gxp.WMSStylesDialog.prototype":{
        addStyleText:"Adicionar",
        addStyleTip:"Adicionar um novo estilo",
        chooseStyleText:"Escolha o estilo",
        deleteStyleText:"Remover",
        deleteStyleTip:"Excluir o estilo selecionado",
        editStyleText:"Editar",
        editStyleTip:"Editar o estilo selecionado",
        duplicateStyleText:"Duplicar",
        duplicateStyleTip:"Duplicar o estilo selecionado",
        addRuleText:"Adicionar",
        addRuleTip:"Adicionar uma nova regra",
        newRuleText:"Nova regra",
        deleteRuleText:"Remover",
        deleteRuleTip:"Excluir a regra selecionada",
        editRuleText:"Editar",
        editRuleTip:"Editar a regra selecionada",
        duplicateRuleText:"Duplicar",
        duplicateRuleTip:"Duplicar a regra selecionada",
        cancelText:"Cancelar",
        saveText:"Salvar",
        styleWindowTitle:"Estilo de Usuário: {0}",
        ruleWindowTitle:"Regra Estilo: {0}",
        stylesFieldsetTitle:"Estilos",
        rulesFieldsetTitle:"Regras"
    },

    "gxp.LayerUploadPanel.prototype":{
        titleLabel:"Título",
        titleEmptyText:"Título da camada",
        abstractLabel:"Descrição",
        abstractEmptyText:"Descrição da camada",
        fileLabel:"Dado",
        fieldEmptyText:"Procurar por arquivo...",
        uploadText:"Carregar",
        uploadFailedText:"Carregamento falhou",
        processingUploadText:"Processando seu carregamento...",
        waitMsgText:"Carregando seus dados...",
        invalidFileExtensionText:"A extensão dos arquivo deve ser uma destas: ",
        optionsText:"Opções",
        workspaceLabel:"Área de trabalho",
        workspaceEmptyText:"Área de trabalho padrão",
        dataStoreLabel:"Fonte de dados",
        dataStoreEmptyText:"Criar nova fonte de dados",
        defaultDataStoreEmptyText:"Armazenamento de dados padrão"
    },

    "gxp.NewSourceDialog.prototype":{
        title:"Adicionar novo Servidor...",
        cancelText:"Cancelar",
        addServerText:"Adicionar Servidor",
        invalidURLText:"Entre com uma URL válida para um serviço WMS (e.g. http://example.com/geoserver/wms)",
        contactingServerText:"Conectando com o servidor..."
    },

    "gxp.ScaleOverlay.prototype":{
        zoomLevelText:"Nível de Zoom"
    }

});
