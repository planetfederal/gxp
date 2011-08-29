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

Wrt the build config, add plugins/GoogleSource to gxp include section and restart ant.

We will now have a new base layer, Google RoadMap in our viewer:

  .. figure:: gxp-img11.png
     :align: center
     :width: 1000px
