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
     *  ``String`` Where to place the tool's output? This can be any string
     *  that references an ``Ext.Container`` property on the portal. If this
     *  tool has to render an output and no ``outputTarget`` is provided, it
     *  will be rendered to a window which can be configured using the
     *  ``outputWindowCfg`` config option. 
     */
     
    /** api: config[outputWindowCfg]
     *  ``Object`` If no ``outputTarget`` is provided, this config option can
     *  be used to configure the window that will be used for this tool's
     *  output. Note that the tool may use the configuration for a default
     *  xtype other than "window" (e.g. "gx_popup"), but if an xtype is
     *  provided here, it will override the tool's default xtype for the
     *  output window.

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
        this.actions && this.addActions();
    },
    
    /** api: method[addActions]
     */
    addActions: function() {
        var match = this.initialConfig.actionTarget.match(/^(.*)\.([tb]bar)$/);
        var ct;
        if (match) {
            var meth = match[2] == "tbar" ? "getTopToolbar" : "getBottomToolbar";
            ct = this.target[match[1]][meth]();
        } else {
            ct = this.target[this.initialConfig.actionTarget];
        }
        ct.add.apply(ct, this.actions);
        ct.rendered ? ct.doLayout() : ct.show();
    }
    
});

Ext.preg(gxp.plugins.Tool.prototype.ptype, gxp.plugins.Tool);
