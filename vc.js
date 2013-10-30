$(function () {

    "use strict";

    window.vc = window.vc || {};
    var vc = window.vc;

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


    // ======================================================
    // adds string.format support
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
});