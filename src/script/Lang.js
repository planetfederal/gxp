/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */



/** api: (define)
 *  module = gxp
 *  class = Lang
 */
Ext.namespace("gxp");


/**
 *  Utility class for localization.
 */
gxp.Lang = {

    /**
     * private: locale
     *  Current language code to use in translation.  Use <gxp.Lang.setLocale>
     * method to set.
     */
    locale: null,

    /**
     * api: defaultLocale
     * 
     * Default language to use when a specific language can't be
     *     found.  Default is "en".
     */
    defaultLocale: "en",


    /**
     * private: events
     * An Observable that allows gxp.Lang to have events.
     */
    events : function(){
        var events = new Ext.util.Observable();
        events.addEvents({"localize":true});

        return events;
    }(),

    /**
     * api: method[setLocale]
     * :arg locale: ''String'' These codes follow the IETF recommendations at
     *     http://www.ietf.org/rfc/rfc3066.txt, or try to.  If no value is set, the
     *     browser's language setting will be tested. If no locale is found,
     *     the <String.defaultgxp.Lang> will be used.
     *
     * Set the language code for string translation.  This code is used by
     *     the <gxp.Lang.localize> method.
     *
     * Gets code from a source in this order: an argument passed into the
     *     function, a 'locale' parameter in the
     *     URL's query string; the browser's set language; the defaultLocale
     *     property set on this class.
     */
    setLocale: function(locale) {

        if(!locale && window.location.search){
            locale = Ext.urlDecode(window.location.search.substring(1)).locale;
        }

        var cp = new Ext.state.CookieProvider({});
        if(!locale){
            locale = cp.get("locale");
        }

        if(!locale) {
            locale = Ext.isIE ?
                navigator.usergxp.Language : navigator.language;
        }

        if(!locale){
            locale = gxp.Lang.defaultLocale;
        }

        /*  TODO: Deal with regional extensions correctly */

        var parts = locale.split('-');
        parts[0] = parts[0].toLowerCase();

        //??
        locale = parts[0];
        /*
        // check for regional extensions
        if(parts[1]) {
            var testgxp.Lang = parts[0] + '_' + parts[1].toUpperCase();
            if(typeof gxp.Lang[testgxp.Lang] == "object") {
                lang = testgxp.Lang;
            }
        }

        if(!lang) {
            console.warn(
                'Failed to find gxp.Lang.' + parts.join("-") +
                ' dictionary, falling back to default language'
            );
            lang = gxp.Lang.defaultCode;
        }
        */


        gxp.Lang.locale = locale;

        return locale;
    },


    /** api: method[on]
     *  :arg events: Object representing events, their handlers, and scope 
     *
     *  Assigns handlers to events in the given scope.  For example,
     *    ''{"localize" : foo, "scope" : bar}'' assigns the handler ''foo''
     *    to the ''localize'' event, executed in scope ''bar''.
     *  
     */
    on: function(events){
        gxp.Lang.events.on.apply(gxp.Lang.events, arguments);
    },


    /** api: method[ready]
     *
     *  Triggers a firing of this class's ''localize'' event.
     */
    ready: function(){
        this.events.fireEvent("localize", this);
    },



    /**
     * api: method[localize]
     * :arg onLocalize: ''Function'' A callback to b fired on localization
     * :arg scope: The scope in which to call the callback
     *
     * Determines a language if one hasn't already been determined, then
     * loads the appropriate language file.
     */

    localize : function(onLocalize, scope){
        if(!this.locale){
            this.setLocale();
        }

        if(onLocalize){
            scope = scope || this;
            this.events.on({
                "localize" : onLocalize,
                scope: scope
            });
        }

        var head = Ext.fly(document.getElementsByTagName('head')[0]);

        if(this.locale) {
            var src = window.localeDir + 'app-lang-' + this.locale + '.js';
            if (Ext.isIE || Ext.isSafari || Ext.isChrome) {
                Ext.Ajax.request({
                    url: src,
                    success: function(response, options) {
                        eval(response.responseText);
                        gxp.Lang.ready();
                    },
                    failure: function() {
                        gxp.Lang.ready();
                    }
                });
            } else /* Firefox, etc. */ {
                var script = Ext.DomHelper.append(head, {
                    tag:'script',
                    type:'text/javascript',
                    src: src,
                    onload: 'gxp.Lang.ready()'
                });
            }
        }
    }
};


