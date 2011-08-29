.. _gxp.basics.viewer:

Creating a Viewer
=================
The central object in the architecture of gxp is a gxp.Viewer. A viewer basically combines a map panel with tools, but it can do much more than that. By default a viewer will fill up the whole Ext viewport. The main configuration options for a gxp.Viewer are:

* proxy: the proxy to use in order to bypass the same origin policy, will be set as OpenLayers.ProxyHost
* portalItems: this is basically the Ext layout setup for the application. The viewer will create a map panel automatically.
* portalConfig: configuration object for the wrapping container of the viewer.
* tools: a set of tools that you want to use in the application, e.g. measure tools or a layer tree
* mapItems: any items to be added to the map panel, such as a zoom slider
* sources: the configuration for the layer sources, e.g. Google or a WMS server
* map: the configuration for the actual map part of the viewer, such as projection, units, layers, center and zoom

We will see many of these options at work in the next sections.

Setting up a new project
------------------------
We will use the readygxp project to set up a new viewer application called myviewer. This assumes that you have set up git and ant on your system::

    curl -L https://github.com/opengeo/readygxp/raw/master/readygxp.sh | sh -s myviewer

Next, change into the directory myviewer and start up the application::

    cd myviewer
    ant init
    ant debug

The application will run in debug mode on port 8080. If you want to run on a different port, specify -Dapp.port, e.g.::

    ant -Dapp.port=8081 debug

So start up a browser, and type in the address of the application:

  .. figure:: gxp-img1.png
     :align: center
     :width: 1000px

So what you get is a basic webmapping application which contains a layer tree, a map panel and some map tools. The map panel contains an OpenStreetMap base layer. Having successfully created our first viewer, we'll continue by looking more closely at :ref:`the parts <gxp.basics.dissect>`.
