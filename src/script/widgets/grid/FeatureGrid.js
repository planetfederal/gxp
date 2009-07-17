/**
 * Copyright (c) 2009 The Open Planning Project
 *
 */

/**
 * api: (define)
 * module = gxp
 * class = FeatureGrid(config)
 * extends = Ext.grid.GridPanel
 */

/** api: constructor
 * ..class:: FeatureGrid(config)
 * :param: config: A configuration :class:`Object`
 *
 * Create a new grid displaying the contents of a 
 * :class:`GeoExt.data.FeatureStore` .
 */

Ext.namespace("gxp.grid");
gxp.grid.FeatureGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: config[map]
     *  ``OpenLayers.Map`` If provided, a layer with the features from this
     *  grid will be added to the map.
     */
    map: null,

    /** api: config[ignoreFields]
     *  ``Array`` of field names from the store's records that should not be
     *  displayed in the grid.
     */
    ignoreFields: null,

    /** private: property[layer]
     *  ``OpenLayers.Layer.Vector`` layer displaying features from this grid's
     *  store
     */
    layer: null,
    
    /** api: method[initComponent]
     * 
     * Initializes the FeatureGrid.
     */
    initComponent: function(){
        this.ignoreFields = ["feature", "state", "fid"].concat(this.ignoreFields);
        this.cm = this.createColumnModel(this.store);        
        if(this.map) {
            this.layer = new OpenLayers.Layer.Vector(this.id + "_layer");
            this.map.addLayer(this.layer);
            this.sm = new GeoExt.grid.FeatureSelectionModel({
                layerFromStore: false,
                layer: this.layer
            });
            this.store.bind(this.layer);
        }

        gxp.grid.FeatureGrid.superclass.initComponent.call(this);       
    },
    
    /** api: method[setStore]
     *  :param store: ``GeoExt.data.FeatureStore``
     *  
     *  Sets the store for this grid, reconfiguring the column model
     */
    setStore: function(store) {
        if(this.layer) {
            this.store.unbind();
            this.layer.destroyFeatures();
            store.bind(this.layer);
        }
        this.reconfigure(store, this.createColumnModel(store));
    },
    
    /** private: method[createColumnModel]
     *  :param store: ``GeoExt.data.LayerStore``
     *  :return: ``Ext.grid.ColumnModel``
     */
    createColumnModel: function(store) {
        var columns = [];
        store.fields.each(function(f) {
            var name = f.name;
            if(this.ignoreFields.indexOf(name) === -1) {
                columns.push({
                    dataIndex: f.name,
                    header: f.name,
                    sortable: true
                });
            }
        }, this);
        return new Ext.grid.ColumnModel(columns);
    }
});

/** api: xtype = gx_featuregrid */
Ext.reg('gx_featuregrid', gxp.grid.FeatureGrid); 