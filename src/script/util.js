/**
 * Copyright (c) 2009 The Open Planning Project
 */


Ext.namespace("gxp");

gxp.util = {
    
    /** private: property[_uniqueNames]
     *  ``Object`` cache that keeps track of unique names
     */
    _uniqueNames: {},

    /** api: function[dispatch]
     *  :param functions: ``Array(Function)`` List of functions to be called.
     *      All functions will be called with two arguments - a callback to
     *      call when the sequence is done and a storage object.
     *  :param complete:  ``Function`` A function that will be called when all
     *      other functions report that they are done.  The final callback
     *      will be called with the storage object passed to all other
     *      functions.
     *  :param scope: ``Object`` Optional object to be set as the scope of all
     *      functions called.
     *      
     *  Allows multiple asynchronous sequences to be called in parallel.  A
     *  final callback is called when all other sequences report that they
     *  are done.
     */
    dispatch: function(functions, complete, scope) {
        complete = complete || Ext.emptyFn;
        scope = scope || this;
        var requests = functions.length;
        var responses = 0;
        var storage = {};
        function respond() {
            ++responses;
            if(responses === requests) {
                complete.call(scope, storage);
            }
        }
        function trigger(index) {
            window.setTimeout(function() {
                functions[index].apply(scope, [respond, storage]);
            });
        }
        for(var i=0; i<requests; ++i) {
            trigger(i);
        }
    },
    
    /** api: function[loadScript]
     *  :param url: ``String`` url of the script file.
     *  :param complete:  ``Function`` Optional function that will be called
     *      when the script file is loaded.
     *  :param scope: ``Object`` Optional object to be set as the scope for
     *      the complete function.
     *  :param attributes: ``Object`` Key-value pairs of additional attributes
     *      for the script tag (e.g. charset)
     *      
     *  Allows dynamic loading of javascript resources.
     */
    loadScript: function(url, complete, scope, attributes) {
        var script = document.createElement("script");
        script.src = url;
        if(complete) {
            script.onload = complete.createDelegate(scope || window);
            script.onreadystatechange = function() {
                if(this.readyState == "complete") {
                    complete.call(scope || window);
                }
            }
        }
        if(attributes) {
            for(a in attributes) {
                script[a] = attributes[a];
            }
        }

        document.getElementsByTagName("head")[0].appendChild(script);
    },

    /**
     * Function: getSymbolTypeFromRule
     * Determines the symbol type of the first symbolizer of a rule that is
     * not a text symbolizer
     * 
     * Parameters:
     * rule - {OpenLayers.Rule}
     * 
     * Returns:
     * {String} "Point", "Line" or "Polygon" (or undefined if none of the
     *     three)
     */
    getSymbolTypeFromRule: function(rule){
        var symbolizer = rule.symbolizer;
        if (symbolizer["Line"] || symbolizer["Point"] || symbolizer["Polygon"]) {
            for (var type in symbolizer) {
                if (type != "Text") {
                    return type;
                }
            }
        }
    },

    /** api: method[uniqueName]
     *  :param name: ``String`` The name to make unique across this session.
     *  :param delimiter: ``Char`` Optional. Delimiter for appending the
     *      number that makes the new name unique. Defaults to " " (blank).
     *  :return: ``String`` a unique name based on ``name``
     *  
     *  Appends a delimiter and a number to make the passed ``name`` unique
     *  in the current session.
     */
    uniqueName: function(name, delimiter) {
        delimiter = delimiter || " ";
        var regEx = new RegExp(delimiter + "[0-9]*$");
        var key = name.replace(regEx, "");
        var regExResult = regEx.exec(name);
        var count = this._uniqueNames[key] !== undefined ?
            this._uniqueNames[key] :
            (regExResult instanceof Array ? Number(regExResult[0]) : undefined);
        var newName = key;
        if(count !== undefined) {
            count++;
            newName += delimiter + count;
        }
        this._uniqueNames[key] = count || 0;
        return newName;
    }

};