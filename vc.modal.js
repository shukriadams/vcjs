$(function () {

    "use strict";

    window.vc = window.vc || {};
    var vc = window.vc;


    // ===============================================================================
    // Constructor
    // -------------------------------------------------------------------------------
    vc.modal = function (options) {
        var defaults = {
            url: null,      // url to get modal content from
            content: null,  // static modal content
            title: "",
            onLoaded : null // callback
        };

        options = $.extend(defaults, options);
        var host = $('#modal-host');
        this.host = host;
        var self = this;

        if (options.url) {
            $.ajax({
                url: options.url,
                success: function (html) {
                    self.body = host.find('[class="modal-body"]');
                    self.body.html(html);
                    $(host).modal('show');

                    if (options.onLoaded)
                        options.onLoaded({ modal: self });
                }
            });
        } else if (options.content) {
            host.find('[class="modal-body"]').html(options.content);
            $(host).modal('show');
        }

        $(host).find('#btnCloseLoggerMain').click(function () {
            $(host).modal('hide');
        });

        $(host).find('[class="modal-title"]').html(options.title);
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.modal.prototype = function () { this.apply(this, arguments); };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.modal.prototype.close = function () {
        this.host.modal('hide');
    };

});