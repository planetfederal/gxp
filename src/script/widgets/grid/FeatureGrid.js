/**
 * Copyright (c) 2008 The Open Planning Project
 *
 */

/**
 * @requires GeoExplorer.js
 */

/**
 * api: (define)
 * module = GeoExplorer
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

Ext.namespace("GeoExplorer");
GeoExplorer.FeatureGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: property[attributesStore]
     *  :class:`GeoExt.data.AttributesStore` If provided, the fields for the
     *  store and the column model will be derived from the information of
     *  this store. Otherwise, a DescribeFeatureType request needs to be
     *  issued.
     */
    attributesStore: null,

    /**
     * api: property[layer]
     * An ``OpenLayers.Layer`` on which features of this grid will also be
     * displayed (and selection synced), if provided.
     */
    layer : null,

    /** api: property[url]
     * A :class:`String` containing an OWS URL to which the
     * WFS DescribeFeatureType and GetFeature requests are sent.  Necessary if
     * not both store and attributesStore are passed in as a configuration
     * options.
     */
    url: null,
    
    /** api: config[featureType]
     *  ``String`` the feature type to issue WFS requests for
     */
    featureType: null,

    /** api: method[initComponent]
     * 
     * Initializes the FeatureGrid. If attributesStore is provided, the grid
     * will be created right away with the final columnModel. Otherwise, a
     * DescribeFeatureType needs to be issued first to determine the fields,
     * and the initial grid will be configured with a temporary columnModel.
     */
    initComponent: function(){
        
        var fields;
        if(this.attributesStore) {
            this.attributesStore.records.each(function(f) {
                fields.push({
                    //TODO make sure that this is what we have in the records
                    name: f.get("name"),
                    type: f.get("type")
                });
            });
        } else {
            //TODO do a DescribeFeatureType and reconfigure the grid when the
            // results are available
        }

        if(!this.store){
            this.store = new GeoExt.data.FeatureStore({
                layer: this.layer,
                //TODO what happens if fields is null/undefined?
                fields: fields,
                proxy: new GeoExt.data.ProtocolProxy({
                    protocol: new OpenLayers.Protocol.WFS({
                        url: this.url,
                        //TODO configure the format
                        format: new OpenLayers.Format.WFS()
                    })
                }),
                autoLoad: true
            });
        }

        this.cm = new Ext.grid.ColumnModel([
            //TODO configure the ColumnModel
        ]);

        GeoExplorer.FeatureGrid.superclass.initComponent.call(this);       
    }

});
