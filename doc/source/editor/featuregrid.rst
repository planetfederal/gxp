.. _gxp.editor.featuregrid:

Adding a feature grid
=====================

A feature grid can be used to show the features in a table as well as in the map. First we will need to create a container for it in the layout. Open up app.js and edit the items section of portalConfig:

.. code-block:: javascript

    {
        id: "south",
        xtype: "container",
        layout: "fit",
        region: "south",
        border: false,
        height: 200
    }

Then go to the tools section, and add a feature grid:

.. code-block:: javascript

    {
        ptype: "gxp_featuregrid",
        featureManager: "states_manager",
        outputConfig: {
            loadMask: true
        },
        outputTarget: "south"
    }

The grid will still be empty, since the feature manager only loads a feature in our current application when there is a click on the map matching a state. So go to the feature manager section in app.js, and add autoLoadFeatures true to the feature manager's config:

.. code-block:: javascript

    autoLoadFeatures: true

Open up buildjs.cfg, and add plugins/FeatureGrid.js. Restart the application using ant, and reload the browser. Now we will have a feature grid in the bottom of our application, which is initally loaded with all the states:

  .. figure:: gxp-img20.png
     :align: center
     :width: 1000px

When the button "Display on map" is pressed, all the features are rendered client-side, and when walking through the grid the respective state is highlighted in the map:

  .. figure:: gxp-img21.png
     :align: center
     :width: 1000px
