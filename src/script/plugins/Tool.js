Ext.namespace("gxp.plugins");

gxp.plugins.Tool = Ext.extend(Ext.util.Observable, {
    
    /** api: ptype = gx_tool */
    ptype: "gx_tool",

    /** api: config[actionTarget]
     *  ``String`` Where to place the tool's actions (e.g. buttons or menus)?
     *  This can be any string that references an ``Ext.Container`` property on
     *  the portal. To reference the ``tbar`` or ``bbar`` of an ``Ext.Panel``,
     *  ".tbar" or ".bbar" has to be appended. The default is "map.tbar". This
     *  config option is only relevant for subclasses that have actions.
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

    /** private: property[target]
     *  ``Object``
     *  The MapPanel that this plugin is plugged into.
     */
     
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = Ext.apply({
            actionTarget: "map.tbar"
        }, config);
        Ext.apply(this, config);
        gxp.plugins.Tool.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
        this.target = target;
        var actions = this.initialConfig.actions;
        actions && (this.actions = this.addActions(actions));
    },
    
    /** api: method[addActions]
     */
    addActions: function(actions) {
        var actionTarget = this.initialConfig.actionTarget;
        var match = actionTarget.match(/^(.*)\.([tb]bar)$/);
        var ct;
        if (match) {
            var meth = match[2] == "tbar" ? "getTopToolbar" : "getBottomToolbar";
            ct = (match[1] ? this.target[match[1]] : this.target)[meth]();
        } else {
            ct = actionTarget ? this.target[actionTarget] : this.target;
        }
        actions = ct.add.apply(ct, actions);
        // call ct.show() in case the container was previously hidden (e.g.
        // the mapPanel's bbar or tbar which are initially hidden)
        ct.rendered ? ct.doLayout() : ct.show();
        return actions;
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var outputTarget = this.initialConfig.outputTarget;
        var ct = (outputTarget ? this.target[outputTarget] : this.target);
        Ext.apply(config, this.outputConfig);
        var cmp = ct.add(config);
        cmp instanceof Ext.Window ? cmp.show() : ct.doLayout();
        return cmp;
    },
    
});

Ext.preg(gxp.plugins.Tool.prototype.ptype, gxp.plugins.Tool);
