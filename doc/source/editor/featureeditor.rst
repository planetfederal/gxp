.. _gxp.editor.featureeditor:

Setting up a feature editor
===========================

Unlike the feature manager discussed in the previous section, the feature editor is actually a visible component in the viewer. Again, start with adding plugins/FeatureEditor.js to the build profile, and open up app.js in your editor:

.. code-block:: javascript

    {
        ptype: "gxp_featureeditor",
        featureManager: "states_manager",
        autoLoadFeatures: true
    }

However, the FeatureEditor has a dependency on GeoExt/widgets/form.js , so we need to add that to the GeoExt section of buildjs.cfg as well.
Restart ant, reload the web browser. You will see that 2 new tools were added to the toolbar: one to create new features, and one to modify existing features:

  .. figure:: gxp-img16.png
     :align: center
     :width: 1000px

So click on the "Edit existing feature" button, and click on the USA state in the map, this will result in a popup showing up:

  .. figure:: gxp-img17.png
     :align: center
     :width: 1000px

Press the Edit button to edit the feature's geometry and/or the feature's attributes. Modify the geometry and modify one of the attributes:

  .. figure:: gxp-img18.png
     :align: center
     :width: 1000px

When you are done with editing, press the Save button. Make sure that your GeoServer supports transactions by making sure the Service Level is set to Transactional or Complete in the WFS page of the GeoServer admin tool. The result will be saved using WFS-T (please note that for real systems, editing on top of shapefiles is not recommended):

  .. figure:: gxp-img19.png
     :align: center
     :width: 1000px
