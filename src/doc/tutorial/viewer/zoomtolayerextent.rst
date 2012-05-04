.. _sdk.viewer.featureinfo:

Adding a 'Zoom to Layer Extent' tool
====================================

After adding a layer, wouldn't it be useful to be able to zoom to its extent? This is what the 'Zoom to Layer Extent' tool was made for, and we will add this tool to the toolbar on top of the layer tree, and to the context menu that appears when we right-click on a layer in the tree.

On the file system navigate to the file app/static/script/app/app.js in the myviewer directory. Open up this file in your favorite editor. Open up the API docs for gxp, and find a tool which could provide the Zoom to Layer Extent functionality (look in the section titled gxp.plugins):

http://gxp.opengeo.org/master/doc/

The following plugin looks like it could provide what we need:

http://gxp.opengeo.org/master/doc/lib/plugins/ZoomToLayerExtent.html

Its ptype is "gxp_zoomtolayerextent", so we will add an entry in the tools configuration of app.js:

.. code-block:: javascript

    {
        ptype: "gxp_zoomtolayerextent",
        actionTarget: ["tree.tbar", "tree.contextMenu"]
    }

The ``actionTarget`` property tells the plugin where to place its buttons. In
this case we want it in the top toolbar of the layertree ('tree.tbar'), and in
the tree's context menu ('tree.contextMenu').

As the next step we need to add the new tool to our build profile, so we add a line to the list of dependencies at the top of our app.js file. Now restart the application with ant, and reload the application in your browser. You should now see an extra tool button in the tree's toolbar.

Select a layer and click on this button to zoom to the layer's extent.

In the :ref:`next section <sdk.viewer.featureinfo>` we will learn how to add a legend to the viewer.
