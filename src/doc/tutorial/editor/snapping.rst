.. _gxp.editor.snapping:

Setting up snapping
===================

When editing it might make sense to use snapping, e.g. when editing parking meters, it makes sense to snap to curbs. In our case, it might make sense to snap to the states layer, so when digitizing a new state, we make sure it aligns well with another state. Open up app.js and add a tool to configure a snapping agent:

.. code-block:: javascript

    {
        ptype: "gxp_snappingagent",
        id: "snapping-agent",
        targets: [{
            source: "local",
            name: "usa:states"
        }]
    }

This creates a snapping agent, that will load the usa:states data using a BBOX Strategy and hooking it up with an OpenLayers snapping control.

Now we need to hook up our feature editor with the snapping agent:

.. code-block:: javascript

    {
        ptype: "gxp_featureeditor",
        featureManager: "states_manager",
        autoLoadFeatures: true,
        snappingAgent: "snapping-agent"
    }

Also, add plugins/SnappingAgent.js to the gxp section of your build profile, and OpenLayers/Control/Snapping.js and OpenLayers/Strategy/BBOX.js to the openlayers section, and restart the application using ant. Reload the browser. 

Zoom in at the west coast of the USA, and digitize a new state. When you get close to the border of an existing state, you will see that the polygon that you are digitizing is being snapped to that border. 

Note: it is possible that the new state will not show up directly in the GeoServer WMS layer, this is mostly caused by the BoundingBoxes being configured too narrow for the layer. By recomputing the bounding boxes after the transaction, or by enlarging them manually, the new state should show up after a refresh.

In the last section of this module we will learn how use a :ref:`featuregrid <gxp.editor.featuregrid>`.
