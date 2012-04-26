.. _gxp.basics.sdk:

gxp Development Environment
===========================

Once installed, the SDK not only provides a debug mode for developing
applications. The ant based build tool can also be used to create war packages
for deployment on servlet containers, and to do a remote deployment on an
OpenGeo Suite installation or any servlet container.

The main difference between running the application in debug mode and the
artifacts for deployment is that the javascript resources will be concatenated
and minified to reduce the number and size of files to be transferred between
the production server and the end user's client.

Building a war Package
----------------------

For applications that only consist of static files, a ``static-war`` task is
available. If an application uses server side JavaScript, the ``war`` task can
be used.::

    $ ant static-war

The above will create a ``myviewer.war`` file (according to the name of the
application from the previous example) in the ``build/`` directory.

Deploying to a Remote Servlet Container
---------------------------------------

The OpenGeo Suite's servlet containers are configured to accept remote
deployments. On a fresh OpenGeo Suite installation, the password for remote
deployments needs to be configured on the servlet container.

For Windows and OSX installations, the password can be set in the
``realm.properties`` file in the
``C:\Program Files\OpenGeo\OpenGeo Suite\etc\`` (Windows) or
``/opt/opengeo/suite/etc/`` (OSX) folder. To use ``mypassword`` as password,
this file would have a line like the following::

    manager: mypassword,manager

This means that the username is "manager" (``manager:``), and the account is
valid for the "manager" group (``,manager``).

For Linux installations, the password can be set in Tomcat's
``tomcat-users.xml`` file. On Debian based distributions (e.g. Ubuntu) with
Tomcat 6, this file can be found in ``/etc/tomcat6/``::

    <tomcat-users>
      <role rolename="manager"/>
      <user username="manager" password="mypassword" roles="manager"/>
    </tomcat-users>

The above sets up a user with user name ``manager`` and password ``mypassword``.