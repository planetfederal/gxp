.. _sdk.styler.styler:

Adding a Styler plugin
======================

The Styler plugin makes it possible to edit styles. This uses the REST config module that the OpenGeo Suite's GeoServer ships with.

Note, by default the styler plugin will only work with the GeoServer of the same OpenGeo Suite instance that your app is deployed to.

So let's prepare our build profile: open app.js and add plugins/Styler.js to the list of dependencies at the top of the file. 

Search for the tools section, and add the Styler plugin:

.. code-block:: javascript

    {
        ptype: "gxp_styler"
    }

Restart the application using ant and refresh the browser:

  .. figure:: gxp-img22.png
     :align: center
     :width: 1000px

We now have a new button which will show a powerful styles dialog. However, in order to edit colors, we still need to add a few things:

* copy over the script/ux/colorpicker directory from GeoExplorer (https://github.com/opengeo/GeoExplorer/tree/master/app/static/script/ux/colorpicker)
* copy over the theme/ux/colorpicker directory from GeoExplorer (https://github.com/opengeo/GeoExplorer/tree/master/app/static/theme/ux/colorpicker)
* open up app/static/index.html and add a stylesheet <link rel="stylesheet" type="text/css" href="theme/ux/colorpicker/color-picker.ux.css" />
* restart ant

We should now be able to edit the color of a rule:

  .. figure:: gxp-img23.png
     :align: center
     :width: 1000px
