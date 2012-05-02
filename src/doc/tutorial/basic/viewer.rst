.. _gxp.basics.viewer:

Creating a Viewer
=================
The central object in the architecture of gxp is a gxp.Viewer. A viewer
basically combines a map panel with tools, but it can do much more than that.
By default a viewer will fill up the whole  viewport. The main configuration
options for a gxp.Viewer are:

* proxy: The proxy to use in order to bypass the same origin policy when
  accessing remote resources through JavaScript. Will be set as
  OpenLayers.ProxyHost.
* portalItems: The items to add to the portal, in addition to the map panel the
  viewer will create automatically.
* portalConfig: Configuration object for the wrapping container (usually an
  Ext.Viewport) of the viewer.
* tools: a set of tools that you want to use in the application, e.g. measure
  tools or a layer tree
* mapItems: any items to be added to the map panel, such as a zoom slider
* sources: Configuration of layer sources available to the viewer, e.g.
  MapQuest or a WMS server
* map: the configuration for the actual map part of the viewer, such as
  projection, layers, center and zoom

We will see many of these options in the following sections.

Setting up a new project
------------------------
We will use the Readygxp project to set up a new viewer application called
myviewer. This assumes that you have set up git and ant on your system::

    curl -L https://github.com/opengeo/readygxp/raw/master/readygxp.sh | sh -s myviewer

Next, change into the directory myviewer and start up the application::

    cd myviewer
    ant init
    ant debug

The application will run in debug mode on port 8080. If you want to run on a
different port, specify -Dapp.port, e.g.::

    ant -Dapp.port=8081 debug

Now start up a browser, and type in the address of the application:

  .. figure:: gxp-img1.png
     :align: center
     :width: 1000px

So what you get is a basic webmapping application which contains a layer tree,
a map panel and some map tools. The map panel contains an OpenStreetMap base
layer. Having successfully created our first viewer, we'll continue by looking
more closely at :ref:`the parts <gxp.basics.dissect>`.
