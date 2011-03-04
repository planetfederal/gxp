/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = NewSourceWindow
 *  extends = Ext.Window
 */
Ext.namespace("gxp");

/** api: constructor
 * .. class:: gxp.NewSourceWindow(config)
 *
 *     An Ext.Window with some defaults that better lend themselves toward use 
 *     as a quick query to get a service URL from a user.
 */
gxp.NewSourceWindow = Ext.extend(Ext.Window, {

    /** api: config[title]
     *  ``String``
     *  Window title (i18n).
     */
    title: "Add New Server...",

    /** api: config[cancelText]
     *  ``String``
     *  Text for cancel button (i18n).
     */
    cancelText: "Cancel",
    
    /** api: config[addServerText]
     *  ``String``
     *  Text for add server button (i18n).
     */
    addServerText: "Add Server",
    
    /** api: config[contactingServerText]
     *  ``String``
     *  Text for server contact (i18n).
     */
    contactingServerText: "Contacting Server...",
    
    /** api: config[bodyStyle]
     * The default bodyStyle sets the padding to 0px
     */
    bodyStyle: "padding: 0px",

    /** api: config[width]
     * The width defaults to 300
     */
    width: 300,

    /** api: config[closeAction]
     * The default closeAction is 'hide'
     */
    closeAction: 'hide',

    /** api: property[error]
     * ``String``
     * The error message set (for example, when adding the source failed)
     */
    error: null,

    /** api: event[server-added]
     * Fired with the URL that the user provided as a parameter when the form 
     * is submitted.
     */

    initComponent: function() {

        this.addEvents("server-added");

        this.urlTextField = new Ext.form.TextField({
            fieldLabel: "URL",
            allowBlank: false,
            width: 240,
            msgTarget: "under",
            vtype: "url",
            validator: OpenLayers.Function.bind(function() {
                // use previous error
                return (this.error == null) ? true : this.error;
            }, this)
        });

        this.form = new Ext.form.FormPanel({
            items: [
                this.urlTextField
            ],
            border: false,
            labelWidth: 30,
            bodyStyle: "padding: 5px",
            autoWidth: true,
            autoHeight: true
        });

        this.bbar = [
            new Ext.Button({
                text: this.cancelText,
                handler: function() {
                    this.hide();
                },
                scope: this
            }),
            new Ext.Toolbar.Fill(),
            new Ext.Button({
                text: this.addServerText,
                iconCls: "add",
                handler: function() {
                    // Clear validation before trying again.
                    this.error = null;
                    if (this.urlTextField.validate()) {
                        this.fireEvent("server-added", this.urlTextField.getValue());
                    }
                },
                scope: this
            })
        ];

        this.items = this.form;

        gxp.NewSourceWindow.superclass.initComponent.call(this);

        this.form.on("render", function() {
            this.loadMask = new Ext.LoadMask(this.form.getEl(), {msg:this.contactingServerText});
        }, this);

        this.on("hide", function() {
            // Reset values so it looks right the next time it pops up.
            this.error = null;
            this.urlTextField.validate(); // Remove error text.
            this.urlTextField.setValue("");
            this.loadMask.hide();
        }, this);

        this.on("server-added", function(url) {
            this.setLoading();
            var success = function(record) {
                this.hide();
            };

            var failure = function() {
                this.setError(this.sourceLoadFailureMessage);
            };

            // this.explorer.addSource(url, null, success, failure, this);
            this.addSource(url, success, failure, this);
        }, this);

    },

    /** private: method[setLoading]
     * Visually signify to the user that we're trying to load the service they 
     * requested, for example, by activating a loadmask.
     */
    setLoading: function() {
        this.loadMask.show();
    },

    /** private: method[setError] 
     * :param: error the message to display
     *
     * Display an error message to the user indicating a failure occurred while
     * trying to load the service.
     */
    setError: function(error) {
        this.loadMask.hide();
        this.error = error;
        this.urlTextField.validate();
    },

    /** api: config[addSource]
     * A callback function to be called when the user submits the form in the 
     * NewSourceWindow.
     *
     * TODO this can probably be extracted to an event handler
     */
    addSource: function(url, success, failure, scope) {
    }
});
