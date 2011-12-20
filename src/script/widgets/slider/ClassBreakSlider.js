/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */
 
/** api: (define)
 *  module = gxp.slider
 *  class = ClassBreakSlider
 *  base_link = `Ext.slider.MultiSlider <http://extjs.com/deploy/dev/docs/?class=Ext.slider.MultiSlider>`_
 */
Ext.namespace("gxp.slider");

/** api: constructor
 *  .. class:: ClassBreakSlider(config)
 *   
 *      Slider to adjust class breaks in a ColorMap or a set of filtered rules.
 */
gxp.slider.ClassBreakSlider = Ext.extend(Ext.slider.MultiSlider, {
    
    /** api: config[store]
     *  ``Ext.data.Store``
     *  A (filtered) store containing records with a ``filter``
     *  (``OpenLayers.Filter.Comparison``|``Number``) field. Usually records
     *  are created with a :class:`gxp.data.GroupStyleReader`. Comparison
     *  filters are expected to be ``PropertyIsLessThan``,
     *  ``PropertyIsBetween`` or ``PropertyIsGreaterThanOrEqualTo``.
     */
    store: null,
    
    /** api: config[values]
     *  ``Array(Number)`` Will be ignored. Configure :attr:`store` instead.
     */
    
    /** api: config[constrainThumbs]
     *  ``false`` to allow thumbs to overlap one another. Defaults to ``true``.
     */
    constrainThumbs: true,
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        this.store = Ext.StoreMgr.lookup(this.store);
        this.values = this.storeToValues();
        this.on("changecomplete", this.valuesToStore);
        this.store.on("update", this.storeToValues, this);
        gxp.slider.ClassBreakSlider.superclass.initComponent.call(this);        
    },
    
    /** private: method[storeToValues]
     *  :returns: ``Array(Number)`` The thumb values. If the slider has thumbs
     *  already, the thumb values will be updated.
     *
     *  Calculates the thumb values from the filters in the store's records.
     */
    storeToValues: function() {
        var values = [];
        this.store.each(function(rec) {
            var filter = rec.get("filter");
            if (filter instanceof OpenLayers.Filter) {
                if (filter.type === OpenLayers.Filter.Comparison.BETWEEN) {
                    if (this.store.indexOf(rec) === 0) {
                        values.push(filter.lowerBoundary);
                    }
                    values.push(filter.upperBoundary);
                } else if (filter.type === OpenLayers.Filter.Comparison.LESS_THAN) {
                    values.push(filter.value);
                }
            } else if (typeof filter === "number") {
                values.push(filter);
            }
        }, this);
        if (this.thumbs) {
            for (var i=values.length-1; i>=0; --i) {
                this.setValue(i, values[i]);
            }
        }
        return values;
    },
    
    /** private: method[valuesToStore]
     *  Update the filter boundaries in the store with the slider values.
     */
    valuesToStore: function() {
        var values = this.getValues(),
            store = this.store;
        store.un("update", this.storeToValues, this);
        store.each(function(rec) {
            var filter = rec.get("filter").clone();
            if (filter instanceof OpenLayers.Filter) {
                if (filter.type === OpenLayers.Filter.Comparison.BETWEEN) {
                    filter.upperBoundary = values.shift();
                } else if (filter.type === OpenLayers.Filter.Comparison.LESS_THAN) {
                    filter.value = values.shift();
                }
            } else if (typeof filter === "number") {
                if (rec.get("filter") !== values[0]) {
                    rec.set("filter", values.shift());
                }
            }
            if (rec.get("filter").toString() !== filter.toString()) {
                rec.set("filter", filter);
            }
        }, this);
        store.on("update", this.storeToValues, this);
    }
    
});

/** api: xtype = gxp_classbreakslider */
Ext.reg('gxp_classbreakslider', gxp.slider.ClassBreakSlider);
