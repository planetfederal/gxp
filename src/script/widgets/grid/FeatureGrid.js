/**
 * Copyright (c) 2009 The Open Planning Project
 */

/** api: (define)
 *  module = gxp.grid
 *  class = FeatureGrid
 *  extends = Ext.grid.GridPanel
 */

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *      Create a new grid displaying the contents of a 
 *      ``GeoExt.data.FeatureStore`` .
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
    
    /** api: config[layer]
     *  ``OpenLayers.Layer.Vector``
     *  The vector layer that will be synchronized with the layer store.
     *  If the ``map`` config property is provided, this value will be ignored.
     */

    /** private: property[layer]
     *  ``OpenLayers.Layer.Vector`` layer displaying features from this grid's
     *  store
     */
    layer: null,
    
    /** api: method[initComponent]
     *  Initializes the FeatureGrid.
     */
    initComponent: function(){
        this.ignoreFields = ["feature", "state", "fid"].concat(this.ignoreFields);
        if(this.store) {
            this.cm = this.createColumnModel(this.store);
            // layer automatically added if map provided, otherwise check for
            // layer in config
            if(this.map) {
                this.layer = new OpenLayers.Layer.Vector(this.id + "_layer");
                this.map.addLayer(this.layer);
            }
        } else {
            this.store = new Ext.data.Store();
            this.cm = new Ext.grid.ColumnModel({
                columns: []
            });
        }
        if(this.layer) {
            this.sm = this.sm || new GeoExt.grid.FeatureSelectionModel({
                layerFromStore: false,
                layer: this.layer
            });
            if(this.store instanceof GeoExt.data.FeatureStore) {
                this.store.bind(this.layer);
            }
        }

        gxp.grid.FeatureGrid.superclass.initComponent.call(this);       
    },
    
    /** private: method[onDestroy]
     *  Clean up anything created here before calling super onDestroy.
     */
    onDestroy: function() {
        if(this.initialConfig && this.initialConfig.map
           && !this.initialConfig.layer) {
            // we created the layer, let's destroy it
            this.layer.destroy();
            delete this.layer;
        }
        gxp.grid.FeatureGrid.superclass.onDestroy.apply(this, arguments);
    },
    
    /** api: method[setStore]
     *  :param store: ``GeoExt.data.FeatureStore``
     *  
     *  Sets the store for this grid, reconfiguring the column model
     */
    setStore: function(store) {
        if(this.store instanceof GeoExt.data.FeatureStore) {
            this.store.unbind();
        }
        if(this.layer) {
            this.layer.destroyFeatures();
            store.bind(this.layer);
        }
        this.reconfigure(store, this.createColumnModel(store));
    },
    
    /** private: method[createColumnModel]
     *  :param store: ``GeoExt.data.FeatureStore``
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