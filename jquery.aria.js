/**
 * @file
 * This is a jQuery plugin that adds methods for manipulating WAI-ARIA
 * attributes. Unlike other plugins that do similar things, this plugin has been
 * designed to match jQuery's style making it much easier to pick up. The plugin
 * includes:
 * <br>[jQuery#aria]{@link external:jQuery#aria} for getting and setting
 * WAI-ARIA attributes.
 * <br>[jQuery#ariaRef]{@link external:jQuery#ariaRef} for getting and setting
 * references to other elements.
 * <br>[jQuery#ariaState]{@link external:jQuery#ariaState} for getting and
 * setting states.
 * <br>[jQuery#removeAria]{@link external:jQuery#removeAria},
 * [jQuery#removeAriaRef]{@link external:jQuery#removeAriaRef} and
 * [jQuery#removeAriaState]{@link external:jQuery#removeAriaState} for removing
 * WAI-ARIA attributes.
 * <br>[jQuery#ariaVisible]{@link external:jQuery#ariaVisible} and
 * [jQuery#ariaFocusable]{@link external:jQuery#ariaFocusable} for toggling
 * common features.
 * <br>[jQuery#identify]{@link external:jQuery#identify} for generating element
 * IDs as necessary.
 * <br>[jQuery#role]{@link external:jQuery#role},
 * [jQuery#addRole]{@link external:jQuery#addRole} and
 * [jQuery#removeRole]{@link external:jQuery#removeRole} handling WAI-ARIA
 * landmarks.
 * <br>[jQuery.normaliseAria]{@link external:jQuery.normaliseAria} for
 * simplifying the WAI-ARIA attributes
 * <br><br>
 * The files can be downloaded on
 * [GitHub]{@link https://github.com/skatesde/jquery-aria}.
 *
 * @author James "Skateside" Long <sk85ide@hotmail.com>
 * @version 0.2.0a
 * @license [MIT License]{@link https://github.com/skateside/jquery-aria/blob/master/LICENSE}
 */
