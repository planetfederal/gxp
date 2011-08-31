.. _gxp.editor.featuremanager:

Setting up a feature manager
============================

Editing in GXP always starts with setting up a feature manager. The API docs for the feature manager plugin can be found here:

http://gxp.opengeo.org/master/doc/lib/plugins/FeatureManager.html

Add plugins/FeatureManager.js to the build profile of the application (buildjs.cfg). Open up the file app/static/script/app/app.js in the myviewer directory and search for the tools section, add the following plugin to the tools section:

.. code-block:: javascript

    {
        ptype: "gxp_featuremanager",
        id: "states_manager",
        paging: false,
        layer: {
            source: "local",
            name: "usa:states"
        }
    }

If we reload the application, we will not see any difference. This is because the feature manager is an invisble tool, that can be used by other tools, such as the FeatureEditor. In the above case we have configured the feature manager with a fixed layer. However, it's also possible to have the feature manager listen to the active (selected) layer in the layer tree. In the latter case, the feature manager would be configured without a layer and with autoSetLayer set to true.

However, if we would open up Firebug we would see 2 additional requests going off: a SLD WMS DescribeLayer request, and a WFS DescribeFeatureType request for the configured layer.
