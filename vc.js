/**
 * Collection of utility functions.
 */

'use strict';
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
 * Very quick and dirty waitfor
 **/
vc.waitFor = function(check, callback, interval, maxTries){
    var i = 0,
        timer = setInterval(function(){
            if (check() === true){
                clearInterval(timer);
                callback();
            }
            i++;
            if (i > maxTries){
                clearInterval(timer);
                throw 'Too many attempts for waitFor';
            }
    }, interval);
};


/**
 * Generates a unique hash of a string. Based on https://stackoverflow.com/a/33647870/1216792
 */
vc.hash = function(string){
    var hash = 0, i = 0,
        len = string.length;

    while ( i < len ) {
        hash  = ((hash << 5) - hash + string.charCodeAt(i++)) << 0;
    }

    return hash;
};


/**
 * Chained wait.then 
 **/
vc.wait = function(delay, callback){
    window.setTimeout(callback, delay);
    return this;
};
vc.then = vc.wait;

/**
 * Comma separates large number
 * http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 * */
vc.separateLargeNumber = function(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
 * Generates a random number between min and max
 **/
vc.random = function(min,max)
{
    return Math.floor( Math.random() * (max - min + 1) + min );
};

/**
 * Moved to pguid lib on github
 */
// vc.generateUUID = function(){};


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

    for (var nr = 0 ; nr < hex.length ; nr ++){
        var val = hex[nr];
        if (val.length === 1) {
            hex[nr] = "0" + val;
        }
    }
    return hex.join("").toUpperCase();
};


/**
 * gets an "x time" ago for a date.
 * DEPRECATED : use s-ago package instead.
 */
vc.ago = function(date){
    var diff = new Date().getTime() - date.getTime();

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -=  days * (1000 * 60 * 60 * 24);

    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

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
 * DEPRECATED - moved to timebelt package
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

    return `${minutes}:${seconds}`;
};


/**
 * Returns true of dom element has css class. with "classList" this method is no longer necessary, deprecate.
 **/
vc.hasClass = function(element, cssClass){
    return element.classList.contains(cssClass);
};


/**
 *  Gets the index of the element in its sibling collection.
 */
vc.index = function (element){
	return [].indexOf.call(element.parentElement.children, element)
};


/**
 * Tests if child desecends from parent in DOM tree.
 * Childs must be a DOM element.
 * Parent can be a DOM element, or string className (not a selector)
 **/
vc.isDescendentOf = function(child, parent){
        
    while (child){
        
        // check if tested element has parent class name
        if (typeof(parent) === 'string' && child.classList.contains(parent))
            return true;
        // test if tested element is parent
        else if (child === parent)
            return true;
        
        // ascend one node in DOM
        child = child.parentElement;
    }

    return false;
};


/** 
 * Gets the top and left offset of an element - this is identical to jquery's $(element).offset()
 */
vc.offset = function offset(element)
{
    let result = {
        left: 0,
        top: 0
    };

    do {
        if (!isNaN(element.offsetLeft))
            result.left += element.offsetLeft;
        if (!isNaN(element.offsetTop))
            result.top += element.offsetTop;

    } while(element = element.offsetParent);

    return result;
}


/**
 * Finds the first parent element with the class parentClass. 
 **/
vc.closest = function(child, parentClass){
    while (child){

        if (typeof(child.className) === 'string' && child.className.split(' ').indexOf(parentClass) !== -1)
            return child;

        child = child.parentElement;
    }

    return null;
};


/**
 * Finds the first parent element with the attribute attributeName.
 **/
vc.closestWithAttribute = function(child, attributeName){
    while (child){

        if (child.hasAttribute(attributeName))
            return child;

        child = child.parentElement;
    }

    return null;
};


/**
 * Compares two arrays of primitives by value. Returns true if the sequence or contents of arrays differ.
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
};


/**
 * Basic regex test for email format. Won't catch 100% of errors, but good enough.
 */
vc.emailFormatValid = function(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default vc;