(function ($) {

    "use strict";

    /**
     * @external jQuery
     * @see [jQuery]{@link http://jquery.com}
     */

    /**
     * A boolean or the string "mixed" (always in lower case). This type will
     * be undefined when trying to read a state that has not been set on the
     * element.
     *
     * @typedef {Boolean|String|undefined} ARIA_state
     *
     * @example
     * // Markup is
     * // <div id="one" aria-checked="true"></div>
     * // <div id="two" aria-checked="false"></div>
     * // <div id="three" aria-checked="mixed"></div>
     * // <div id="four"></div>
     *
     * $("#one").ariaState("checked");   // -> true
     * $("#two").ariaState("checked");   // -> false
     * $("#three").ariaState("checked"); // -> "mixed"
     * $("#four").ariaState("checked");  // -> undefined
     */

    /**
     * Any parameter that can be passed to
     * [jQuery's $ function]{@link http://api.jquery.com/jQuery/}. Be aware that
     * if the object (or Array or NodeList) contains multiple elements, only the
     * first will be used when getting information.
     *
     * @typedef {Array|Element|jQuery|NodeList|String} jQuery_param
     */

    /**
     * The [jQuery#aria]{@link external:jQuery#aria},
     * [jQuery#ariaRef]{@link external:jQuery#ariaRef} and
     * [jQuery#ariaState]{@link external:jQuery#ariaState} methods all take
     * functions to set their value. The functions all have the same signature,
     * described here. It is important to remember that the value this function
     * returns will be treated as if it had originally been passed to the
     * function. See
     * [jQuery#attr]{@link http://api.jquery.com/attr/#attr-attributeName-function}
     * for more information and examples.
     *
     * @callback Attribute_Callback
     * @this   HTMLElement
     *         The element being referenced.
     * @param  {Number} index
     *         The index of the current element from within the overall jQuery
     *         collection.
     * @param  {String|undefined} attr
     *         Current attribute value (undefined if the element does not
     *         currently have the attribute assigned).
     * @return {String}
     *         The value that should be passed to the function.
     *
     * @example
     * $("#one").aria("label", function (i, attr) {
     *     return "Test";
     * });
     * // is the same as
     * $("#one").aria("label", "Test");
     *
     * @example <caption>Elements without the attribute pass undefined</caption>
     * // Markup is
     * // <div id="one"></div>
     *
     * $("#one").aria("label", function (i, attr) {
     *     return Object.prototype.toString.call(attr);
     * });
     *
     * // Now markup is
     * // <div id="one" aria-label="[object Undefined]"></div>
     */

    var ATTRIBUTE_TABINDEX = "tabindex";
    var ATTRIBUTE_HIDDEN = "hidden";
    var REGEXP_BOOLEAN = /^(?:true|false)$/;
    var VALUE_MIXED = "mixed";
    var IDENTIFY_PREFIX = "anonymous";
    var count = 0;

    /**
     * A fallback for older browsers that do not understand
     * [String#startsWith]{@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith}
     * without modifiying <code>String.prototype</code> unnecessarily.
     *
     * @global
     * @private
     * @type   {Function}
     * @param  {String} text
     *         String to search for.
     * @param  {Number} [offset=0]
     *         Offset from which to start.
     * @return {Boolean}
     *         True if the string starts with <code>text</code>, false otherwise.
     *
     * @example
     * startsWith.call("abcdef", "abc"); // -> true
     */
    var startsWith = String.prototype.startsWith || function (text, offset) {
        return this.indexOf(text, offset) === 0;
    };

    /**
     * Interprets the given object as a string. If the object is
     * <code>null</code> or <code>undefined</code>, an empty string is returned.
     *
     * @global
     * @private
     * @param  {?} string
     *         Object to interpret.
     * @return {String}
     *         Interpreted string.
     *
     * @example
     * interpretString("1");       // -> "1"
     * interpretString(1);         // -> "1"
     * interpretString([1, 2]);    // -> "1,2"
     * interpretString(null);      // -> ""
     * interpretString(undefined); // -> ""
     * interpretString();          // -> ""
     */
    var interpretString = function (string) {

        return (string === null || string === undefined)
            ? ""
            : String(string);

    };

    /**
     * Normalises a WAI-ARIA attribute name so that it's always lower case and
     * always stars with <code>aria-</code>.
     * This function is aliased as
     * [jQuery.normalizeAria]{@link external:jQuery.normalizeAria}.
     *
     * @alias    external:jQuery.normaliseAria
     * @memberof external:jQuery
     * @param    {String} name
     *           Attribute name to normalise.
     * @return   {String}
     *           Normalised attribute name.
     *
     * @example
     * $.normaliseAria("label");      // -> "aria-label"
     * $.normaliseAria("LABEL");      // -> "aria-label"
     * $.normaliseAria("aria-label"); // -> "aria-label"
     * $.normaliseAria();             // -> "aria-"
     *
     * // Alias:
     * $.normalizeAria("label"); // -> "aria-label"
     */
    var normalise = function (name) {

        var lower = interpretString(name).toLowerCase();

        return startsWith.call(lower, "aria-")
            ? lower
            : "aria-" + lower;

    };

    /**
     * Returns <code>true</code> if the given <code>element</code> is an HTML
     * element.
     *
     * @global
     * @private
     * @param  {?} element
     *         Object to test.
     * @return {Boolean}
     *         true if <code>element</code> is an HTMLElement.
     *
     * @example
     * isElement(document.createElement("div")); // -> true
     * isElement(document.body); // -> true
     * isElement(document.createTextNode("")); // -> false
     * isElement($("body")); // -> false
     * isElement($("body")[0]); // -> true
     */
    var isElement = function (element) {
        return element instanceof HTMLElement;
    };

    /**
     * An identity function that simply returns whatever it is given without
     * modifying it. This can be useful for cases when a modification function
     * is needed but optional.
     *
     * @global
     * @private
     * @param  {?} x
     *         Object to return.
     * @return {?}
     *         Original object.
     *
     * @example
     * identity("a");           // -> "a"
     * identity("a", "b");      // -> "a", only first argument is returned.
     * identity.call("b", "a"); // -> "a", context has no effect.
     */
    var identity = function (x) {
        return x;
    };

    /**
     * Helper function for identifying the given <code>reference</code>. The ID
     * of the first match is returned - see
     * [jQuery#identify]{@link external:jQuery#identify} for full details.
     *
     * @global
     * @private
     * @param  {jQuery_param} reference
     *         Element to identify.
     * @return {String}
     *         ID of the element.
     */
    var identify = function (reference) {
        return $(reference).identify(0);
    };

    /**
     * Handlers for properties, references and states. Each handler has at least
     * a <code>get</code> and <code>set</code> method to write and read the
     * values. <code>has</code> methods check whether the property exists,
     * <code>unset</code> removes the property.
     *
     * {@link handlers.reference} and {@link handlers.state} defer to
     * {@link handlers.property} (they don't inherit from
     * {@link handlers.property} but they may do in another implementation - any
     * functionality they don't have will be taken from
     * {@link handlers.property}).
     *
     * @global
     * @namespace
     * @private
     */
    var handlers = {

        /**
         * Handles WAI-ARIA properties without modifying the values any more
         * that it needs to. These methods also act as the fallback for other
         * namespaces such as {@link handlers.reference} and
         * {@link handlers.state}.
         * {@link handlers.property.get} gets the value of the property.
         * {@link handlers.property.set} sets a property.
         * {@link handlers.property.has} checks to see if the property exists.
         * {@link handlers.property.unset} removes the property.
         *
         * @namespace
         * @private
         */
        property: {

            /**
             * Sets the property of an element. The <code>value</code> is
             * unchanged (other than normal string coercion) and the
             * <code>name</code> is normalised into a WAI-ARIA property (see
             * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}).
             * <br><br>
             * If <code>element</code> is not an element (see {@link isElement})
             * then no action will be taken.
             * <br><br>
             * If <code>value</code> is a function, it is treated like an
             * {@link Attribute_callback}. This is for consistency with
             * [jQuery#attr]{@link http://api.jquery.com/attr/}.
             * <br><br>
             * A <code>convert</code> function can also be passed. That function
             * will convert <code>value</code> (if <code>value</code> is a
             * function, <code>convert</code> will convert the result) before
             * assigning it. If <code>convert</code> is ommitted or not a
             * function then {@link identity} is used so <code>value</code> will
             * not be changed.
             *
             * @private
             * @param {Element}  element
             *        Element to have a property set.
             * @param {String}   name
             *        WAI-ARIA property to set.
             * @param {?}        value
             *        Value of the property.
             * @param {Number}   [index]
             *        Optional index of <code>element</code> within the jQuery
             *        object. This is needed to keep consistency with the
             *        [jQuery#attr]{@link http://api.jquery.com/attr/} function
             *        and should be derived rather than manually passed.
             * @param {Function} [convert=identity]
             *        Optional conversion process. If ommitted, no conversion
             *        occurs.
             *
             * @example <caption>Setting a property</caption>
             * // Markup is:
             * // <div id="one"></div>
             *
             * var element = document.getElementById("one");
             * handlers.property.set(element, "label", "test");
             *
             * // Now markup is:
             * // <div id="one" aria-label="test"></div>
             *
             * @example <caption>Setting a property using a function</caption>
             * // Markup is:
             * // <div id="one" aria-label="test"></div>
             *
             * var element = document.getElementById("one");
             * handlers.property.set(element, "label", function (i, attr) {
             *     return this.id + "__" + i + "__" + attr;
             * }, 0);
             *
             * // Now markup is:
             * // <div id="one" aria-label="one__0__test"></div>
             *
             * @example <caption>Converting the result</caption>
             * // Markup is:
             * // <div id="one" aria-label="test"></div>
             *
             * var element = document.getElementById("one");
             * handlers.property.set(element, "label", function (i, attr) {
             *     return this.id + "__" + i + "__" + attr;
             * }, 0, function (value) {
             *     return value.toUpperCase();
             * });
             *
             * // Now markup is:
             * // <div id="one" aria-label="ONE__0__TEST"></div>
             */
            set: function (element, name, value, index, convert) {

                var normalised = normalise(name);

                if ($.isFunction(value)) {

                    value = value.call(
                        element,
                        index,
                        element.getAttribute(normalised)
                    );

                }

                if (!$.isFunction(convert)) {
                    convert = identity;
                }

                if (isElement(element) || value === undefined) {
                    element.setAttribute(normalised, convert(value));
                }

            },

            /**
             * Checks to see if the given <code>name</code> exists on the given
             * <code>element</code>. The <code>name</code> is always normalised
             * (see [jQuery.normaliseAria]{@link external:jQuery.normaliseAria})
             * and if <code>element</code> is not an element (see
             * {@link isElement}) then <code>false</code> will always be returned.
             *
             * @private
             * @param  {Element} element
             *         Element to test.
             * @param  {String}  name
             *         WAI-ARIA property to check.
             * @return {Boolean}
             *         Whether or not the element has the given property.
             *
             * @example
             * // Markup is:
             * // <div id="one" aria-label="test"></div>
             *
             * var element = document.getElementById("one");
             * handlers.property.has(element, "label"); // -> true
             * handlers.property.has(element, "busy"); // -> false
             */
            has: function (element, name) {

                return isElement(element)
                    ? element.hasAttribute(normalise(name))
                    : false;

            },

            /**
             * Gets the value of the WAI-ARIA property from the given
             * <code>element</code> and returns it unchanged. The
             * <code>name</code> is normalised (see
             * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}). If
             * <code>element</code> is not an element (see {@link isElement}) or
             * <code>name</code> is not recognised (see
             * {@link handlers.property.has}) then <code>undefined</code> is
             * returned.
             *
             * @private
             * @param  {Element}          element
             *         Element to access.
             * @param  {String}           name
             *         WAI-ARIA property to access.
             * @return {String|undefined}
             *         WAI-ARIA attribute or undefined if the attribute isn't
             *         set.
             *
             * @example
             * // Markup is:
             * // <div id="one" aria-label="test"></div>
             *
             * var element = document.getElementById("one");
             * handlers.property.get(element, "label"); // -> "test"
             * handlers.property.get(element, "busy"); // -> undefined
             */
            get: function (element, name) {

                return handlers.property.has(element, name)
                    ? element.getAttribute(normalise(name))
                    : undefined;

            },

            /**
             * Removes a WAI-ARIA attribute from the given <code>element</code>.
             * The <code>name</code> if normalised (see
             * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}) and
             * if <code>element</code> is not an element (see {@link isElement})
             * then no action is taken.
             *
             * @private
             * @param {Element} element
             *        Element to modify.
             * @param {String}  name
             *        WAI-ARIA attribute to remove.
             *
             * @example
             * // Markup is:
             * // <div id="one" aria-label="test"></div>
             *
             * var element = document.getElementById("one");
             * handlers.property.unset(element, "label");
             *
             * // Now markup is:
             * // <div id="one"></div>
             */
            unset: function (element, name) {

                if (isElement(element)) {
                    element.removeAttribute(normalise(name));
                }

            }

        },

        /**
         * Handles modifying WAI-ARIA references. Unlike
         * {@link handlers.property}, this will create references to elements
         * and return them. The only defined methods are:
         * {@link handlers.reference.set} sets a reference.
         * {@link handlers.reference.get} gets a reference.
         *
         * @namespace
         * @private
         */
        reference: {

            /**
             * Adds the WAI-ARIA reference to <code>element</code>. This differs
             * from {@link handlers.property.set} in that <code>reference</code>
             * is passed through
             * [jQuery's $ function]{@link http://api.jquery.com/jquery/} and
             * identified (see
             * [jQuery#identify]{@link external:jQuery#identify}) with the ID of
             * the first match being used. There is also no <code>convert</code>
             * parameter.
             * <br><br>
             * The <code>name</code> is still normalised (see
             * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}). If
             * <code>element</code> is not an element (see {@link isElement})
             * then no action is taken.
             *
             * @private
             * @param {Element}      element
             *        Element to modify.
             * @param {String}       name
             *        WAI-ARIA attribute to set.
             * @param {jQuery_param} reference
             *        Element to reference.
             * @param {Number}       index
             *        Index of <code>element</code> within the collection.
             *
             * @example
             * // Markup is:
             * // <div class="one"></div>
             * // <div class="two"></div>
             *
             * var element = document.querySelector(".one");
             * handlers.reference.set(element, "labelledby", ".two");
             *
             * // Now markup is:
             * // <div class="one" aria=labelledby="anonymous0"></div>
             * // <div class="two" id="anonymous0"></div>
             */
            set: function (element, name, reference, index) {

                handlers.property.set(
                    element,
                    name,
                    reference,
                    index,
                    identify
                );

            },

            /**
             * Gets the reference from the given <code>element</code> and
             * returns it as a <code>jQuery</code> object. This differs from
             * {@link handlers.property.get} in that the match is assumed to be
             * an ID and a DOM lookup is done based upon that. The
             * <code>name</code> is still normalised (see
             * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}). If
             * the WAI-ARIA attribute is not found (see
             * {@link handlers.property.has} then <code>undefined</code> is
             * returned.
             *
             * @private
             * @param  {Element}          element
             *         Element to check.
             * @param  {String}           name
             *         WAI-ARIA reference.
             * @return {jQuery|undefined}
             *         jQuery object representing the reference or undefined if
             *         the attribute isn't set.
             *
             * @example
             * // Markup is:
             * // <div id="one" aria=labelledby="two"></div>
             * // <div id="two"></div>
             *
             * var element = document.getElementById("one");
             * handlers.reference.get(element, "labelledby");
             * // -> $(<div id="two">)
             * handlers.reference.get(element, "controls");
             * // -> undefined
             */
            get: function (element, name) {

                return handlers.property.has(element, name)
                    ? $("#" + handlers.property.get(element, name))
                    : undefined;

            }

        },

        /**
         * Handles WAI-ARIA states. This differs from {@link handlers.property}
         * in that values are coerced into booleans before being set and a
         * boolean (or the string "mixed") will be returned.
         * {@link handlers.state.read} converts the value into a boolean.
         * {@link handlers.state.set} sets the state.
         * {@link handlers.state.get} gets the state.
         *
         * @namespace
         * @private
         */
        state: {

            /**
             * Reads the raw value and converts it into a boolean or the string
             * <code>"mixed"</code> (always lower case). If <code>raw</code>
             * cannot be correctly converted, it is assumed to be
             * <code>true</code>.
             *
             * @private
             * @param  {?}              raw
             *         Value to read.
             * @return {Boolean|String}
             *         Converted value.
             *
             * @example <caption>Converting values</caption>
             * handlers.state.read(true);    // -> true
             * handlers.state.read("false"); // -> false
             * handlers.state.read("1");     // -> true
             * handlers.state.read(0);       // -> false
             * handlers.state.read("mixed"); // -> "mixed"
             *
             * @example <caption>Unrecognised values default to true</caption>
             * handlers.state.read("2");      // -> true
             * handlers.state.read(-1);       // -> true
             * handlers.state.read([]);       // -> true
             * handlers.state.read("mixed."); // -> true
             */
            read: function readState(raw) {

                var state = true;

                switch (typeof raw) {

                case "boolean":

                    state = raw;
                    break;

                case "string":

                    raw = raw.toLowerCase();

                    if (raw === VALUE_MIXED) {
                        state = raw;
                    } else if (raw === "1" || raw === "0") {
                        state = readState(+raw);
                    } else if (REGEXP_BOOLEAN.test(raw)) {
                        state = raw === "true";
                    }

                    break;

                case "number":

                    if (raw === 0 || raw === 1) {
                        state = !!raw;
                    }

                    break;

                }

                return state;

            },

            /**
             * Sets the WAI-ARIA state defined in <code>name</code> on the given
             * <code>element</code>. This differs from
             * {@link handlers.property.set} in that <code>state</code> is
             * converted into a boolean or <code>"mixed"</code> before being
             * assigned (see {@link handlers.state.read}) and there is no
             * <code>convert</code> paramter. The <code>name</code> is still
             * normalised (see
             * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}).
             *
             * @private
             * @param {Element} element
             *        Element to modify.
             * @param {String}  name
             *        WAI-ARIA attribute to set.
             * @param {?}       state
             *        State to set.
             * @param {Number}  index
             *        Index of <code>element</code> within the collection.
             *
             * @example
             * // Markup is:
             * // <div id="one"></div>
             * // <div id="two"></div>
             *
             * var one = document.getElementById("one");
             * var two = document.getElementById("two");
             * handlers.state.set(one, "busy", true);
             * handlers.state.set(two, "checked", "mixed");
             *
             * // Now markup is:
             * // <div id="one" aria-busy="true"></div>
             * // <div id="two" aria-checked="mixed"></div>
             */
            set: function (element, name, state, index) {

                handlers.property.set(
                    element,
                    name,
                    state,
                    index,
                    handlers.state.read
                );

            },

            /**
             * Reads the WAI-ARIA state on <code>element</code>. This differs
             * from {@link handlers.property.get} in that the result is
             * converted into a boolean or the strign `"mixed"` before being
             * returned. The <code>name</code> is still normalised (see
             * {@link jQuery.normaliseAria}).
             *
             * @private
             * @param  {Element}    element
             *         Element to access.
             * @param  {String}     name
             *         WAI-ARIA state to read.
             * @return {ARIA_state}
             *         State of the WAI-ARIA property.
             *
             * @example
             * // Markup is:
             * // <div id="one" aria-busy="true" aria-checked="mixed"></div>
             *
             * var element = document.getElementById("one");
             * handlers.state.get(element, "busy");     // -> true
             * handlers.state.get(element, "checked");  // -> "mixed"
             * handlers.state.get(element, "disabled"); // -> undefined
             */
            get: function (element, name) {

                var state;
                var value;

                if (handlers.property.has(element, name)) {

                    value = handlers.property.get(element, name).toLowerCase();
                    state = value === VALUE_MIXED
                        ? value
                        : (REGEXP_BOOLEAN.test(value) && value === "true");

                }

                return state;

            }

        }

    };

    /**
     * This function handles all the heavy lifting of getting or setting
     * WAI-ARIA attributes. It is designed to be all that's necessary for
     * [jQuery#aria]{@link external:jQuery#aria},
     * [jQuery#ariaRef]{@link external:jQuery#ariaRef} and
     * [jQuery#ariaState]{@link external:jQuery#ariaState}. This function will
     * check its arguments to determine whether it should be used as a getter or
     * a setter and passes the appropriate arguments to the {@link handlers}
     * methods based on <code>type</code> (which will default to
     * {@link handlers.property} if ommitted or not recognised).
     * <br><br>
     * The return value is based on the type of action being performed. If this
     * function is setting then a jQuery object of the matches is returned
     * (which is almost always <code>jQelements</code>); if the function is a
     * getter then the results are returned for the first element in
     * <code>jQelements</code>.
     * <br><br>
     * Although this description is not especially extensive and does not offer
     * and examples, the code is very easy to follow and commented should there
     * be any need to modify it. Once the correct arguments are being passed to
     * the appropriate {@link handlers} method, they will take care of the rest.
     *
     * @global
     * @private
     * @param  {jQuery}            jQelements
     *         jQuery object to modify/access.
     * @param  {Object|String}     property
     *         Either WAI-ARIA names and values or the WAI-ARIA property name.
     * @param  {?}                 [value]
     *         Value to set.
     * @param  {String}            [type="property"]
     *         Optional attribute type.
     * @return {jQuery|ARIA_state}
     *         Either the jQuery object on which WAI-ARIA properties were set or
     *         the values of the WAI-ARIA properties.
     *
     * @example <caption>Setting a single property</caption>
     * // Markup is
     * // <div id="one"></div>
     *
     * var jQone = $("#one");
     * access(jQone, "controls", "two"); // -> jQuery(<div id="one">)
     *
     * // Now markup is
     * // <div id="one" aria-controls="two">
     *
     * @example <caption>Setting multiple references</caption>
     * // Markup is
     * // <div id="one"></div>
     * // <div id="two"></div>
     *
     * var jQone = $("#one");
     * access(jQone, {
     *     controls: $("div").eq(1)
     * }, "reference"); // -> jQuery(<div id="one">)
     *
     * // Now markup is
     * // <div id="one" aria-controls="two">
     * // <div id="two"></div>
     *
     * @example <caption>Getting a state</caption>
     * // Markup is
     * // <div id="one" aria-busy="true"></div>
     *
     * var jQone = $("#one");
     * access(jQone, "busy", undefined, "state"); // -> true
     */
    function access(jQelements, property, value, type) {

        var tempProperty = property;
        var isPropertyObject = $.isPlainObject(property);
        var isGet = value === undefined && !isPropertyObject;

        // Make sure the property value is in the expected format: an object for
        // setting and a string for getting.
        if (!isGet && !isPropertyObject) {

            property = {};
            property[tempProperty] = value;

        } else if (isGet && isPropertyObject) {
            property = Object.keys(property)[0];
        }

        // If we don't have or don't recognise the type, default to "property".
        if (!type || !handlers[type]) {
            type = "property";
        }

        return isGet
            ? handlers[type].get(jQelements[0], property)
            : jQelements.each(function (index, element) {

                $.each(property, function (key, val) {
                    handlers[type].set(element, key, val, index);
                });

            })

    }

    /**
     * Removes the named WAI-ARIA attribute from all elements in the current
     * collection. The <code>name</code> is normalised (see
     * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}). This
     * function is aliased as
     * [jQuery#removeAriaRef]{@link external:jQuery#removeAriaRef} and
     * [jQuery#removeAriaState]{@link external:jQuery#removeAriaState}.
     *
     * @alias removeAria
     * @memberof external:jQuery
     * @instance
     * @param  {String} name
     *         WAI-ARIA attribute to remove.
     * @return {jQuery}
     *         jQuery attribute representing the elements modified.
     *
     * @example
     * // Markup is
     * // <div id="one" aria-busy="true"></div>
     *
     * $("#one").removeAria("busy"); // -> jQuery(<div id="one">)
     *
     * // Now markup is:
     * // <div id="one"></div>
     */
    function removeAttribute(name) {

        return this.each(function (ignore, element) {
            handlers.property.unset(element, name);
        });

    }

    /**
     * Alias of [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}
     *
     * @alias external:jQuery.normalizeAria
     * @memberof external:jQuery
     * @type {Function}
     */
    $.normalizeAria = normalise;
    $.normaliseAria = normalise;

    $.fn.extend(/** @lends external:jQuery.prototype */{

        /**
         * Identifies all elements in the collection by getting all their IDs.
         * If the elements don't have an ID attribute, a unique one is
         * generated. The <code>jQuery</code> object is returned to allow
         * chaining.
         * <br><br>
         * IDs are a concatenation of "anonymous" and a hidden counter that is
         * increased each time. If the ID already exists on the page, that ID is
         * skipped and not assigned to a second element.
         * <br><br>
         * If a numeric <code>index</code> is passed, the ID of the element at
         * that index is returned as a string. If there is no element at that
         * <code>index</code>, <code>undefined</code> is returned. Any
         * <code>index</code> that is not numeric (see
         * [jQuery.isNumeric]{@link https://api.jquery.com/jQuery.isNumeric/})
         * is ignored and treated as if no <code>index</code> were given.
         *
         * @param  {Number|String} [index]
         *         Index of the matching element whose ID should be returned.
         * @return {jQuery|String|undefined}
         *         jQuery object of the identified elements or the ID of the
         *         requested element.
         *
         * @example <caption>Identifying elements</caption>
         * // Markup is
         * // <div class="one"></div>
         * // <span class="one"></span>
         *
         * $(".one").identify(); // -> jQuery(<div>, <span>)
         *
         * // Now markup is:
         * // <div class="one" id="anonymous0"></div>
         * // <span class="one" id="anonymous1"></span>
         * // Running $(".one").identify(); a second time would not change the
         * // markup again.
         *
         * @example <caption>Existing IDs are not duplicated</caption>
         * // Markup is:
         * // <div class="two" id="anonymous1"><!-- manually set --></div>
         * // <div class="two"></div>
         * // <div class="two"></div>
         *
         * $(".two").identify();
         *
         * // Now markup is:
         * // <div class="two" id="anonymous1"><!-- manually set --></div>
         * // <div class="two" id="anonymous0"></div>
         * // <div class="two" id="anonymous2"></div>
         *
         * @example <caption>Returning the ID</caption>
         * // Markup is:
         * // <div class="three" id="first"></div>
         * // <span class="three" id="second"></span>
         *
         * $(".three").identify(0); // -> "first"
         * $(".three").identify(1); // -> "second"
         * $(".three").identify(2); // -> undefined
         * // Numeric strings also work:
         * $(".three").identify("0"); // -> "first"
         */
        identify: function (index) {

            var identified = [];
            var results = this.each(function (i, element) {

                var id = element.id;

                if (!id) {

                    do {

                        id = IDENTIFY_PREFIX + count;
                        count += 1;

                    // NOTE: document.getElementById(id) is faster, but jQuery's
                    // $ function can handle things like frames which could
                    // affect the results.
                    } while ($("#" + id).length);

                    element.id = id;

                }

                identified.push(id);

                return id;

            });

            return $.isNumeric(index)
                ? identified[index]
                : results;

        },

        /**
         * Gets or sets WAI-ARIA properties. The properties will not be modified
         * any more than they need to be (unlike
         * [jQuery#ariaRef]{@link external:jQuery#ariaRef}
         * or [jQuery#ariaState]{@link external:jQuery#ariaState} which will
         * interpret the values).
         * <br><br>
         * To set WAI-ARIA properties, pass either a
         * <code>property</code>/<code>value</code> pair of arguments or an
         * object containing those pairs. When this is done, the attributes are
         * set on all elements in the collection and the <code>jQuery</code>
         * object is returned to allow for chaining. If <code>value</code> is a
         * function and returns <code>undefined</code> (or nothing) then no
         * action is taken for that element. This can be useful for selectively
         * setting values only when certain criteria are met.
         * <br><br>
         * To get WAI-ARIA properties, only pass the <code>property</code> that
         * you want to get. If there is no matching property,
         * <code>undefined</code> is returned. All properties are normalised
         * (see [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}).
         *
         * @param  {Object|String} property
         *         Either the properties to set in key/value pairs or the name
         *         of the property to get/set.
         * @param  {Attribute_Callback|Boolean|Number|String} [value]
         *         The value of the property to set.
         * @return {jQuery|String|undefined}
         *         Either the jQuery object (after setting) or a string or
         *         undefined (after getting)
         *
         * @example <caption>Setting WAI-ARIA attribute(s)</caption>
         * $("#element").aria("aria-label", "test");
         * // or
         * $("#element").aria("label", "test");
         * // or
         * $("#element").aria({
         *     "aria-label": "test"
         * });
         * // or
         * $("#element").aria({
         *     label: "test"
         * });
         * // All of these set aria-label="test" on all matching elements and
         * // return a jQuery object representing "#element"
         *
         * @example <caption>Setting WAI-ARIA attribute(s) with a function</caption>
         * $("#element").aria("label", function (i, attr) {
         *     return this.id + "__" + i + "__" + attr;
         * });
         * // or
         * $("#element").aria({
         *     label: function (i, attr) {
         *         return this.id + "__" + i + "__" + attr;
         *     }
         * });
         * // Both of these set aria-label="element__0__undefined" on all
         * // matching elements and return a jQuery object representing
         * // "#element"
         *
         * @example <caption>Getting a WAI-ARIA attribute</caption>
         * // Markup is:
         * // <div id="element" aria-label="test"></div>
         * $("#element").aria("label");   // -> "test"
         * $("#element").aria("checked"); // -> undefined
         * // If "#element" matches multiple elements, the attributes from the
         * // first element are returned.
         */
        aria: function (property, value) {

            return access(
                this,
                property,
                value
            );

        },

        /**
         * Gets or sets a WAI-ARIA reference. This is functionally identical to
         * [jQuery#aria]{@link external:jQuery#aria} with the main difference
         * being that an element may be passed as the <code>value</code> when
         * setting and that a jQuery object is returned when getting.
         * <br><br>
         * Because WAI-ARIA references work with IDs, IDs are worked out using
         * [jQuery#identify]{@link external:jQuery#identify}. Be aware that any
         * string passed to [jQuery#ariaRef]{@link external:jQuery#ariaRef} will
         * be treated like a CSS selector and looked up with the results being
         * used to set the property. If you already have the ID and wish to set
         * it without the lookup, use [jQuery#aria]{@link external:jQuery#aria}.
         * <br><br>
         * If <code>value</code> is a function then the resulting value is
         * identified. This can be particularly useful for performing DOM
         * traversal to find the reference (see examples below).
         * As with [jQuery#aria]{@link external:jQuery#aria}, if the
         * <code>value</code> function returns nothing or returns
         * <code>undefined</code> then no action is taken.
         * <br><br>
         * When accessing the attribute using this function, a
         * <code>jQuery</code> object representing the reference is returned. If
         * there are multiple elements in the collection, only the reference for
         * the first element is returned. To get the value of the attribute
         * rather than the element, use
         * [jQuery#aria]{@link external:jQuery#aria}.
         *
         * @param  {Object|String} property
         *         Either the properties to set in key/value pairs or the name
         *         of the property to set.
         * @param  {Attribute_Callback|jQuery|jQuery_param} [value]
         *         Reference to set.
         * @return {jQuery}
         *         jQuery object representing either the elements that were
         *         modified (when setting) or the referenced element(s) (when
         *         getting - may be an empty jQuery object).
         *
         * @example <caption>Setting references</caption>
         * // Markup is:
         * // <h1>Heading</h1>
         * // <div class="one">
         * //     Lorem ipsum dolor sit amet ...
         * // </div>
         *
         * $(".one").ariaRef("labelledby", $("h1"));
         * // or
         * $(".one").ariaRef("labelledby", "h1");
         * // or
         * $(".one").ariaRef("labelledby", $("h1")[0]);
         * // or
         * $(".one").ariaRef({
         *     labelledby: $("h1") // or "h1" or $("h1")[0]
         * });
         * // Each of these return a jQuery object representing ".one"
         *
         * // Now markup is:
         * // <h1 id="anonymous0">Heading</h1>
         * // <div class="one" aria-labelledby="anonymous0">
         * //     Lorem ipsum dolor sit amet ...
         * // </div>
         *
         * @example <caption>Setting references with a function</caption>
         * // Markup is:
         * // <div class="js-collapse">
         * //     <div class="js-collapse-content">
         * //         Lorem ipsum dolor sit amet ...
         * //     </div>
         * //     <button class="js-collapse-toggle">
         * //         Toggle
         * //     </button>
         * // </div>
         *
         * $(".js-collapse-toggle").ariaRef("controls", function (i, attr) {
         *
         *     return $(this)
         *         .closest(".js-collapse")
         *         .find(".js-collapse-content");
         *
         * });
         *
         * // Now markup is:
         * // <div class="js-collapse">
         * //     <div class="js-collapse-content" id="anonymous0">
         * //         Lorem ipsum dolor sit amet ...
         * //     </div>
         * //     <button class="js-collapse-toggle" aria-controls="anonymous0">
         * //         Toggle
         * //     </button>
         * // </div>
         *
         * @example <caption>Getting a reference</caption>
         * // Markup is:
         * // <h1 id="anonymous0">Heading</h1>
         * // <div class="one" aria-labelledby="anonymous0">
         * //     Lorem ipsum dolor sit amet ...
         * // </div>
         *
         * $(".one").ariaRef("labelledby"); // -> $(<h1>)
         * $(".one").ariaRef("controls");   // -> $()
         *
         * @example <caption>Value is treated like a CSS selector</caption>
         * // Markup is:
         * // <button id="button"></button>
         * // <div id="section"></div>
         * // <section></section>
         *
         * $("#button").ariaRef("controls", "section");
         *
         * // Now markup is:
         * // <button id="button" aria-controls="anonymous0"></button>
         * // <div id="section"></div>
         * // <section id="anonymous0"></section>
         */
        ariaRef: function (property, value) {

            return access(
                this,
                property,
                value,
                "reference"
            );

        },

        /**
         * Sets or gets the WAI-ARIA state of the collection.
         * When setting the state, false, "false" (any case), 0 and "0" will be
         * considered false. All other values will be considered true except for
         * "mixed" (any case) which will set the state to "mixed". The differs
         * from [jQuery#aria]{@link external:jQuery#aria} which will simply set
         * the attribute(s) without converting the value.
         * <br><br>
         * After setting the state(s), a jQuery object representing the affected
         * elements is returned. The state for the first matching element is
         * returned when getting.
         * <br><br>
         * All attributes are normalised - see
         * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria} for full
         * details.
         *
         * @param  {Object|String} property
         *         Either a key/value combination properties to set or the name
         *         of the WAI-ARIA state to set.
         * @param  {Attribute_Callback|Boolean|Number|String} [value]
         *         Value of the attribute.
         * @return {ARIA_state|jQuery}
         *         Either the jQuery object representing the modified elements
         *         (setting) or the state of the first matching element.
         *
         * @example <caption>Getting state</caption>
         * // Markup is:
         * // <div id="one" aria-busy="true" aria-checked="mixed"></div>
         *
         * $("#one").ariaState("busy");    // -> true
         * $("#one").ariaState("checked"); // -> "mixed"
         * $("#one").ariaState("hidden");  // -> undefined
         *
         * @example <caption>Setting state</caption>
         * // Each of these will set the state to false:
         * $("#one").ariaState("busy", "false");
         * $("#one").ariaState("busy", "FALSE");
         * $("#one").ariaState("busy", false);
         * $("#one").ariaState("busy", 0);
         * $("#one").ariaState("busy", "0");
         *
         * // Each of these will set the state to "mixed":
         * $("#one").ariaState("checked", "mixed");
         * $("#one").ariaState("checked", "MIXED");
         *
         * // Each of these will set the state to true
         * $("#one").ariaState("busy", "true");
         * $("#one").ariaState("busy", "TRUE");
         * $("#one").ariaState("busy", true);
         * $("#one").ariaState("busy", 1);
         * $("#one").ariaState("busy", "1");
         * // WARNING: these also set the state to true
         * $("#one").ariaState("busy", {});
         * $("#one").ariaState("busy", null);
         * $("#one").ariaState("busy", "nothing");
         * $("#one").ariaState("busy", "");
         * $("#one").ariaState("busy", -1);
         *
         * // Each example returns a jQuery object representing "#one" and an
         * // object can be passed as parameters as well:
         * $("#one").ariaState({
         *     busy: true
         * });
         *
         * @example <caption>Setting state with a function</caption>
         * // Markup is:
         * // <div class="checkbox"></div>
         * // <input type="checkbox" checked>
         *
         * $(".checkbox").ariaState("checked", function (i, attr) {
         *
         *     return $(this)
         *         .next("input[type=\"checkbox\"]")
         *         .prop("checked");
         *
         * });
         *
         * // Now markup is:
         * // <div class="checkbox" aria-checked="true"></div>
         * // <input type="checkbox" checked>
         */
        ariaState: function (property, value) {

            return access(
                this,
                property,
                value,
                "state"
            );

        },

        /**
         * Sets the role of all elements in the collection or gets the role of
         * the first element in the collection, depending on whether or not the
         * <code>role</code> argument is provided.
         * As [jQuery#role]{@link external:jQuery#role} is just a wrapper for
         * [jQuery#attr]{@link http://api.jquery.com/attr/}, the
         * <code>role</code> parameter can actually be any value type that the
         * official documentation mentions.
         * <br><br>
         * According to the WAI-ARIA specs, an element can have mutliple roles
         * as a space-separated list. This method will only set the role
         * attribute to the given string when setting. If you want to modify the
         * roles, use [jQuery#addRole]{@link external:jQuery#addRole} and
         * [jQuery#removeRole]{@link external:jQuery#removeRole}.
         *
         * @param  {Attribute_Callback|String} [role]
         *         Role to get or function to set the role.
         * @return {jQuery|String|undefined}
         *         Either the jQuery object representing the elements that were
         *         modified or the role value.
         *
         * @example
         * // Markup is:
         * // <div id="one"></div>
         * // <div id="two"></div>
         *
         * $("#one").role("presentation"); // -> jQuery(<div id="one">)
         *
         * // Now markup is:
         * // <div id="one" role="presentation"></div>
         * // <div id="two"></div>
         *
         * $("#one").role(); // -> "presentation"
         * $("#two").role(); // -> undefined
         *
         * @example <caption>Setting a role with a function</caption>
         * // Markup is:
         * // <div id="one" role="button"></div>
         *
         * $("#one").role(function (index, current) {
         *     return current + " tooltip";
         * });
         *
         * // Now markup is:
         * // <div id="one" role="button tooltip"></div>
         */
        role: function (role) {

            return role === undefined
                ? this.attr("role")
                : this.attr("role", role);

        },

        /**
         * Adds a role to a collection of elements. The role will not be added
         * if it's empty ("" or undefined), if the function response is empty or
         * if the element already has that role. In that way it's similar to
         * [jQuery#addClass]{@link https://api.jquery.com/addClass/}.
         *
         * @param  {Attribute_Callback|String} role
         *         Role(s) to add to the matching elements or function to
         *         generate the role(s) to add.
         * @return {jQuery}
         *         jQuery object representing the matching elements.
         *
         * @example <caption>Adding a role</caption>
         * // Markup is:
         * // <div class="one" role="presentation"></div>
         * // <div class="one"></div>
         *
         * $(".one").addRole("alert"); // -> jQuery(<div>, <div>)
         *
         * // Now markup is:
         * // <div class="one" role="presentation alert"></div>
         * // <div class="one" role="alert"></div>
         *
         * @example <caption>Adding a role with a function</caption>
         * // Markup is:
         * // <div class="one" role="presentation"></div>
         *
         * $(".one").addRole(function (index, current) {
         *     return "alert combobox";
         * });
         *
         * // Now markup is:
         * // <div class="one" role="presentation alert combobox"></div>
         */
        addRole: function (role) {

            var isFunction = $.isFunction(role);

            return this.role(function (index, current) {

                var value = isFunction
                    ? role.call(this, index, current)
                    : role;
                var roles = interpretString(current).split(/\s+/);

                interpretString(value).split(/\s+/).forEach(function (val) {

                    if (
                        val !== ""
                        && val !== undefined
                        && roles.indexOf(val) < 0
                    ) {
                        roles.push(val);
                    }

                });

                return roles.join(" ");

            });

        },

        /**
         * Removes roles from the collection of elements. If the method is
         * called without any arguments then the role attribute itself is
         * removed. Be aware that this is not the same as passing a function
         * which returns undefined - such an action will have no effect.
         *
         * @param  {Attribute_Callback|String} [role]
         *         Role(s) to remove or a function to generate the role(s) to
         *         remove.
         * @return {jQuery}
         *         jQuery object representing the matched elements.
         *
         * @example <caption>Removing a role</caption>
         * // Markup is:
         * // <div class="one" role="presentation alert"></div>
         * // <div class="one" role="alert"></div>
         *
         * $(".one").removeRole("alert"); // -> jQuery(<div>, <div>)
         *
         * // Now markup is:
         * // <div class="one" role="presentation"></div>
         * // <div class="one" role=""></div>
         *
         * @example <caption>Completely removing a role</caption>
         * // Markup is:
         * // <div class="one" role="presentation alert"></div>
         * // <div class="one" role="alert"></div>
         *
         * $(".one").removeRole(); // -> jQuery(<div>, <div>)
         *
         * // Now markup is:
         * // <div class="one"></div>
         * // <div class="one"></div>
         *
         * @example <caption>Removing a role with a function</caption>
         * // Markup is:
         * // <div class="one" role="presentation alert combobox"></div>
         *
         * $(".one").removeRole(function (index, current) {
         *     return current
         *         .split(/\s+/)
         *         .filter(function (role) {
         *             return role.indexOf("a") > -1;
         *         })
         *         .join(" ");
         *     // "presentation alert"
         * });
         *
         * // Now markup is:
         * // <div class="one" role="combobox"></div>
         */
        removeRole: function (role) {

            var isFunction = $.isFunction(role);

            return role === undefined
                ? this.removeAttr("role")
                : this.role(function (index, current) {

                    var value = isFunction
                        ? role.call(this, index, current)
                        : role;
                    var values = interpretString(value).split(/\s+/);

                    return interpretString(current)
                        .split(/\s+/)
                        .filter(function (aRole) {
                            return values.indexOf(aRole) < 0;
                        })
                        .join(" ");

                });

        },

        removeAria: removeAttribute,

        /**
         * Alias of [jQuery#removeAria]{@link external:jQuery#removeAria}.
         *
         * @type {Function}
         */
        removeAriaRef: removeAttribute,

        /**
         * Alias of [jQuery#removeAria]{@link external:jQuery#removeAria}.
         *
         * @type {Function}
         */
        removeAriaState: removeAttribute,

        /**
         * Sets the visibility of the matching elements on a WAI-ARIA level.
         * Strings, numbers and booleans are understood as <code>state</code> -
         * see [jQuery#ariaState]{@link external:jQuery#ariaState} for full
         * details as the algorythm is the same.
         * <br><br>
         * Note that according to the WAI-ARIA specs, declaring an element to be
         * visible should be done by removing the <code>aria-hidden</code>
         * attribute rather than setting the value to <code>false</code>.
         * <br><br>
         * Be aware that this function will only modify the
         * <code>aria-hidden</code> of the matching elements. It's possible that
         * after running this function, the element cannot be seen visually or
         * is still hidden to WAI-ARIA devices.
         *
         * @param  {Attribute_Callback|Boolean|Number|String} state
         *         State to set.
         * @return {jQuery}
         *         jQuery object representing the affected element(s).
         *
         * @example <caption>Setting WAI-ARIA visibility</caption>
         * // Markup is
         * // <div id="one" aria-hidden="true"></div>
         * // <div id="two"></div>
         *
         * $("#one").ariaVisible(false); // -> jQuery(<div id="one">)
         * $("#two").ariaVisible(true);  // -> jQuery(<div id="two">)
         *
         * // Now markup is
         * // <div id="one"></div>
         * // <div id="two" aria-hidden="true"></div>
         *
         * @example <caption>Limitations of the function</caption>
         * // Markup is
         * // <div id="one" aria-hidden="true">
         * //     <div id="two" aria-hidden="true" style="display:none"></div>
         * // </div>
         *
         * $("#two").ariaVisible(true); // -> jQuery(<div id="two">)
         *
         * // Now markup is
         * // <div id="one" aria-hidden="true">
         * //     <div id="two" style="display:none"></div>
         * // </div>
         */
        ariaVisible: function (state) {

            var theState = handlers.state.read(state);

            return theState
                ? access(this, ATTRIBUTE_HIDDEN, theState)
                : this.removeAttr(ATTRIBUTE_HIDDEN);

        },

        /**
         * Sets whether or not the matching elements are focusable. Strings,
         * numbers and booleans are understood as <code>state</code> - see
         * [jQuery#ariaState]{@link external:jQuery#ariaState} for full details
         * as the algorythm is the same.
         * <br><br>
         * Be aware this this function will only modify the matching elements,
         * it will not check any parents or modify any other elements that could
         * affect the focusability of the element.
         *
         * @param  {Attribute_Callback|Boolean|Number|String} state
         *         State to set.
         * @return {jQuery}
         *         jQuery object representing the affected element(s).
         *
         * @example <caption>Setting focusability</caption>
         * // Markup is
         * // <div id="one"></div>
         * // <div id="two"></div>
         *
         * $("#one").ariaFocusable(false); // -> jQuery(<div id="one">)
         * $("#two").ariaFocusable(true);  // -> jQuery(<div id="two">)
         *
         * // Now markup is
         * // <div id="one" tabindex="0"></div>
         * // <div id="two" tabindex="-1"></div>
         *
         * @example <caption>Limitations of the function</caption>
         * // Markup is
         * // <div id="one" tabindex="-1">
         * //     <div id="two" disabled></div>
         * // </div>
         *
         * $("#two").ariaFocusable(true); // -> jQuery(<div id="two">)
         *
         * // Now markup is
         * // <div id="one" tabindex="-1">
         * //     <div id="two" disabled tabindex="0"></div>
         * // </div>
         */
        ariaFocusable: function (state) {

            return access(
                this,
                ATTRIBUTE_TABINDEX,
                handlers.state.read(state)
                    ? 0
                    : -1
            );

        }

    });

}(jQuery));
