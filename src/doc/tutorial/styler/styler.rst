.. _gxp.styler.styler:

Adding a Styler plugin
======================
The Styler plugin makes it possible to edit styles. This depends on the REST config module being installed with GeoServer. Also, we have to enable our proxy to send the Authorization headers to our GeoServer instance. Open up app/config.js and look for the following line:

.. code-block:: javascript

    [(/^\/geoserver\/(.*)/), require("./proxy").pass({url: geoserver, preserveHost: true})]

and change it to (add allowAuth: true):

.. code-block:: javascript

    [(/^\/geoserver\/(.*)/), require("./proxy").pass({url: geoserver, allowAuth: true, preserveHost: true})]

Note, by default the styler plugin will only work if the application is run on the same domain and port as GeoServer. Now our proxy is setup to pass on the Authorization headers to GeoServer, but be warned: never do this for a production proxy. So let's prepare our build profile (buildjs.cfg), and add plugins/Styler.js and widgets/WMSLayerPanel.js to the gxp section. Also add OpenLayers/Style2.js to the openlayers section, and GeoExt/widgets/VectorLegend.js to the geoext section. 

Open up app.js, search for the tools section, and add the Styler plugin:

.. code-block:: javascript

    {
        ptype: "gxp_styler"
    }

Restart the application using ant and refresh the browser:

  .. figure:: gxp-img22.png
     :align: center
     :width: 1000px

We now have a new button which will show a powerfull styles dialog. However, in order to edit colors, we still need to add a few things:

* copy over the script/ux/colorpicker directory from GeoExplorer (https://github.com/opengeo/GeoExplorer/tree/master/app/static/script/ux/colorpicker)
* copy over the theme/ux/colorpicker directory from GeoExplorer (https://github.com/opengeo/GeoExplorer/tree/master/app/static/theme/ux/colorpicker)
* open up app/static/index.html and add a stylesheet <link rel="stylesheet" type="text/css" href="theme/ux/colorpicker/color-picker.ux.css" />
* restart ant

We should now be able to edit the color of a rule:

  .. figure:: gxp-img23.png
     :align: center
     :width: 1000px
