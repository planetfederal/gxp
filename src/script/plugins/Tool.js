/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = Tool
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Tool(config)
 *
 *    Base class for plugins that add tool functionality to
 *    :class:`gxp.Viewer`. These plugins are used by adding configuration 
 *    objects for them to the ``tools`` array of the viewer's config object,
 *    using their ``ptype``.
 */   
gxp.plugins.Tool = Ext.extend(Ext.util.Observable, {
    
    /** api: ptype = gxp_tool */
    ptype: "gxp_tool",
    
    /** api: config[autoActivate]
     *  ``Boolean`` Set to false if the tool should be initialized without
     *  activating it. Default is true.
     */
    autoActivate: true,
    
    /** api: property[active]
     *  ``Boolean`` Is the tool currently active?
     */

    /** api: config[actions]
     *  ``Array`` Custom actions for tools that do not provide their own. Array
     *  elements are expected to be valid Ext config objects. Actions provided
     *  here may have an additional ``menuText`` property, which will be used
     *  as text when the action is used in a menu. The ``text`` property will
     *  only be used in buttons. Optional, only needed to create custom
     *  actions.
     */
    
    /** api: config[outputAction]
     *  ``Number`` The ``actions`` array index of the action that should
     *  trigger this tool's output. Only valid if ``actions`` is configured.
     *  Leave this unconfigured if none of the ``actions`` should trigger this
     *  tool's output.
     */
    
    /** api: config[actionTarget]
     *  ``Object`` or ``String`` or ``Array`` Where to place the tool's actions 
     *  (e.g. buttons or menus)? 
     *
     *  In case of a string, this can be any string that references an 
     *  ``Ext.Container`` property on the portal, or a unique id configured on a 
     *  component.
     *
     *  In case of an object, the object has a "target" and an "index" property, 
     *  so that the tool can be inserted at a specified index in the target. 
     *               
     *  actionTarget can also be an array of strings or objects, if the action is 
     *  to be put in more than one place (e.g. a button and a context menu item).
     *
     *  To reference one of the toolbars of an ``Ext.Panel``, ".tbar", ".bbar" or 
     *  ".fbar" has to be appended. The default is "map.tbar". The viewer's main 
     *  MapPanel can always be accessed with "map" as actionTarget. Set to null if 
     *  no actions should be created.
     *
     *  Some tools provide a context menu. To reference this context menu as
     *  actionTarget for other tools, configure an id in the tool's
     *  outputConfig, and use the id with ".contextMenu" appended. In the
     *  snippet below, a layer tree is created, with a "Remove layer" action
     *  as button on the tree's top toolbar, and as menu item in its context
     *  menu:
     *
     *  .. code-block:: javascript
     *
     *     {
     *         xtype: "gxp_layertree",
     *         outputConfig: {
     *             id: "tree",
     *             tbar: []
     *         }
     *     }, {
     *         xtype: "gxp_removelayer",
     *         actionTarget: ["tree.tbar", "tree.contextMenu"]
     *     }
     *
     *  If a tool has both actions and output, and you want to force it to
     *  immediately output to a container, set actionTarget to null. If you
     *  want to hide the actions, set actionTarget to false. In this case, you
     *  should configure a defaultAction to make sure that an action is active.
     */
    actionTarget: "map.tbar",
        
    /** api: config[toggleGroup]
     *  ``String`` If this tool should be radio-button style toggled with other
     *  tools, this string is to identify the toggle group.
     */
    
    /** api: config[defaultAction]
     *  ``Number`` Optional index of an action that should be active by
     *  default. Only works for actions that are a ``GeoExt.Action`` instance.
     */
    
    /** api: config[outputTarget]
     *  ``String`` Where to add the tool's output container? This can be any
     *  string that references an ``Ext.Container`` property on the portal, or
     *  "map" to access the viewer's main map. If not provided, a window will
     *  be created.
     */
     
    /** api: config[outputConfig]
     *  ``Object`` Optional configuration for the output container. This may
     *  be useful to override the xtype (e.g. "window" instead of "gx_popup"),
     *  or to provide layout configurations when rendering to an
     *  ``outputTarget``.
     */

    /** api: config[controlOptions]
     *  ``Object`` If this tool is associated with an ``OpenLayers.Control``
     *  then this is an optional object to pass to the constructor of the
     *  associated ``OpenLayers.Control``.
     */
    
    /** private: property[target]
     *  ``Object``
     *  The :class:`gxp.Viewer` that this plugin is plugged into.
     */
     
    /** private: property[actions]
     *  ``Array`` The actions this tool has added to viewer components.
     */
    
    /** private: property[output]
     *  ``Array`` output added by this container
     */
    output: null,
     
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;
        this.active = false;
        Ext.apply(this, config);
        if (!this.id) {
            this.id = Ext.id();
        }
        this.output = [];
        
        this.addEvents(
            /** api: event[activate]
             *  Fired when the tool is activated.
             *
             *  Listener arguments:
             *  * tool - :class:`gxp.plugins.Tool` the activated tool
             */
            "activate",

            /** api: event[deactivate]
             *  Fired when the tool is deactivated.
             *
             *  Listener arguments:
             *  * tool - :class:`gxp.plugins.Tool` the deactivated tool
             */
            "deactivate"
        );
        
        gxp.plugins.Tool.superclass.constructor.apply(this, arguments);
    },
    
    /** private: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
        target.tools[this.id] = this;
        this.target = target;
        this.autoActivate && this.activate();
        this.target.on("portalready", this.addActions, this);
    },
    
    /** api: method[activate]
     *  :returns: ``Boolean`` true when this tool was activated
     *
     *  Activates this tool.
     */
    activate: function() {
        if (this.active === false) {
            this.active = true;
            this.fireEvent("activate", this);
            return true;
        }
    },
    
    /** api: method[deactivate]
     *  :returns: ``Boolean`` true when this tool was deactivated
     *
     *  Deactivates this tool.
     */
    deactivate: function() {
        if (this.active === true) {
            this.active = false;
            this.fireEvent("deactivate", this);
            return true;
        }
    },
    
    /** api: method[addActions]
     *  :arg actions: ``Array`` Optional actions to add. If not provided,
     *      this.actions will be added.
     *  :returns: ``Array`` The actions added.
     */
    addActions: function(actions) {
        actions = actions || this.actions;
        if (!actions || this.actionTarget === null) {
            // add output immediately if we have no actions to trigger it
            this.addOutput();
            return;
        }
        
        var actionTargets = this.actionTarget instanceof Array ?
            this.actionTarget : [this.actionTarget];
        var a = actions instanceof Array ? actions : [actions];
        var action, actionTarget, i, j, jj, parts, ref, item, ct, meth, index = null;
        for (i=actionTargets.length-1; i>=0; --i) {
            actionTarget = actionTargets[i];
            if (actionTarget) {
                if (actionTarget instanceof Object) {
                    index = actionTarget.index;
                    actionTarget = actionTarget.target;
                }
                parts = actionTarget.split(".");
                ref = parts[0];
                item = parts.length > 1 && parts[1];
                ct = ref ?
                    ref == "map" ?
                        this.target.mapPanel :
                        (Ext.getCmp(ref) || this.target.portal[ref]) :
                    this.target.portal;
                if (item) {
                    meth = {
                        "tbar": "getTopToolbar",
                        "bbar": "getBottomToolbar",
                        "fbar": "getFooterToolbar"
                    }[item];
                    if (meth) {
                        ct = ct[meth]();
                    } else {
                        ct = ct[item];
                    }
                }
            }
            for (j=0, jj=a.length; j<jj; ++j) {
                if (!(a[j] instanceof Ext.Action || a[j] instanceof Ext.Component)) {
                    if (typeof a[j] != "string") {
                        if (j == this.defaultAction) {
                            a[j].pressed = true;
                        }
                        a[j] = new Ext.Action(a[j]);
                    }
                }
                action = a[j];
                if (j == this.defaultAction && action instanceof GeoExt.Action) {
                    action.isDisabled() ?
                        action.activateOnEnable = true :
                        action.control.activate();
                }
                if (ct) {
                    if (ct instanceof Ext.menu.Menu) {
                        action = Ext.apply(new Ext.menu.Item(action),
                            {text: action.initialConfig.menuText}
                        );
                    }
                    action = (index === null) ? ct.add(action) : ct.insert(index, action);
                    if (index !== null) {
                        index += 1;
                    }
                    if (this.outputAction != null && j == this.outputAction) {
                        var cmp;
                        action.on("click", function() {
                            if (cmp) {
                                this.outputTarget ?
                                    cmp.show() : cmp.ownerCt.ownerCt.show();
                            } else {
                                cmp = this.addOutput();
                            }
                        }, this);
                    }
                }
            }
            // call ct.show() in case the container was previously hidden (e.g.
            // the mapPanel's bbar or tbar which are initially hidden)
            if (ct) {
                ct.isVisible() ?
                    ct.doLayout() : ct instanceof Ext.menu.Menu || ct.show();
            }
        }
        this.actions = a;
        return this.actions;
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        if (!config && !this.outputConfig) {
            // nothing to do here for tools that don't have any output
            return;
        }

        config = config || {};
        var ref = this.outputTarget;
        var container;
        if (ref) {
            if (ref === "map") {
                container = this.target.mapPanel;
            } else {
                container = Ext.getCmp(ref) || this.target.portal[ref];
            }
            Ext.apply(config, this.outputConfig);
        } else {
            var outputConfig = this.outputConfig || {};
            container = new Ext.Window(Ext.apply({
                hideBorders: true,
                shadow: false,
                closeAction: "hide",
                autoHeight: !outputConfig.height,
                layout: outputConfig.height ? "fit" : undefined,
                items: [{
                    defaults: {autoHeight: !outputConfig.height}
                }]
            }, outputConfig)).show().items.get(0);
        }
        var component = container.add(config);            
        if (component instanceof Ext.Window) {
            component.show();
        } else {
            container.doLayout();
        }
        this.output.push(component);
        return component;
    },
    
    /** api: method[removeOutput]
     *  Removes all output created by this tool
     */
    removeOutput: function() {
        var cmp;
        for (var i=this.output.length-1; i>=0; --i) {
            cmp = this.output[i];
            if (!this.outputTarget) {
                cmp.findParentBy(function(p) {
                    return p instanceof Ext.Window;
                }).close();
            } else {
                cmp.ownerCt.remove(cmp);
                if (cmp.ownerCt instanceof Ext.Window) {
                    cmp.ownerCt[cmp.ownerCt.closeAction]();
                }
            }
        }
        this.output = [];
    }
    
});

Ext.preg(gxp.plugins.Tool.prototype.ptype, gxp.plugins.Tool);
