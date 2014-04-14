/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = OpacitySlider
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: OpacitySlider(config)
 *
 *    Plugin for showing an opacity slider to change transparancy of a selected Layer.
 */
gxp.plugins.OpacitySlider = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_opacityslider */
    ptype: "gxp_opacityslider",

    /** api: config[menuText]
     *  ``String``
     *  Text for opacity slider menu item (i18n).
     */
    menuText: "Change Opacity",

    /** api: config[toolTip]
     *  ``String``
     *  Text for opacity slider  action tooltip (i18n).
     */
    toolTip: "Change Layer Opacity",

    constructor: function(config) {
        gxp.plugins.OpacitySlider.superclass.constructor.apply(this, arguments);

        if (!this.outputConfig) {
            this.outputConfig = {
                width: 325,
                autoHeight: true
            };
        }
    },

    /** api: method[addActions]
     */
    addActions: function() {
        var actions = gxp.plugins.OpacitySlider.superclass.addActions.apply(this, [{
            menuText: this.menuText,
            iconCls: "gxp-icon-opacity",
            disabled: true,
            tooltip: this.toolTip,
            handler: function() {
                this.removeOutput();
                this.addOutput();
            },
            scope: this
        }]);
        var layerPropertiesAction = actions[0];

        this.target.on("layerselectionchange", function(record) {
            layerPropertiesAction.setDisabled(false);
        }, this);
        return actions;
    },

    addOutput: function(config) {
        config = config || {};
        var record = this.target.selectedLayer;
        var origCfg = this.initialConfig.outputConfig || {};
        this.outputConfig.title = origCfg.title;

        var layer = record.data.layer;

        // Opacity dialog
        var cmp = Ext.getCmp('WinOpacity-' + layer.id);
        var xy = [120,80];

        if (!cmp) {

            cmp = new Ext.Window({
                title: __('Opacity'),
                id: 'WinOpacity-' + layer.id,
                x: xy[0],
                y: xy[1],
                width: 200,
                resizable: false,
                constrain: true,
                bodyStyle: 'padding:2px 4px',
                closeAction: 'hide',
                listeners: {
                    hide: function () {
                        cmp.x = xy[0];
                        cmp.y = xy[1];
                    },
                    show: function () {
                        cmp.show();
                        cmp.focus();
                    }
                },
                items: [
                    {
                        xtype: 'label',
                        text: layer.name,
                        height: 20
                    },
                    {
                        xtype: "gx_opacityslider",
                        showTitle: false,
                        plugins: new GeoExt.LayerOpacitySliderTip(),
                        vertical: false,
                        inverse: false,
                        aggressive: false,
                        layer: layer
                    }
                ]
            });
            cmp.show();

        } else {
            if (cmp.isVisible()) {
                cmp.hide();
            } else {
                cmp.setPosition(xy[0], xy[1]);
                cmp.show();
                cmp.focus();
            }
        }

    }

});

Ext.preg(gxp.plugins.OpacitySlider.prototype.ptype, gxp.plugins.OpacitySlider);
