.. _api-reference:

Boundless SDK API reference - ``gxp`` template
==============================================

This document describes the API for using the ``gxp`` template of the Boundless SDK. Other templates, such as ``ol3-view`` and ``ol3-edit``, do not use this API, instead relying on the standard OpenLayers 3 API.

The ``gxp`` components and data utility classes extend map related functionality to equivalent classes in Ext. This API reference here documents the properties, methods, and events that are extensions or modifications to the Ext parent classes. Documentation for each class contains links to the Ext parent class, and for a full picture of the API, it is essential to have a copy of the `Ext API Documentation`_ at hand.

The ``gxp`` classes are typically configured with OpenLayers or GeoExt objects. For detail on methods and properties provided by these objects, see the `OpenLayers API Documentation`_ and `GeoExt API Documentation`_.

For more information about how to use the Boundless SDK, please see the :guilabel:`Building complete web applications` section of the OpenGeo Suite User Manual. This can be found in your local installation or at our `online documentation <http://suite.opengeo.org/docs/latest/webapps/>`_.

.. _`Ext API Documentation`: http://extjs.com/deploy/dev/docs/
.. _`OpenLayers API Documentation`: http://dev.openlayers.org/apidocs
.. _`GeoExt API Documentation`: http://geoext.org/lib/

.. module:: gxp
    :synopsis: High-level components for mapping applications.

:mod:`gxp`
----------

.. toctree::
    :maxdepth: 1

    self
    lib/util
    lib/util/style
    lib/util/color
    lib/overrides

.. toctree::
    :maxdepth: 2
    
    lib/widgets

.. toctree::
    :maxdepth: 2

    lib/data

.. toctree::
    :maxdepth: 2

    lib/menu

.. toctree::
    :maxdepth: 2

    lib/plugins
    
