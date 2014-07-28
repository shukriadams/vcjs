/*======================================================
 Collection of utility functions.
------------------------------------------------------*/
define('vc', ['jquery'], function ($) {

    "use strict";
    var vc = {};


    // ======================================================
    // stringifies complex objects
    // from http://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
    // ------------------------------------------------------
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



    /*======================================================
     Returns a query string value for name from current
     location.
     ------------------------------------------------------*/
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


    // ======================================================
    // adds string.format support. WARNING : changes string
    // prototype!
    // ------------------------------------------------------
    // from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
    String.prototype.format = function () {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };


    // ======================================================
    // checks if value is in inteCreate format
    // ------------------------------------------------------
    vc.isInt = function (value) {
        return (parseFloat(value) == parseInt(value)) && !isNaN(value);
    };


    // ======================================================
    // Returns true if array contains the given item.
    // ------------------------------------------------------
    vc.arrayContains = function (array, item) {
        if (array === null || array === undefined)
            return false;
        return !! ~array.indexOf(item);
    };


    // ======================================================
    //
    // ------------------------------------------------------
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


    // ======================================================
    // Bind "enter" key on a field to click a button
    // usage : vc.bindEnter($('#txtField'), function(){ somelogic.save(); });
    // ------------------------------------------------------
    vc.bindEnter = function (fieldidentifier, callback) {
        $(fieldidentifier).keydown(function (d) {
            if (d.keyCode === 13) {
                callback();
            }
        });
    };

    vc.bindEscape = function (fieldidentifier, callback) {
        $(fieldidentifier).keydown(function (d) {
            if (d.keyCode === 27) {
                callback();
            }
        });
    };


    // ======================================================

    // ======================================================
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

    return vc;
});

