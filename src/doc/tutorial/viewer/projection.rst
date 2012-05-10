.. _sdk.viewer.projection:

Changing the projection of the viewer
=====================================
We will now change the viewer application to be in EPSG:4326 (WGS84) instead of Google Mercator. This will mean that our 2 base layers (OSM and Google) are no longer available, so we will start by commenting them in app.js.

Then we will reconfigure the map options in EPSG:4326, so remove (or comment) the entries for projection, units, maxResolution, maxExtent and center, and add the following:

.. code-block:: javascript

    projection: "EPSG:4326",
    center: [-97, 38]

Reload the application in your browser:

  .. figure:: gxp-img12.png
     :align: center
     :width: 1000px

We will now add a WMS of the world as our new base layer, first define a new source in the sources section:

.. code-block:: javascript

    ol: {
        ptype: "gxp_olsource"
    }

This type is an OpenLayers Source, which will allow us to define any OpenLayers Layer type. For our use case we want to configure an OpenLayers.Layer.WMS to a vmap0 tilecache instance, so add the following to the layers config:

.. code-block:: javascript

    {
        source: "ol",
        type: "OpenLayers.Layer.WMS",
        args: ["World map", "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'}],
        group: "background"
    }

This will result in:

  .. figure:: gxp-img13.png
     :align: center
     :width: 1000px

As a last step in our layer configuration, we will add a blank base layer to the application:

.. code-block:: javascript

    {
        source: "ol",
        type: "OpenLayers.Layer",
        args: ["Blank"],
        visibility: false,
        group: "background"
    }

This will result in:

  .. figure:: gxp-img14.png
     :align: center
     :width: 1000px

In the next section we will change the :ref:`locale of the viewer <sdk.viewer.locale>`.
