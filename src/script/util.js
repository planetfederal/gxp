/**
 * Copyright (c) 2008-2010 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
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
    
    /** api: function[uniqueName]
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
    },

    /** api: function[getAbsoluteUrl]
     *  :param url: ``String``
     *  :return: ``String``
     *  
     *  Converts the provided url to an absolute url.
     */
    getAbsoluteUrl: function(url) {
        var a;
        if(Ext.isIE) {
            a = document.createElement("<a href='" + url + "'/>");
            a.style.display = "none";
            document.body.appendChild(a);
            a.href = a.href;
            document.body.removeChild(a);
        } else {
            a = document.createElement("a");
            a.href = url;
        }
        return a.href;
    }
};