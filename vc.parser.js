/*

THIS FILE HAS BEEN MOVED TO YARN!! DO NOT MAINTAIN

*/

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


    /*======================================================
    Replaces all instances of substring
    ------------------------------------------------------*/
	parser.replaceAll = function (s, replace, wth) {
        while (s.indexOf(replace) != -1)
            s = s.replace(replace, wth);
        return s;
    };


    /*======================================================
    Returns string between start and end tag
    ------------------------------------------------------*/
    parser.returnBetween = function (main, startTag, endTag) {
        if (main.indexOf(startTag) == -1 || main.indexOf(endTag) == -1)
            return '';
        else {
            if (main.indexOf(startTag) == -1 || main.indexOf(endTag) == -1)
                return '';
            else {
                var startPosition = main.indexOf(startTag) + startTag.length;
                if (startPosition >= main.length)
                    return '';
                var endPosition = main.indexOf(endTag, startPosition);
                if (endPosition >= main.length)
                    return '';

                return main.substring(startPosition, endPosition);
            }
        }
    };


    /*======================================================
    Returns true if string ends with substring
    ------------------------------------------------------*/
    parser.endsWith = function (main, sub) {
        return main.indexOf(sub, main.length - sub.length) !== -1;
    };

    return parser;

});

