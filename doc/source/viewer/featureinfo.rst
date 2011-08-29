.. _gxp.viewer.featureinfo:

Adding a WMS GetFeatureInfo tool
================================
On file system navigate to the file app/static/script/app/app.js in the myviewer directory. Open up this file in your favorite editor. Open up the API docs for gxp, and find a tool which could provide the WMS GetFeatureInfo functionality (look in the section titled gxp.plugins):

http://gxp.opengeo.org/master/doc/

The following plugin looks like it could provide what we need:

http://gxp.opengeo.org/master/doc/lib/plugins/WMSGetFeatureInfo.html

Its ptype is gxp_wmsgetfeatureinfo, so we will add an entry in the tools configuration of app.js:

.. code-block:: javascript

    {
        ptype: “gxp_wmsgetfeatureinfo”
    }

As the next step we need to add the new tool to our build profile in buildjs.cfg, so open up the file buildjs.cfg (in the root of the myviewer directory) in your favorite editor, and search for a section called gxp. In the include section, add plugins/WMSGetFeatureInfo.js. Now restart the application with ant, and reload the application in your browser. You should now see an extra tool button in the map's toolbar:

  .. figure:: gxp-img4.png
     :align: center
     :width: 1000px

Click on this button to activate the tool, and click on one of the USA states. You should then get a popup displaying the information about that state using WMS GetFeatureInfo:

  .. figure:: gxp-img5.png
     :align: center
     :width: 1000px

Let's say you want to influence the way that the popup looks, e.g. increase its width. Open up the file app.js again, and add a section called outputConfig to your tool configuration:

.. code-block:: javascript

    {
        ptype: "gxp_wmsgetfeatureinfo",
        outputConfig: {
            width: 400
        }
    }

Reload the application in the browser, and check that the popup now has a width of 400 pixels:

  .. figure:: gxp-img6.png
     :align: center
     :width: 1000px

So what if we want to influence the sequence of tools in the toolbar, e.g. having the WMS GetFeatureInfo tool as the second button? Open up app.js, and configure an actionTarget with an index:

.. code-block:: javascript

    {
        ptype: "gxp_wmsgetfeatureinfo",
        outputConfig: {
            width: 400
        },
        actionTarget: {
            target: "map.tbar",
            index: 1
        }
     }

The button is now the second button in the toolbar:

  .. figure:: gxp-img7.png
     :align: center
     :width: 1000px
