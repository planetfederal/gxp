.. _gxp.viewer.legend:

Adding a legend tool
====================
We now want to add a legend to the bottom-left area of the viewer application. Open up the API docs again, and search for a plugin that could provide legend functionality:

http://gxp.opengeo.org/master/doc/lib/plugins/Legend.html

The ptype to use is “gxp_legend”. Open up app.js again, and configure another tool:

.. code-block:: javascript

    {
        ptype: "gxp_legend",
        actionTarget: "map.tbar"
    }

Also add this plugin to the build profile (buildjs.cfg) and restart the web application with ant and reload the browser. If we don't do anything else, we will end up with a button in the map's toolbar that will show a popup window with the legend of all visible layers in the viewer:

  .. figure:: gxp-img8.png
     :align: center
     :width: 1000px

However, in our case we want the legend to be always present in the bottom left part of the application (below the layer tree). First we will create the Ext container in which the legend can be rendered. Open up app.js again, and look for westpanel. Replace the configuration of westpanel with:

.. code-block:: javascript

    {
        xtype: "container",
        layout: "vbox",
        region: "west",
        align: "stretch",
        pack: "start",
        defaults: {
            width: 200
        },
        width: 200,
        items: [{
            title: "Layers",
            id: "westpanel",
            flex: 1,
            layout: "fit"
        }, {
            xtype: "container",
            id: "legendpanel",
            layout: "fit",
            height: 250
        }]
    }

Change the configuration of the legend plugin to:

.. code-block:: javascript

    {
        ptype: "gxp_legend",
        outputTarget: "legendpanel"
    }

Now the legend will show up in the container with the id “legendpanel” :

  .. figure:: gxp-img9.png
     :align: center
     :width: 1000px

Next we will learn how to add a :ref:`Google geocoder field <gxp.viewer.geocoder>`.
