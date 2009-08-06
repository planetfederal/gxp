/**
 * Copyright (c) 2008 The Open Planning Project
 *
 */

/** api: (define)
 *  module = gxp.grid
 *  class = CapabilitiesGrid
 *  extends = Ext.grid.GridPanel
 */

/** api: constructor
 *  .. class:: CapabilitiesGrid(config)
 *  
 *      Create a new grid displaying the WMS cabilities of a URL, or the
 *      contents of a ``GeoExt.data.WMSCapabilitiesStore``\ .  The user can
 *      add layers to a passed-in ``GeoExt.MapPanel`` from the grid.
 */
Ext.namespace("gxp.grid");
gxp.grid.CapabilitiesGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: config[store]
     *  ``GeoExt.data.LayerStore``
     */
    store: null,

    cm: null,

    /** config: config[mapPanel]
     *  ``GeoExt.MapPanel``
     *  Map panel to which layers can be added via this grid.
     */
    mapPanel : null,

    /** api: config[url]
     *  ``String``
     *  The  OWS URL to which the GetCapabilities request is sent.  Necessary if
     *  a store is not passed in as a configuration option.
     */
    url: null,

    autoExpandColumn: "title",

    /** private: method[initComponent]
     *  Initializes the CapabilitiesGrid. Creates and loads a WMS Capabilities 
     *  store from the url property if one is not passed as a configuration 
     *  option. 
     */
    initComponent: function(){

        if(!this.store){
            this.store = new GeoExt.data.WMSCapabilitiesStore({
                url: this.url + "?service=wms&request=GetCapabilities"
            });

            this.store.load();
        }

        var expander = new Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<p><b>Abstract:</b> {abstract}</p>')});

        this.plugins = expander;

        this.cm = new Ext.grid.ColumnModel([
            expander,
            {header: "Name", dataIndex: "name", width: 180, sortable: true},
            {id: "title", header: "Title", dataIndex: "title", sortable: true},
            {header: "Queryable", dataIndex: "queryable"}
        ]);

        gxp.grid.CapabilitiesGrid.superclass.initComponent.call(this);       
    },

    /** api: method[addLayers]
     *  :param: base: a boolean indicating whether or not to make the new layer 
     *      a base layer.
     * 
     *  Adds a layer to the :class:`GeoExt.MapPanel` of this instance.
     */    
    addLayers : function(base){

        var sm = this.getSelectionModel();

        //for now just use the first selected record
        //TODO: force single selection (until we allow
        //adding group layers)
        var records = sm.getSelections();
        
        var record, layer, newRecords = [];
        for(var i = 0; i < records.length; i++){
            Ext.data.Record.AUTO_ID++;
            record = records[i].copy(Ext.data.Record.AUTO_ID);

            /*
             * TODO: deal with srs and maxExtent
             * At this point, we need to think about SRS if we want the layer to
             * have a maxExtent.  For our app, we are dealing with EPSG:4326
             * only.  This will have to be made more generic for apps that use
             * other srs.
             */
            if (this.alignToGrid) {
                layer = record.get("layer").clone();
                layer.maxExtent = new OpenLayers.Bounds(-180, -90, 180, 90);
            } else {
                layer = record.get("layer");
                /**
                 * TODO: The WMSCapabilitiesReader should allow for creation
                 * of layers in different SRS.
                 */
                layer = new OpenLayers.Layer.WMS(
                    layer.name, layer.url,
                    {layers: layer.params["LAYERS"]},
                    {
                        attribution: layer.attribution,
                        maxExtent: OpenLayers.Bounds.fromArray(
                            record.get("llbbox")
                        ).transform(
                            new OpenLayers.Projection("EPSG:4326"),
                            this.mapPanel.map.getProjectionObject()
                        )
                    }
                );
            }

            record.data["layer"] = layer;
            record.commit(true);
            
            newRecords.push(record);
        }

        /**
         * The new layer records are ready to be added to the store.  The
         * store may contain temporary layers used for drawing at this
         * point (MeasureControl or other).  There are a number of ways
         * to decide where the new records should be inserted.  For the
         * sake of simplicity, lets assume they goes under the first vector
         * layer found.
         */
        if(newRecords.length) {
            var index = this.mapPanel.layers.findBy(function(r) {
                return r.get("layer") instanceof OpenLayers.Layer.Vector;
            });
            if(index !== -1) {
                this.mapPanel.layers.insert(index, newRecords);
            } else {
                this.mapPanel.layers.add(newRecords);
            }
        }

    }
});


/** api: xtype = gx_capabilitiesgrid */
Ext.reg('gx_capabilitiesgrid', gxp.grid.CapabilitiesGrid); 