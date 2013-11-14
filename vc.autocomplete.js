// ===============================================================================
// Extends the default jQuery autocomplete menu
// -------------------------------------------------------------------------------
$(function () {

    "use strict";

    window.vc = window.vc || {};
    var vc = window.vc;


    // ===============================================================================
    // Constructor
    // -------------------------------------------------------------------------------
    vc.autocomplete = function (options) {

        // default options
        var defaults = {
            host: null,                 // REQUIRED, element autocomplete will act on.
            dataSource: null,           // REQUIRED. Eg, '/Controller/Action'. Server method called for data. Method signature must be "(string term)", and must return Json array of objects { Id, ImageUrl, Name, Description }
            mapType: null,             // REQUIRED. Type that maps server data type to { id, name, type, descripion, img } type for display.
            cssClass: "",               // OPTIONAL.
            onSelect: null,             // OPTIONAL, delegate to invoke when selecting item from menu. Signature must be (id)
            contextMenuType: null,      // OPTIONAL, if using context menu, ie, if "ActiveLinks" is false, this is the object type for which context menu is created. 
            onBeginSearch: null,        // OPTIONAL, this delegate is invoked when the live search process begins.
            onEndSearch: null,          // OPTIONAL, this delegate s invoked when the live search process ends.
            onRendered: null,           // OPTIONAL. Delegate called when search results are rendered. Not called no items are found.
            maxNameLength: 70,          // OPTIONAL, the maximum length of name text, exceeding will cause text to be truncated.
            maxDescriptionLength: 130,  // OPTIONAL, the maximum length of description text, exceeding will cause text to be truncated.
            getSearchArgs: null,        // OPTIONAL. Gets additional search args. 
            getSearchTerm: null,        // OPTIONAL. Gets the search term. Will be url encoded. If not Bind, search term is taken from host.
            deferClear: false,          // Set to true if clearing of menu will be done manually. Call Clear() to clear.
            delay: 400,
            renderHost: null,           // OPTIONAL. Autocomplete contents can be rendered in this element, instead of default jquery "floating" element underneath .Host element
            blockClickEvent: false,     // If true, prevents jquery click event from propagating when clicking on an item in list.     
            displayDividers: true,      // OPTIONAL. dividers are headers for different content type. Disable if search displays only one type of content
            addCloseIcon: true,
            autocomplete: null         // jqueury autocomplete object, exposed if external manipulation required.
        };

        options = $.extend(defaults, options);
        this.options = options;

        // ensure host exists, else abort bind
        if (options.host.length == 0)
            return;

        if (!options.ActiveLinks && options.host == null) {
            alert('An attach element is required for autocomplete.');
            return;
        }

        if (!options.ActiveLinks && options.dataSource == null) {
            alert('An action to execute searches is required.');
            return;
        }

        var self = this,
            loopLastItemType,
            closeIconAdded = false,
            dividersAdded = 0;

        options.autocomplete = $(options.host).autocomplete({
            appendTo: ".eventInsForm",
            minLength: 0,
            delay: options.delay,
            source: function (request, response) {

                // Creates term
                var term = $(options.host).val();
                if (options.getSearchTerm)
                    term = options.getSearchTerm();

                term = $.URLEncode(term);

                //Creates addition search arguments
                var additionalArgs = "";
                if (options.getSearchArgs) {
                    additionalArgs = options.getSearchArgs();
                }

                var searchString = options.dataSource;
                if (searchString.indexOf('?') == -1)
                    searchString = searchString + "?";
                searchString = "{0}&term={1}".format(searchString, term);
                if (additionalArgs.length > 0)
                    searchString = "{0}&{1}".format(searchString, additionalArgs);

                $.ajax({
                    url: searchString,
                    success: function (data) {

                        if (options.onEndSearch != null)
                            options.onEndSearch({ results: data });
                        loopLastItemType = ""; // must force clear this as variable lives between calls, if next search contains same data as previous, divider will not appear
                        dividersAdded = 0;
                        if (data.length == 0)
                            self.Clear();
                        response(data);

                    },
                    async: true
                });

            },
            focus: function (event, ui) {
                // comment out to remove value automatically being filled out in text field on hover
                //$(options.host).val(ui.item.Name);
                return false;
            },
            search: function (event, ui) {

                // need to reBind this when search starts
                closeIconAdded = false;

                if (options.onBeginSearch != null)
                    options.onBeginSearch();
                return true;
            },
            select: function (event, ui) {
                // put item selected logic here

                // stop click event from passing on
                if (options.blockClickEvent)
                    event.stopPropagation();

                if (options.onSelect) {
                    options.onSelect(ui.item);
                }
                return false;
            },
            open: function (event, ui) {

                // add id
                var hostId = $(options.host).attr('id');
                $('ul.ui-autocomplete').attr('id', hostId + "_autocomplete");

                if (options.renderHost != null)
                    $('ul.ui-autocomplete').removeAttr('style').hide().appendTo(options.renderHost).show();

                $('.btCloseAutocomplete').unbind('click');
                $('.btCloseAutocomplete').bind('click', function () {
                    self.Clear();
                });

                if (options.onRendered != null)
                    options.onRendered();
            },
            close: function () {
                if (options.onRendered != null)
                    options.onRendered();
            }
        }).data("ui-autocomplete")._renderItem = function (ul, _item) {
            var item = options.mapType(_item);

            var name = item.name;
            var description = item.description;

            if (name.length > options.maxNameLength)
                name = name.substring(0, options.maxNameLength) + '..';
            if (description.length > options.maxDescriptionLength)
                description = description.substring(0, options.maxDescriptionLength) + '..';

            var divider = "";
            if (self.options.displayDividers && loopLastItemType != item.type) {
                if (dividersAdded > 0)
                    divider += "<hr class='divider' />";
                divider += "<li><div class='livesearch divider'>{0}</div></li>".format(self.GetDividerText(item.type));
                loopLastItemType = item.type;
                dividersAdded++;
            }

            var closeIcon = "";
            if (self.options.addCloseIcon && !closeIconAdded) {
                closeIcon = "<div class='btCloseAutocomplete' title='Close'><i class='icon-remove'></i></div>";
                closeIconAdded = true;
            }

            var itemContent = $("<li></li>")
		        .data("item.autocomplete", item)
                .append(closeIcon)
                .append(divider)
                .append("<a>" +
                            "<div class='livesearch " + options.cssClass + "'>" +
                            "<div class='cell'>" + item.img + "</div>" +
                            "<div class='celltext'><div class='name'>" + name + "</div><div class='description'>" + description + "</div></div>" +
                            "<div class='clearfix'> </div>" +
                            "</div>" +
                        "</a>"
                        )
		        .appendTo(ul);

            return itemContent;
        }; // render item



        if (options.deferClear) {
            this.Clear = function () {
                // original function is from : $(options.host).autocomplete().data("autocomplete").close;
                var self2 = $(options.host).autocomplete().data("autocomplete");
                clearTimeout(self2.closing);
                if (self2.menu.element.is(":visible")) {
                    self2.menu.element.hide();
                    self2.menu.deactivate();
                    self2._trigger("close", null); // null used to be "a", probably not a good idea to blank it
                }
            };
            $(options.host).autocomplete().data("autocomplete").close = function (a) { /* should do something with a*/ };
        }
    };


    // ===============================================================================
    // Add support for this.
    // -------------------------------------------------------------------------------
    vc.autocomplete.prototype = function () { this.apply(this, arguments); };


    // ===============================================================================
    // Placeholder function. Function is injected in.
    // -------------------------------------------------------------------------------
    vc.autocomplete.prototype.Clear = function () {
        // this is the default close. It will be overwritten if deferClose is Bind to
        // true. This is probably not the best way to do this, the two approaches
        // need to be merged.
        $(this.options.host).autocomplete("close");
    };



    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.autocomplete.prototype.GetDividerText = function (type) {
        if (type.toLowerCase() == "profile")
            return "People";
        else if (type.toLowerCase() === "achievement")
            return "Achievements";
        else if (type.toLowerCase() === "activity")
            return "Activities";
        else
            return type;

    };


    // ===============================================================================
    // Cleans up resources used by object. Remember to add all internal callbacks here.
    // -------------------------------------------------------------------------------
    vc.autocomplete.prototype.Dispose = function () {
        $(this.options.host).trigger("unautocomplete");
        this.options.onSelect = null;
        this.options.onBeginSearch = null;
        this.options.onEndSearch = null;
        this.options.onRendered = null;
    };

});