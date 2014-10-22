/**
 * Collection of utility functions.
 */
define('vc', ['jquery'], function ($) {

    "use strict";
    var vc = {};


    /**
     * Dynamically add a css file to document. If adding an href or id that has already been added, the existing one is replaced.
     * Works on Chrome, FF, IE8+. An IE7 fallback provides partial support.
     * @param {string} href - path to css file. Required.
     * @param {string} [id] - A unique name for the file being added. If specified, 
     */
    vc.requireCss = function (href, id){

		// partial IE 7 fallback. Reimplement unique checks.
		if (document.createStyleSheet)
		{
		    document.createStyleSheet(href);
		    return;
		}

        var head = document.getElementsByTagName("head")[0];
        var fileref;
        
        if (id)
            fileref = head.querySelectorAll('link[id="' + id + '"]');
        else
            fileref = head.querySelectorAll('link[href="' + href + '"]');

        if (fileref && fileref.length === 0) {
            fileref = document.createElement("link");
        } else {
            fileref = fileref[0];
        }

		// note : append element BEFORE setting attributes, due to an IE quirk
        head.appendChild(fileref);

        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("rel", "stylesheet");
        if (id){
            fileref.setAttribute("id", id);
        }
        // note : href must be added LAST because of an IE quirk
        fileref.setAttribute("href", href);
        
    };


    /**
     * stringifies complex objects
     * from http://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
     **/
    vc.stringify = function (obj) {
        function _censor(censor) {
            return (function () {
                var i = 0;

                return function (key, value) {
                    if (i !== 0 && typeof (censor) === 'object' && typeof (value) == 'object' && censor == value)
                        return '[Circular]';

                    if (i >= 29)
                        return '[Unknown]';

                    ++i;

                    return value;
                };
            })(censor);
        }

        return JSON.stringify(obj, _censor(obj));
    };


    /**
     * THIS HAS BEEN MOVED TO YARN
     * Safely combines two parts of a url.
     */
    vc.urlCombine = function (part1, part2) {
        part1 = part1.replace(/\/+$/gm, '');
        part2 = part2.replace(/^\/+/gm, '');
        return part1 + "/" + part2;
    };


    /**
     * Returns a query string value for name from current
     * location.
     */
    vc.getQueryString = function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    };


    /**
     * THIS HAS BEEN MOVED TO YARN
     * adds string.format support. WARNING : changes string
     * prototype!
     * ------------------------------------------------------
     * from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
     */
    String.prototype.format = function () {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };


    /**
     * Genereates a GUID
     * from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
     */
    vc.generateUUID = function(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    };


    /**
     * checks if value is in inteCreate format
     */
    vc.isInt = function (value) {
        return (parseFloat(value) == parseInt(value)) && !isNaN(value);
    };


    /**
     *  Returns true if array contains the given item.
     */
    vc.arrayContains = function (array, item) {
        if (array === null || array === undefined)
            return false;
        return !! ~array.indexOf(item);
    };


    /**
     *
     */
    vc.hexFromRGB = function (r, g, b) {
        var hex = [
            r.toString(16),
            g.toString(16),
            b.toString(16)
        ];
        $.each(hex, function (nr, val) {
            if (val.length === 1) {
                hex[nr] = "0" + val;
            }
        });
        return hex.join("").toUpperCase();
    };


    /**
     * Bind "enter" key on a field to click a button
     * usage : vc.bindEnter($('#txtField'), function(){ somelogic.save(); });
     */
    vc.bindEnter = function (fieldidentifier, callback) {
        $(fieldidentifier).keydown(function (d) {
            if (d.keyCode === 13) {
                callback();
            }
        });
    };


    /**
     *  binds escape key
     */
    vc.bindEscape = function (fieldidentifier, callback) {
        $(fieldidentifier).keydown(function (d) {
            if (d.keyCode === 27) {
                callback();
            }
        });
    };


    /**
     * gets an "x time" ago for a date.
     */
    vc.ago = function(date){
        var diff = new Date().getTime() - date.getTime();

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -=  days * (1000 * 60 * 60 * 24);

        var hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);

        var mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);

        var seconds = Math.floor(diff / (1000));
        diff -= seconds * (1000);

        if (days >= 1)
            return days + " days";
        if (hours >= 1)
            return hours + " hours";
        if (mins >= 1)
            return mins + " minutes";
        else
            return "seconds";
    }


    /**
     *
     */
    vc.secondsToMinutes = function (seconds) {
        var minutes = Math.floor(seconds / 60);

        if (seconds > 60 && minutes > 0)
            seconds = seconds - (minutes * 60);

        minutes = minutes.toString();
        if (minutes.length == 1)
            minutes = "0" + minutes;
        seconds = seconds.toString();
        if (seconds.length == 1)
            seconds = "0" + seconds;

        return "{0}:{1}".format(minutes, seconds);
    };


    /**
     * Compares two arrays of primitives by value. Returns true if the sequence or contents of arrays differ
     */
    vc.areArraysIdentical = function(array1, array2){
        if (array1.length !== array2.length)
            return false;

        if (!array1 && array2 || array1 && !array2)
            return false;

        for (var i = 0 ; i < array1.length ; i ++){
            var item1 = array1[i];
            var item2 = array2[i];

            if (item1 && !item2 || !item1 && item2)
                return false;

            for (var property in item1){
                if (!item1.hasOwnProperty(property) || !item2.hasOwnProperty(property))
                    continue;

                if (item1[property] !== item2[property])
                    return false;
            }

        }

        return true;
    }

    return vc;
});

