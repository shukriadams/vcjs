define('vcProgressBar', ['jquery', 'vc'], function ($) {

    "use strict";

    // ===============================================================================
    // Requires vc for string.format override
    // -------------------------------------------------------------------------------
    var bar = function (options) {
        var defaults = {
            done: 0,    // can be either pixels width, percentage width or units
            total : 1,  // if using units, this must be Bind
            height: 2,  // always in pixels
            width: 100,
            cssClass: 'progressbar',
            units: 'pixels'   // "pixels" | "percent"
        };
        $.extend(defaults, options);
        $.extend(this, defaults);

        var bar =
            "<div class='{4}' style=width:{0};height:{1}px;'>" +
            "<div style='width:{2};height:{1}px;'>" +
            "<span> <span>" +
            "</div>" +
            "<div style='width:{3};height:{1}px;'>" +
            "<span> <span>" +
            "</div>" +
            "<div style='clear:both;'> </div>" +
            "</div>";

        var totalWidth = "";
        var doneWidth = "";
        var leftWidth = "";

        if (this.units === "percent") {
            totalWidth = "100%";
            doneWidth = this.done + "%";
            leftWidth = (this.width - this.done) + "%";
        } else {
            totalWidth = this.width + "px";
            doneWidth = this.done + "px";
            leftWidth = (this.width - this.done) + "px";
        }

        bar = bar.format(totalWidth, this.height, doneWidth, leftWidth, this.cssClass);

        this.html = bar;
    };


    // ===============================================================================
    // Apply this to all classes to Create "this" to work from from event contexts
    // -------------------------------------------------------------------------------
    bar.prototype = function () { this.apply(this, arguments); };

    return bar;
});