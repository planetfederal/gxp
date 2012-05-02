.. _gxp.basics.dissect:

Dissecting your Viewer
======================
Let's examine how this was set up using Readygxp by opening up your browser's
debugging tool, e.g. Chrome/Safari Developer Tools or Firebug in Firefox,
selecting the Script tab and looking for the file app.js (note you need the
second entry of app.js, the first one is the loader file):

  .. figure:: gxp-img2.png
     :align: center
     :width: 1000px

When Ext.onReady fires, a new gxp.Viewer object is created. The viewport is
filled with a border layout, which has two items, a container in the 'west'
region of 200 pixels wide, and the map in the 'center' region. Please note that
all tools in gxp are Ext plugins, so they can be created with a ptype shortcut
in the config, similar to the xtype shortcut for Ext components. This viewer
application defines the following tools:

* A Layer Tree, which will be rendered in the 'west' panel defined in the
  portalConfig.
* The Add Layers tool, a button that, when clicked, creates a dialog to add new
  layers to the map. This tool will be part of the top toolbar of the layer
  tree.
* The Remove Layer tool, which will be shown both in the top toolbar of the
  layer tree and in the context menu of the layer tree. This tool can be
  used to remove a layer from the map.
* The Zoom to Extent tool, which will be shown in the top toolbar of the map.
  This can be used to zoom to the maximum extent of the map.
* The Zoom tool, which will create two buttons in the map top toolbar, to zoom
  in and zoom out with a factor 2 centered on the current map center.
* The navigation history tool, which will create two buttons in the map's top
  toolbar, to navigate through visited map extents.

The viewer configuration defines two layer sources, a WMS-C (cacheable WMS)
source to a local GeoServer (with the embedded GeoWebCache), and an
OpenStreetMap source. Layer sources are also implemented as Ext plugins, so
configured with a ptype. The configuration for the map defines the initial map
extent (centered on the USA) and the layers to load in the map, in this case an
OSM base layer and the usa:states layer from an OpenGeo Suite's default
GeoServer setup. If no local GeoServer can be found, this layer will not be
loaded of course. Finally, a zoom slider is defined. Note that this can also be
done using mapItems.

In the above application, we did not get the GeoServer usa:states layer, since
we did not have a local GeoServer running. To overcome this issue, we proxy a
GeoServer so it appears next to our app at http://localhost:8081/geoserver::

    ant -Dapp.proxy.geoserver=http://localhost:8080/geoserver/ -Dapp.port=8081 debug

This assumes we have an OpenGeoSuite GeoServer running on port localhost at
port 8080.

Now we will see the usa:states layer added to the application:

  .. figure:: gxp-img3.png
     :align: center
     :width: 1000px

Next we will look at useful :ref:`resources <gxp.basics.resources>` for gxp.
