.. _gxp.viewer.googlelayer:

Adding a Google base layer
==========================
Open up the file app.js, search for the sources section, and add a google source:

.. code-block:: javascript

    google: {
        ptype: "gxp_googlesource"
    }

Next search for the layers section, and add a Google base layer:

.. code-block:: javascript

    {
        source: "google",
        name: "ROADMAP",
        group: "background"
    }

In the build config, add plugins/GoogleSource.js to the gxp include section and restart ant.

We will now have a new base layer, Google RoadMap in our viewer:

  .. figure:: gxp-img11.png
     :align: center
     :width: 1000px

So adding layers is really simple and only requires configuration. Next we will see what it takes to change the :ref:`projection of the viewer <gxp.viewer.projection>`.
