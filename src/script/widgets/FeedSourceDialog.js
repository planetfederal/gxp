/**
 * Published under the GNU General Public License
 * Copyright 2011 © The President and Fellows of Harvard College
 */

/**
 * @requires plugins/FeedSource.js
 * @requires widgets/PointSymbolizer.js
 */

Ext.namespace("gxp");

gxp.FeedSourceDialog = Ext.extend(Ext.Container, {

    feedTypeText: "Feed Source",

    addPicasaText: "Picasa Photos",

    addYouTubeText: "YouTube Videos",

    addRSSText: "Other GeoRSS Feed",

    addFeedText: "Add to Map",

    addTitleText: "Feed Title",

    keywordText: "Keyword",

    doneText: "Done",

    /** config: config[mapPanel]
     *  ``GeoExt.MapPanel``
     *  GeoExplorer object to which layers can be added.
     */
    target : null,

    width: 600,

    autoHeight: true,

    closeAction: 'destroy',

    titleText: "Add Feeds",


    /** private: method[initComponent]
     */
    initComponent: function() {

        this.addEvents("addFeed");


        if (!this.feedTypes) {
            this.feedTypes  = [
                ["gx_picasasource", this.addPicasaText],
                ["gx_youtubesource", this.addYouTubeText],
                ["gx_feedsource", this.addRSSText]
            ];
        }

        var feedStore = new Ext.data.ArrayStore({
            fields: ['type', 'name'],
            data : this.feedTypes
        });

        var sourceTypeSelect = new Ext.form.ComboBox({
            store: feedStore,
            fieldLabel: this.feedTypeText,
            displayField:'name',
            valueField:'type',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText:'Select a feed source...',
            selectOnFocus:true,
            listeners: {
                "select": function(choice) {
                    if (choice.value == "gx_feedsource") {
                        urlTextField.show();
                        keywordTextField.hide();
                        maxResultsField.hide();
                        symbolizerField.show();
                    } else {
                       urlTextField.hide();
                       keywordTextField.show();
                       maxResultsField.show();
                       symbolizerField.hide();
                    }
                    submitButton.setDisabled(choice.value == null);
                },
                scope: this
            }
        });

        var urlTextField = new Ext.form.TextField({
            fieldLabel: "URL",
            allowBlank: false,
            //hidden: true,
            width: 240,
            msgTarget: "right",
            validator: this.urlValidator.createDelegate(this)
        });

        var keywordTextField = new Ext.form.TextField({
            fieldLabel: this.keywordText,
            allowBlank: true,
            hidden: true,
            width: 150,
            msgTarget: "right"
        });

        var titleTextField = new Ext.form.TextField({
            fieldLabel: this.addTitleText,
            allowBlank: true,
            width: 150,
            msgTarget: "right"
        });

       var maxResultsField = new Ext.form.ComboBox({
            fieldLabel: 'Maximum # Results',
            hidden: true,
            hiddenName: 'max-results',
            store: new Ext.data.ArrayStore({
                fields: ['max-results'],
                data : [[10],[25],[50],[100]]
            }),
            displayField: 'max-results',
            mode: 'local',
            triggerAction: 'all',
            emptyText:'Choose number...',
            labelWidth: 100,
            defaults: {
                labelWidth: 100,
                width:100
            }
        });


        var symbolizerField = new gxp.PointSymbolizer({
            bodyStyle: {padding: "10px"},
            border: false,
            hidden: true,
            labelWidth: 70,
            defaults: {
                labelWidth: 70
            },
            symbolizer: {pointGraphics: "circle", pointRadius: "5"}
        });


        symbolizerField.find("name", "rotation")[0].hidden = true;

        if (this.symbolType === "Point" && this.pointGraphics) {
            cfg.pointGraphics = this.pointGraphics;
        }

        var submitButton =  new Ext.Button({
            text: this.addFeedText,
            iconCls: "gxp-icon-addlayers",
            disabled: true,
            handler: function() {
                var ptype = sourceTypeSelect.getValue();
                var config = {
                    "name" : titleTextField.getValue()
                };

                if (ptype != "gx_feedsource") {
                    config.params = {"q" : keywordTextField.getValue(), "max-results" : maxResultsField.getValue()}

                } else {
                    config.url = urlTextField.getValue();
                    var symbolizer = symbolizerField.symbolizer
                    config.defaultStyle = {};
                    config.selectStyle = {};
                    Ext.apply(config.defaultStyle, symbolizer);
                    Ext.apply(config.selectStyle, symbolizer);
                    Ext.apply(config.selectStyle, {
                        fillColor: "Yellow",
                        pointRadius: parseInt(symbolizer["pointRadius"]) + 2
                    });
                }

                this.fireEvent("addFeed", ptype, config);

            },
            scope: this
        });


        var bbarItems = [
            "->",
            submitButton,
            new Ext.Button({
                text: this.doneText,
                handler: function() {
                    this.hide();
                },
                scope: this
            })
        ];

        this.panel = new Ext.Panel({
            bbar: bbarItems,
            items: [
                sourceTypeSelect,
                titleTextField,
                urlTextField,
                keywordTextField,
                maxResultsField,
                symbolizerField
            ],
            layout: "form",
            border: false,
            labelWidth: 100,
            bodyStyle: "padding: 5px",
            autoWidth: true,
            autoHeight: true
        });

        this.items = this.panel;

        gxp.FeedSourceDialog.superclass.initComponent.call(this);

    },



    /** private: property[urlRegExp]
     *  `RegExp`
     *
     *  We want to allow protocol or scheme relative URL
     *  (e.g. //example.com/).  We also want to allow username and
     *  password in the URL (e.g. http://user:pass@example.com/).
     *  We also want to support virtual host names without a top
     *  level domain (e.g. http://localhost:9080/).  It also makes sense
     *  to limit scheme to http and https.
     *  The Ext "url" vtype does not support any of this.
     *  This doesn't have to be completely strict.  It is meant to help
     *  the user avoid typos.
     */
    urlRegExp: /^(http(s)?:)?\/\/([\w%]+:[\w%]+@)?([^@\/:]+)(:\d+)?\//i,

    /** private: method[urlValidator]
     *  :arg url: `String`
     *  :returns: `Boolean` The url looks valid.
     *
     *  This method checks to see that a user entered URL looks valid.  It also
     *  does form validation based on the `error` property set when a response
     *  is parsed.
     */
    urlValidator: function(url) {
        var valid;
        if (!this.urlRegExp.test(url)) {
            valid = this.invalidURLText;
        } else {
            valid = !this.error || this.error;
        }
        // clear previous error message
        this.error = null;
        return valid;
    }


});

/** api: xtype = gxp_embedmapdialog */
Ext.reg('gxp_feedsourcedialog', gxp.FeedSourceDialog);




