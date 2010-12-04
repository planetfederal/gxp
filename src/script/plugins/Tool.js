Ext.namespace("gxp.plugins");

gxp.plugins.Tool = Ext.extend(Ext.util.Observable, {
    
    /** api: ptype = gx_tool */
    ptype: "gx_tool",

    /** api: config[actionTarget]
     *  ``String`` or ``Array`` Where to place the tool's actions (e.g. buttons
     *  or menus)? This can be any string that references an ``Ext.Container``
     *  property on the portal, or a unique id configured on a component, or an
     *  array of the aforementioned if the action is to be put in more than one
     *  places (e.g. a button and a context menu item). To reference one of the
     *  toolbars of an ``Ext.Panel``, ".tbar", ".bbar" or ".fbar" has to be
     *  appended. The default is "map.tbar". This config option is only
     *  relevant for subclasses that have actions. The viewer's main MapPanel
     *  can always be accessed with "map" as actionTarget.
     */
    actionTarget: "map.tbar",
    
    /** api: config[toggleGroup]
     *  ``String`` If this tool should be radio-button style toggled with other
     *  tools, this string is to identify the toggle group.
     */
    
    /** api: config[outputTarget]
     *  ``String`` Where to add the tool's output container? This can be any
     *  string that references an ``Ext.Container`` property on the portal. If
     *  not provided, the portal is assumed. 
     */
     
    /** api: config[outputConfig]
     *  ``Object`` Optional configuration for the output container. This may
     *  be useful to override the xtype (e.g. "window" instead of "gx_popup"),
     *  or to provide layout configurations when rendering to an
     *  ``outputTarget``.
     */
    
    /** private: property[target]
     *  ``Object``
     *  The :class:`gxp.Viewer` that this plugin is plugged into.
     */
     
    /** private: property[actions]
     *  ``Array`` The actions this tool has added to viewer components.
     */
     
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;
        Ext.apply(this, config);
        if (!this.id) {
            this.id = Ext.id();
        }
        gxp.plugins.Tool.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
        this.target = target;
        this.target.on("portalReady", this.addActions, this);
    },
    
    /** api: method[addActions]
     *  :param actions: ``Array`` Optional actions to add. If not provided,
     *      this.actions will be added. Actions provided here may have an
     *      additional ``menuText`` property, which will be used as text when
     *      the action is used in a menu. The ``text`` property will only be
     *      used in buttons.
     *  :returns: ``Array`` the actions added.
     */
    addActions: function(actions) {
        actions = actions || this.actions;
        if (!actions) {
            return;
        }

        var actionTargets = this.actionTarget instanceof Array ?
            this.actionTarget : [this.actionTarget];
        var a = actions instanceof Array ? actions : [actions];
        var actionTarget, i, j, parts, ref, ct, meth, item;
        for (i=actionTargets.length-1; i>=0; --i) {
            actionTarget = actionTargets[i];
            parts = actionTarget.split(".");
            ref = parts[0];
            item = parts.length > 1 && parts[1];
            ct = ref ?
                ref == "map" ?
                    this.target.mapPanel :
                    (this.target.portal[ref] || Ext.getCmp(ref)) :
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
            for (j=a.length-1; j>= 0; --j) {
                if (!(a[j] instanceof Ext.Action)) {
                    a[j] = new Ext.Action(a[j]);
                }
                action = a[j];
                if (ct instanceof Ext.menu.Menu) {
                    ct.add(Ext.apply(new Ext.menu.Item(action),
                        {text: action.initialConfig.menuText})
                    );
                } else {
                    ct.add(new Ext.Button(action));
                }
            }
            // call ct.show() in case the container was previously hidden (e.g.
            // the mapPanel's bbar or tbar which are initially hidden)
            ct.isVisible() ?
                ct.doLayout() : ct instanceof Ext.menu.Menu || ct.show();
        }
        this.actions = actions instanceof Array ? a : a[0];
        return this.actions;
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var ref = this.outputTarget;
        var ct = ref ?
            ref == "map" ?
                this.target.mapPanel :
                (this.target.portal[ref] || Ext.getCmp(ref)) :
            this.target.portal;
        Ext.apply(config, this.outputConfig);
        var cmp = ct.add(config);
        cmp instanceof Ext.Window ? cmp.show() : ct.doLayout();
        return cmp;
    }
    
});

Ext.preg(gxp.plugins.Tool.prototype.ptype, gxp.plugins.Tool);
