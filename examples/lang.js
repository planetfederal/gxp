/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */
var localeDir = "../src/script/locale/";
var grid;
Ext.onReady(function() {
    
    resetGrid();
    
    gxp.Lang.on({
        "localize" : resetGrid
    });
    
    Ext.get("english").on({
        "click" : function(){
            gxp.Lang.setLocale("en");
            gxp.Lang.localize();
        }
    });

    Ext.get("welsh").on({
        "click" : function(){
            gxp.Lang.setLocale("cy");
            gxp.Lang.localize();
       }
    });

});

    // create a grid to display records from the store
function resetGrid(){
    if(grid){
        grid.destroy();
    }

    grid = new gxp.grid.CapabilitiesGrid({
        url: "/geoserver/ows",
        renderTo: "grid",
        allowNewSources: false,
        width: 400,
        height: 300
    });   
    
}