.. _gxp.basics.dissect:

Dissecting your Viewer
======================
So let's examine how this was set up using ReadyGXP by opening up Firebug in Firefox, selecting the Script tab and looking for the file app.js (note you need the second entry of app.js, the first one is the loader file):

  .. figure:: gxp-img2.png
     :align: center
     :width: 1000px

So when Ext.onReady fires, a new gxp.Viewer object is created. The viewport is filled with a border layout, which has two items, a container in the 'west' region of 200 pixels wide, and the map in the 'center' region. Please note that all tools in GXP are Ext plugins, so they can be created with a ptype shortcut in the config, similar to the xtype shortcut for Ext components. This viewer application defines the following tools:

* a layer tree, which will be rendered in the 'west' panel defined in the portalConfig
* the add layers tool, a button that, when clicked, creates a dialog to add new layers to the map, the add layers tool will be part of the top toolbar of the layer tree
* the remove layer tool, which will be shown both in the top toolbar of the layer tree as well as in the context menu of the layer tree, this tool can be used to remove a layer from the map
* the zoom to extent tool, which will be shown in the top toolbar of the map, this can be used to zoom to the maximum extent of the map
* the zoom tool, which will create two buttons in the map top toolbar, to zoom in and zoom out with a factor 2 centered on the current map center
* the navigation history tool, which will create two buttons in the map top toolbar, to switch between extents

The viewer configuration defines two layer sources, a WMS-C (cacheable WMS) source to a local GeoServer (with the embedded GeoWebCache), and an OpenStreetMap source. Layer sources are also implemented as Ext plugins, so configured with a ptype. The configuration for the map defines the initial map extent (centered on the USA) and the layers to load in the ma, in this case an OSM base layer and the usa:states layer from a default GeoServer setup. If no local GeoServer can be found, this layer will not be loaded ofcourse. Last, a zoom slider is defined, note that this can also be done using mapItems.

In the above application, we did not get the GeoServer usa:states layer, since we did not have a local GeoServer running. To overcome this issue, we can use a proxy in development mode::

    ant -Dapp.proxy.geoserver=http://localhost:8080/geoserver/  -Dapp.port=8081 debug

This assumes we have a local GeoServer running on port 8080.

Now we will get the usa:states layer added to the application:

  .. figure:: gxp-img3.png
     :align: center
     :width: 1000px

Next we will look at useful :ref:`resources <gxp.basics.resources>` for GXP.
