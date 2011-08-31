.. _gxp.viewer.geocoder:

Adding a Google Geocoder search field
=====================================
Open up the GXP API docs again, and search for a plugin that could provide this functionality.

http://gxp.opengeo.org/master/doc/lib/plugins/GoogleGeocoder.html

As you can see this will need the Google Maps v3 API to be present in the application. Add the following script tag in app/static/index.html:

.. code-block:: html

    <script src="http://maps.google.com/maps/api/js?v=3.5&amp;sensor=false"></script>

Now open up the file app.js again, and add the tool configuration for this plugin. We want the geocoder field to show up in the map's toolbar:

.. code-block:: javascript

    {
        ptype: "gxp_googlegeocoder",
        outputTarget: "geocoder",
        outputConfig: {
            emptyText: "Search for a location ..."
        }
    }

However to make this happen, we also need to add a tbar to the map's config, otherwise the container in which the geocoder combobox renders will not be there in time:

.. code-block:: javascript

    map: {
        id: "mymap", // id needed to reference map in portalConfig above
        tbar: {id: 'geocoder'},
        title: "Map",
        ..
    }

Add the plugin to the build config (buildjs.cfg) and restart the application using ant. We will now have a Google Geocoder in our viewer:

  .. figure:: gxp-img10.png
     :align: center
     :width: 1000px

Next we will learn how to add a :ref:`Google base layer <gxp.viewer.googlelayer>`.
