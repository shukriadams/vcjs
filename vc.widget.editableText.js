$(function () {

    "use strict";

    window.vc = window.vc || {};
    var vc = window.vc;
    vc.widget = vc.widget || {};


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.widget.editableText = function (options) {
        var defaults = {
            id: null,
            action: null,
            parentId: null,
            parentType: null,
            property: null
        };
        options = $.extend(defaults, options);
        this.options = options;
        this.root = $('#' + options.id);

        var self = this;

        this.root.find('#static_value').click(function () { self.edit(); });
        this.root.find('#btnEdit').click(function () { self.edit(); });
        this.root.find('#btnCancel').click(function () { self.cancel(); }); ;
        this.root.find('#btnSave').click(function () { self.save(); });
        var textField = self.root.find('#txtEdit');
        vc.bindEnter(textField, function () { self.save(); });
        vc.bindEscape(textField, function () { self.cancel(); });

    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.widget.editableText.prototype = function () { this.apply(this, arguments); };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.widget.editableText.prototype.edit = function () {
        this.root.find('#display_content').hide();
        this.root.find('#edit_content').show();
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.widget.editableText.prototype.save = function () {
        var newValue = this.root.find('#txtEdit').val();
        newValue = $.URLEncode(newValue);
        var self = this;

        $.ajax({
            url: '{4}?parentId={0}&parentType={1}&property={2}&value={3}'.format(self.options.parentId, self.options.parentType, self.options.property, newValue, self.options.action),
            success: function (result) {
                if (result.code === "0") {
                    self.root.find('#static_value').html(self.root.find('#txtEdit').val());
                    self.root.find('#display_content').show();
                    self.root.find('#edit_content').hide();
                } else {
                    alert(result.message);
                }
            }
        });
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.widget.editableText.prototype.cancel = function () {
        this.root.find('#txtEdit').val(this.root.find('#static_value').html());
        this.root.find('#display_content').show();
        this.root.find('#edit_content').hide();
    };

});