/*======================================================
Human-friendly string handling operations.
------------------------------------------------------*/
define('vcparser', [], function () {

    "use strict";

    var parser = {};


    /*======================================================
    Returns a substring after the last occurrence of a given
    preceding string.
    ------------------------------------------------------*/
    parser.returnAfterLast = function (main, sub) {
        // if substring doesn't exist in main string, returns zero length string
        if (main.indexOf(sub) == -1)
            return "";

        // if no text after substring, returns zero length string
        if (main.length - 1 == main.lastIndexOf(sub))
            return "";

        return main.substring(main.lastIndexOf(sub) + sub.length);
    };


    /*======================================================
    Returns a substring leadingup to the last occurrence of
    a given preceding string.
    ------------------------------------------------------*/
    parser.returnUptoLast = function (main, sub) {
        // if substring doesn't exist in main string, returns zero length string
        if (main.indexOf(sub) == -1)
            return "";

        // if no text before substring, returns the main string
        if (main.length == sub.length)
            return "";

        // if reaches here, proceed to find desired substring
        return main.substring(0, main.lastIndexOf(sub));
    };


    return parser;

});

