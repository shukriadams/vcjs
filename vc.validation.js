$(function () {

    "use strict";

    window.vc = window.vc || {};
    var vc = window.vc;


    // ===============================================================================
    // Constructor
    // -------------------------------------------------------------------------------
    vc.validation = function (options) {
        var defaults = {
            $pass: null,    // OPTIONAL. form-level element to show if all validation passes
            $fail: null,    // OPTIONAL. form-level element to show if  any validation fails
            elements: []   // array of objects to validate. Structure is  :
            /*
            . { 
            .    el : $element,
            .    on : 'blur',        // OPTIONAL. jquery event name which element-level validation. If not set, validation will occur when form validation is invoked.
            .    $pass : null,       // OPTIONAL. Element to show if all element validation passes
            .    rules : [],         // array of element validation rules, structure is :
            .    isValid : true,     // OPTIONAL. for internal use. Is dynamically added.
            .    {
            .        type : 'required',  // must match one of the validation rules implemented in this class.
            .        $fail : null,       // OPTIONAL. element to show if rule fails
            .        onFail : null,      // OPTIONAL. callback fired if rule validation fails.   
            .        arg : null,         // object related to validation rule, used by rule logic to validate element. Can be single value, json object or function. See specific rule handler function for details of what it expects.
            .        isValid : true      // OPTIONAL. for internal use. Is dynamically added.
            .    }
            . }
            */
        };

        options = $.extend(defaults, options);
        this.options = options;
        this._isValid = null; // meant to be access via this.IsValid().
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype = function () { this.apply(this, arguments); };


    // ===============================================================================
    // Hooks up events to all ements. must be called explicitly when validation should
    // commence. This allows building up of validation elements after validation objec
    // is instantiated.
    // adds expected properties so we don't have to continuously check if they're undefined
    // -------------------------------------------------------------------------------
    vc.validation.prototype.initialize = function () {
        var self = this;

        // create empty 
        if (!this.options.$pass)
            this.options.$pass = $();
        if (!this.options.$fail)
            this.options.$pass = $();

        $.each(self.options.elements, function (i, el) {
            if (!el.el)
                throw new 'Validation element at position {0} is missing an element $selector.'.format(i);

            // hookup per-element triggers, if any
            if (el.on && el.on.length > 0)
                $(el.el).bind(el.on, function () {
                    self._isValid = null; // for reset 
                    self._validateElementAt(i, null, false);
                });

            // add properties
            if (el.isValid === undefined)
                el.isValid = true;
            if (!el.$pass)
                el.$pass = $();

            if (el.rules === undefined)
                el.rules = [];

            $.each(el.rules, function (j, rule) {
                if (!rule.type)
                    throw new 'Validation rule at position {0} for element {1} is missing an element $selector.'.format(j, el.el.attr('id'));

                if (rule.isValid === undefined)
                    rule.isValid = true;
                if (!rule.$fail)
                    rule.$fail = $();

            });


        });

    };


    // ===============================================================================
    // Validates the form
    // Callback is optional.
    // Use this.isValid property to determine if validation has failed.
    // -------------------------------------------------------------------------------
    vc.validation.prototype.validate = function (callback) {
        this._isValid = null; // for reset 
        var self = this;

        this._validateElementAt(0, function () {

            if (self.isValid()) {
                self.options.$pass.show();
                self.options.$fail.hide();
            } else {
                self.options.$pass.hide();
                self.options.$fail.show();
            }

            if (callback)
                callback();

        });

    };


    // ===============================================================================
    // index : element index in this.options.elements.
    // finishedFormCallback : optional. callback when all validation is finished
    // validateAll : optional. if null or true, validates all. if false, valid only element at index.
    // -------------------------------------------------------------------------------
    vc.validation.prototype._validateElementAt = function (index, finishedFormCallback, validateAll) {
        var self = this;

        if (index < this.options.elements.length) {

            // validate
            this._validateElementRuleAt(index, 0, function () {

                var el = self.options.elements[index];
                el.isValid = true;
                for (var i = 0; i < el.rules.length; i++) {
                    if (!el.rules[i].isValid) {
                        el.isValid = false;
                        break;
                    }
                }

                if (el.isValid)
                    el.$pass.show();
                else
                    el.$pass.hide();

                // next
                if (validateAll === undefined || validateAll == true)
                    self._validateElementAt(index + 1, finishedFormCallback);
            });


        } else {
            // done
            if (finishedFormCallback)
                finishedFormCallback();
        }


    };


    // ===============================================================================
    // Validates on element in the form. 
    // If validation fails, marks form as invalid
    // el is object in this.elements array
    // Callback is optional.
    // -------------------------------------------------------------------------------
    vc.validation.prototype._validateElementRuleAt = function (elementIndex, ruleIndex, callback) {
        var self = this;

        if (elementIndex >= this.options.elements.length) {
            if (callback)
                callback();
            return false;
        }

        var element = this.options.elements[elementIndex];
        if (ruleIndex >= element.rules.length) {
            if (callback)
                callback();
            return false;
        }

        this._validateRule(elementIndex, ruleIndex, function () {
            self._validateElementRuleAt(elementIndex, ruleIndex + 1, callback);
        });

        return false;
    };


    // ===============================================================================
    // Validates a specific rule
    // -------------------------------------------------------------------------------
    vc.validation.prototype._validateRule = function (elementIndex, ruleIndex, callback) {
        var el = this.options.elements[elementIndex];
        var rule = el.rules[ruleIndex];

        // todo : make done() a callback argument for each validation method.
        if (rule.type === 'required') {
            rule.isValid = this.requiredCheck(el.el);
            _done();
        } else if (rule.type === "minlength") {
            rule.isValid = this.minLengthCheck(el.el, el.arg);
            _done();
        } else if (rule.type === "maxlength") {
            rule.isValid = this.maxLengthCheck(el.el, el.arg);
            _done();
        } else if (rule.type === "integer") {
            rule.isValid = this.isIntCheck(el.el);
            _done();
        } else if (rule.type === "checked") {
            rule.isValid = this.isCheckedCheck(el.el);
            _done();
        } else if (rule.type === "isValue") {
            rule.isValid = this.isValueCheck(el.el, arg);
            _done();
        } else if (rule.type === "minimum") {
            rule.isValid = this.isMinimumCheck(el.el, arg);
            _done();
        } else if (rule.type === "maximum") {
            rule.isValid = this.isMaximumCheck(el.el, arg);
            _done();
        } else if (rule.type === "fieldsMatch") {
            rule.isValid = this.doFieldsMatchCheck(el.el, arg);
            _done();
        } else if (rule.type === 'function') {
            if (!rule.arg)
                throw new 'Element {0} has a function validation rule, but no function is set.'.format(el.el.attr('id'));

            rule.arg(function (isValid) {
                if (isValid === undefined || typeof isValid !== "boolean")
                    throw new 'Element {0} has a function validation rule. The function provided must return a bool via a callback, eg : callback(true); '.format(el.el.attr('id'));
                rule.isValid = isValid;
                _done();
            });
        } else {
            throw new 'Element {0} has an unsupported validation rule {1}.'.format(el.el.attr('id'), rule.type);
        }


        function _done() {
            if (!rule.isValid && rule.onFail)
                rule.onFail();

            if (rule.isValid)
                rule.$fail.hide();
            else
                rule.$fail.show();

            if (!callback)
                throw 'Callback missing in _validateRule. Call chain is broken';

            callback();
        }
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype.doFieldsMatchCheck = function (el1, el2) {
        return el1.val() === el2.val();
    };

    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype.requiredCheck = function (el) {
        var val = el.val();
        if (!val || val.length === 0)
            return false;
        return true;
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype.minLengthCheck = function (el, arg) {
        arg = parseInt(arg);

        var val = el.val();
        if (!val || val.length < arg)
            return false;
        return true;
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype.isMinimumCheck = function (el, arg) {
        arg = parseInt(arg);

        var val = el.val();
        if (!val || val.length > 0) {
            val = parseInt(val);
            if (val < arg)
                return false;
        }
        return true;
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype.isMaximumCheck = function (el, arg) {
        arg = parseInt(arg);

        var val = el.val();
        if (!val || val.length > 0) {
            val = parseInt(val);
            if (val > arg)
                return false;
        }
        return true;
    };

    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype.isValueCheck = function (el, arg) {
        var val = el.val().toString();
        return val === arg;
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype.maxLengthCheck = function (el, arg) {
        arg = parseInt(arg);

        var val = el.val();
        if (!val || val.length > arg)
            return false;
        return true;
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype.isIntCheck = function (el) {
        var val = el.val();
        if (val.length > 0 && !vc.isInt(val))
            return false;
        return true;
    };


    // ===============================================================================
    // 
    // -------------------------------------------------------------------------------
    vc.validation.prototype.isCheckedCheck = function (el) {
        return $(el).is(':checked') == true;
    };


    // ===============================================================================
    // Returns if form is valid or not
    // -------------------------------------------------------------------------------
    vc.validation.prototype.isValid = function () {

        if (this._isValid === null) {
            this._isValid = true;

            for (var i = 0; i < this.options.elements.length; i++) {
                var el = this.options.elements[i];

                // add properties
                if (!el.isValid) {
                    this._isValid = false;
                    break;
                }

                for (var j = 0; j < el.rules.length; j++) {
                    var rule = el.rules[j];
                    if (!rule.isValid) {
                        this._isValid = false;
                        break;
                    }
                }
            }
        }

        return this._isValid;
    };


    // ===============================================================================
    // sets the visual validation status of the form
    // -------------------------------------------------------------------------------
    vc.validation.prototype._setFormValidationState = function () {

    };

});