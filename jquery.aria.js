(function ($) {

    "use strict";

    var ATTRIBUTE_TABINDEX = "tabindex";
    var ATTRIBUTE_HIDDEN = "hidden";
    var REGEXP_BOOLEAN = /^(?:true|false)$/;
    var VALUE_MIXED = "mixed";
    var IDENTIFY_PREFIX = "anonymous";
    var count = 0;

    /** internal
     *  startsWith(text[, offset]) -> Boolean
     *  - text (String): String to search for.
     *  - offset (Number): Offset from which to start.
     *
     *  A fallback for older browsers that do not understand
     *  `String#startsWith` without modifiying `String.prototype` unnecessarily.
     *  Usage:
     *
     *      startsWith.call("abcdef", "abc"); // -> true
     *
     **/
    var startsWith = String.prototype.startsWith || function (text, offset) {
        return this.indexOf(text, offset) === 0;
    };

    /** internal
     *  interpretString(string) -> String
     *  - string (?): String to interpret
     *
     *  Interprets the given object as a string. If the object is `null` or
     *  `undefined`, an empty string is returned.
     *
     *      interpretString("1"); // -> "1"
     *      interpretString(1); // -> "1"
     *      interpretString([1, 2]); // -> "1,2"
     *      interpretString(null); // -> ""
     *      interpretString(undefined); // -> ""
     *      interpretString(); // -> ""
     *
     **/
    var interpretString = function (string) {

        return (string === null || string === undefined)
            ? ""
            : String(string);

    };

    /**
     *  jQuery.normaliseAria(name) -> String
     *  - name (String): Attribute name to normalise.
     *
     *  Normalises a WAI-ARIA attribute name so that it's always lower case and
     *  always stars with `aria-`.
     *
     *      $.normaliseAria("label"); // -> "aria-label"
     *      $.normaliseAria("LABEL"); // -> "aria-label"
     *      $.normaliseAria("aria-label"); // -> "aria-label"
     *      $.normaliseAria(); // -> "aria-"
     *
     **/
    var normalise = function (name) {

        var lower = interpretString(name).toLowerCase();

        return startsWith.call(lower, "aria-")
            ? lower
            : "aria-" + lower;

    };

    /** internal
     *  isElement(element) -> Boolean
     *  - element (?): Object to test.
     *
     *  Returns `true` if the given `element` is an HTML element.
     *
     *      isElement(document.createElement("div")); // -> true
     *      isElement(document.body); // -> true
     *      isElement(document.createTextNode("")); // -> false
     *      isElement($("body")); // -> false
     *      isElement($("body")[0]); // -> true
     *
     **/
    var isElement = function (element) {
        return element instanceof HTMLElement;
    };

    /** internal
     *  identity(x) -> ?
     *  - x (?): Object.
     *
     *  An identity function that simply returns whatever it is given without
     *  modifying it. This can be useful for cases when a modification function
     *  is needed but optional.
     *
     *      identity("a"); // -> "a"
     *      identity("a", "b"); // -> "a", only first argument is returned.
     *      identity.call("b", "a"); // -> "a", context has no effect.
     *
     **/
    var identity = function (x) {
        return x;
    };

    /** internal
     *  identify(reference) -> String
     *  - reference (Element|String|jQuery): Element to identify.
     *
     *  Helper function for identifying the given `reference`. The ID of the
     *  first match is returned - see [[jQuery#identify]] for full details.
     **/
    var identify = function (reference) {
        return $(reference).identify(0);
    };

    /** internal
     *  handlers
     *
     *  Handlers for properties, references and states. Each handler has at
     *  least a `get` and `set` method to write and read the values. `has`
     *  methods check whether the property exists, `unset` removes the property.
     *
     *  [[handlers.reference]] and [[handlers.state]] defer to
     *  [[handlers.property]] (they don't inherit from [[handlers.property]] but
     *  they may do in another implementation - any functionality they don't
     *  have will be taken from [[handlers.property]]).
     **/
    var handlers = {

        /** internal
         *  handlers.property
         *
         *  Handles WAI-ARIA properties.
         *
         *  - [[handlers.property.get]] gets the value of the property.
         *  - [[handlers.property.set]] sets a property.
         *  - [[handlers.property.has]] checks to see if the property exists.
         *  - [[handlers.property.unset]] removes the property.
         **/
        property: {

            /** internal
             *  handlers.property.set(element, name, value[, index[, convert]])
             *  - element (Element): Element to have a property set.
             *  - name (String): WAI-ARIA property to set.
             *  - value (?): Value of the property.
             *  - index (Number): Optional index of `element` within the jQuery
             *    object.
             *  - convert (Function): Optional conversion process.
             *
             *  Sets the property of an element. The `value` is unchanged (other
             *  than normal string coercion) and the `name` is normalised into
             *  a WAI-ARIA property (see [[jQuery.normaliseAria]]).
             *
             *  To understand that, consider this element:
             *
             *      <div id="one"></div>
             *
             *  If this script were run:
             *
             *      var element = document.getElementById("one");
             *      handlers.property.set(element, "label", "test");
             *
             *  ... then the markup would be changed to this:
             *
             *      <div id="one" aria-label="test"></div>
             *
             *  If `element` is not an element (see [[isElement]]) then no
             *  action will be taken.
             *
             *  If `value` is a function, that function is executed with the
             *  `element` as the context and is passed the `index` parameter and
             *  the normalised `name`. The function should return the value that
             *  should be set.
             *
             *  Consider this functionality:
             *
             *      handlers.property.set(element, "label", function (i, attr) {
             *          return this.id + "-" + i + "-" + attr;
             *      }, 0);
             *
             *  ... the markup would be changed to this:
             *
             *      <div id="one" aria-label="one-0-aria-label"></div>
             *
             *  _Note: The `index` argument isn't designed to be manually passed
             *  like the example above, but is designed to keep consistency with
             *  the `jQuery#attr` function._
             *
             *  If the `value` function returns `undefined` then no action is
             *  taken. Again, this is for consistency with `jQuery#attr`.
             *
             *  A `convert` function can also be passed. That function will
             *  convert `value` (if `value` is a function, `convert` will
             *  convert the result) before assigning it.
             *
             *  Consider this functionality:
             *
             *      handlers.property.set(element, "label", function (i, attr) {
             *          return this.id + "-" + attr;
             *      }, 0, function (value) {
             *          return value.toUpperCase();
             *      });
             *
             *  ... the markup would be changed to this:
             *
             *      <div id="one" aria-label="ONE-0-ARIA-LABEL"></div>
             *
             *  If `convert` is ommitted or not a function then [[identity]] is
             *  used so `value` will not be changed.
             **/
            set: function (element, name, value, index, convert) {

                var normalised = normalise(name);

                if ($.isFunction(value)) {
                    value = value.call(element, index, normalised);
                }

                if (!$.isFunction(convert)) {
                    convert = identity;
                }

                if (isElement(element) || value === undefined) {
                    element.setAttribute(normalised, convert(value));
                }

            },

            /** internal
             *  handlers.property.has(element, name) -> Boolean
             *  - element (Element): Element to test.
             *  - name (String): WAI-ARIA property to check.
             *
             *  Checks to see if the given `name` exists on the given `element`.
             *  Consider this element:
             *
             *      <div id="one" aria-label="test"></div>
             *
             *  This method would have the following results.
             *
             *      var element = document.getElementById("one");
             *      handlers.property.has(element, "label"); // -> true
             *      handlers.property.has(element, "busy"); // -> false
             *
             *  The `name` is always normalised (see [[jQuery.normaliseAria]])
             *  and if `element` is not an element (see [[isElement]]) then
             *  `false` will always be returned.
             **/
            has: function (element, name) {

                return isElement(element)
                    ? element.hasAttribute(normalise(name))
                    : false;

            },

            /** internal
             *  handlers.property.get(element, name) -> String|undefined
             *  - element (Element): Element to access.
             *  - name (String): WAI-ARIA property to access.
             *
             *  Gets the value of the WAI-ARIA property from the given `element`
             *  and returns it unchanged. The `name` is normalised (see
             *  [[jQuery.normaliseAria]]). If `element` is not an element (see
             *  [[isElement]]) or `name` is not recognised (see
             *  [[handlers.property.has]]) then `undefined` is returned.
             *
             *  To better understand this method, consider this markup:
             *
             *      <div id="one" aria-label="test"></div>
             *
             *  This method would return the following results:
             *
             *      var element = document.getElementById("one");
             *      handlers.property.get(element, "label"); // -> "test"
             *      handlers.property.get(element, "busy"); // -> undefined
             *
             **/
            get: function (element, name) {

                return handlers.property.has(element, name)
                    ? element.getAttribute(normalise(name))
                    : undefined;

            },

            /** internal
             *  handlers.property.unset(element, name)
             *  - element (Element): Element to modify.
             *  - name (String): WAI-ARIA attribute to remove.
             *
             *  Removes a WAI-ARIA attribute from the given `element`. The
             *  `name` if normalised (see [[jQuery.normaliseAria]]) and if
             *  `element` is not an element (see [[isElement]]) then no action
             *  is taken.
             *
             *  To better understand this method, consider this markup:
             *
             *      <div id="one" aria-label="test"></div>
             *
             *  If this script were run ...
             *
             *      var element = document.getElementById("one");
             *      handlers.property.unset(element, "label");
             *
             *  ... then the markup would become:
             *
             *      <div id="one"></div>
             *
             **/
            unset: function (element, name) {

                if (isElement(element)) {
                    element.removeAttribute(normalise(name));
                }

            }

        },

        /** internal
         *  handlers.reference
         *
         *  Handles modifying WAI-ARIA references.
         **/
        reference: {

            /** internal
             *  handlers.reference.set(element, name, reference)
             *  - element (Element): Element to modify.
             *  - name (String): WAI-ARIA attribute to set.
             *  - reference (String|Element|jQuery): Element to reference.
             *  - index (Number): Index of `element` within the collection.
             *
             *  Adds the WAI-ARIA reference to `element`. This differs from
             *  [[handlers.property.set]] in that `reference` is passed through
             *  jQuery's `$` and identified (see [[jQuery#identify]]) with the
             *  ID of the first match being used. There is also no `convert`
             *  parameter. The `name` is still normalised (see
             *  [[jQuery.normaliseAria]]).
             *
             *  To better understand this method, consider this markup:
             *
             *      <div class="one"></div>
             *      <div class="two"></div>
             *
             *  If this script were run ...
             *
             *      var element = document.querySelector(".one");
             *      handlers.reference.set(element, "labelledby", ".two");
             *
             *  ... then the markup would become:
             *
             *      <div class="one" aria=labelledby="anonymous0"></div>
             *      <div class="two" id="anonymous0"></div>
             *
             *  If `element` is not an element (see [[isElement]]) then no
             *  action is taken.
             **/
            set: function (element, name, reference, index) {

                handlers.property.set(
                    element,
                    name,
                    reference,
                    index,
                    identify
                );

            },

            /** internal
             *  handlers.reference.get(element, name) -> jQuery|undefined
             *  - element (Element): Element to check.
             *  - name (String): WAI-ARIA reference.
             *
             *  Gets the reference from the given `element` and returns it as a
             *  `jQuery` object. This differs from [[handlers.property.get]] in
             *  that the match is assumed to be an ID and a DOM lookup is done
             *  based upon that. The `name` is still normalised (see
             *  [[jQuery.normaliseAria]]). If the WAI-ARIA attribute is not
             *  found (see [[handlers.property.has]] then `undefined` is
             *  returned.
             *
             *  To better understand this method, consider this markup:
             *
             *      <div id="one" aria=labelledby="two"></div>
             *      <div id="two"></div>
             *
             *  With that markup, this method would have the following results:
             *
             *      var element = document.getElementById("one");
             *      handlers.reference.get(element, "labelledby");
             *      // -> $(<div id="two">)
             *      handlers.reference.get(element, "controls");
             *      // -> undefined
             *
             **/
            get: function (element, name) {

                return handlers.property.has(element, name)
                    ? $("#" + handlers.property.get(element, name))
                    : undefined;

            }

        },

        /** internal
         *  handlers.state
         *
         *  Handles WAI-ARIA states.
         **/
        state: {

            /** internal
             *  handlers.state.read(raw) -> Boolean|String
             *  - raw (?): Value to read
             *
             *  Reads the raw value and converts it into a boolean or the string
             *  `"mixed"` (always lower case).
             *
             *      handlers.state.read(true); // -> true
             *      handlers.state.read("false"); // -> false
             *      handlers.state.read("1"); // -> true
             *      handlers.state.read(0); // -> false
             *      handlers.state.read("mixed"); // -> "mixed"
             *
             *  If `raw` cannot be correctly converted, it is assumed to be
             *  `true`.
             *
             *      handlers.state.read("2"); // -> true
             *      handlers.state.read(-1); // -> true
             *      handlers.state.read([]); // -> true
             *      handlers.state.read("mixed."); // -> true
             *
             **/
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

            /** internal
             *  handlers.state.set(element, name, state)
             *  - element (Element): Element to modify.
             *  - name (String): WAI-ARIA attribute to set.
             *  - state (?): State to set.
             *  - index (Number): Index of `element` within the collection.
             *
             *  Sets the WAI-ARIA state defined in `name` on the given
             *  `element`. This differs from [[handlers.property.set]] in that
             *  `state` is converted into a boolean or `"mixed"` before being
             *  assigned (see [[handlers.state.read]]) and there is no `convert`
             *  paramter. The `name` is still normalised (see
             *  [[jQuery.normaliseAria]]).
             *
             *  To better understand this method, consider this markup.
             *
             *      <div id="one"></div>
             *      <div id="two"></div>
             *
             *  If this script were run ...
             *
             *      var one = document.getElementById("one");
             *      var two = document.getElementById("two");
             *      handlers.state.set(one, "busy", true);
             *      handlers.state.set(two, "checked", "mixed");
             *
             *  .. then the markup would become:
             *
             *      <div id="one" aria-busy="true"></div>
             *      <div id="two" aria-checked="mixed"></div>
             *
             **/
            set: function (element, name, state, index) {

                handlers.property.set(
                    element,
                    name,
                    state,
                    index,
                    handlers.state.read
                );

            },

            /** internal
             *  handlers.state.get(element, name) -> Boolean|String|undefined
             *  - element (Element): Element to access.
             *  - name (String): WAI-ARIA state to read.
             *
             *  Reads the WAI-ARIA state on `element`. This differs from
             *  [[handlers.property.get]] in that the result is converted into
             *  a boolean or the strign `"mixed"` before being returned. The
             *  `name` is still normalised (see [[jQuery.normaliseAria]]).
             *
             *  To better understand this method, consider this markup:
             *
             *      <div id="one" aria-busy="true" aria-checked="mixed"></div>
             *
             *  With that markup, this function would return these results:
             *
             *      var element = document.getElementById("one");
             *      handlers.state.get(element, "busy"); // -> true
             *      handlers.state.get(element, "checked"); // -> "mixed"
             *      handlers.state.get(element, "disabled"); // -> undefined
             *
             **/
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

    /** internal
     *  access(jQelements, properties) -> jQuery
     *  access(jQelements, property) -> String|Boolean|undefined
     *  access(jQelements, property, value[, type="property"]) -> jQuery
     *  - jQelements (jQuery): jQuery object to modify/access.
     *  - properties (Object): WAI-ARIA names and values.
     *  - property (String): WAI-ARIA property to modify.
     *  - value (?): Value to set.
     *  - type (String): Optional attribute type.
     *
     *  This function handles all the heavy lifting of getting or setting
     *  WAI-ARIA attributes. It is designed to be all that's necessary for
     *  [[jQuery#aria]], [[jQuery#ariaRef]] and [[jQuery#ariaState]]. This
     *  function will check its arguments to determine whether it should be used
     *  as a getter or a setter and passes the appropriate arguments to the
     *  [[handlers]] methods based on `type` (which will default to
     *  [[handlers.property]] if ommitted or not recognised).
     *
     *  The return value is based on the type of action being performed. If this
     *  function is setting then a jQuery object of the matches is returned
     *  (which is almost always `jQelements`); if the function is a getter then
     *  the results are returned for the first element in `jQelements`.
     *
     *  Although this description is not especially extensive and does not offer
     *  and examples, the code is very easy to follow and commented should there
     *  be any need to modify it. Once the correct arguments are being passed to
     *  the appropriate [[handlers]] method, they will take care of the rest.
     **/
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

    /** internal
     *  removeAttribute(name) -> jQuery
     *  - name (String): WAI-ARIA attribute to remove.
     *
     *  Removes the named WAI-ARIA attribute from all elements in the current
     *  collection. The `name` is normalised (see [[jQuery.normaliseAria]]).
     *  This function is designed to be called in the context of a `jQuery`
     *  object and is the engine behind [[jQuery#removeAria]],
     *  [[jQuery#removeAriaRef]] and [[jQuery#removeAriaState]]). See those
     *  methods for more information.
     **/
    function removeAttribute(name) {

        return this.each(function (ignore, element) {
            handlers.property.unset(element, name);
        });

    }

    /** alias of: jQuery.normaliseAria
     *  jQuery.normalizeAria(name) -> String
     *  - name (String): Attribute name to normalise.
     **/
    $.normalizeAria = normalise;
    $.normaliseAria = normalise;

    $.fn.extend({

        /** chainable
         *  jQuery#identify() -> jQuery
         *  jQuery#identify(index) -> String|undefined
         *  - index (String|Number): Index of the matching element whose ID
         *    should be returned.
         *
         *  Identifies all elements in the collection by getting all their IDs.
         *  If the elements don't have an ID attribute, a unique one is
         *  generated. The `jQuery` object is returned to allow chaining.
         *
         *      <div class="one"></div>
         *      <span class="one"></span>
         *
         *  The following script could then be executed:
         *
         *      $(".one").identify();
         *
         *  ... which would modify the markup to become this:
         *
         *      <div class="one" id="anonymous0"></div>
         *      <span class="one" id="anonymous1"></span>
         *
         * ... if this script were run afterwards:
         *
         *      $(".one").identify();
         *
         *  ... the markup would be unchanged because `identify` will not
         *  replace any existing IDs:
         *
         *      <div class="one" id="anonymous0"></div>
         *      <span class="one" id="anonymous1"></span>
         *
         *  IDs are a concatenation of "anonymous" and a hidden counter that is
         *  increased each time. If the ID already exists on the page, that ID
         *  is skipped and not assigned to a second element.
         *
         *  Consider this markup:
         *
         *      <div class="two" id="anonymous1"><!-- manually set --></div>
         *      <div class="two"></div>
         *      <div class="two"></div>
         *
         *  If this script is executed:
         *
         *      $(".two").identify();
         *
         *  ... then the markup would become this:
         *
         *      <div class="two" id="anonymous1"><!-- manually set --></div>
         *      <div class="two" id="anonymous0"></div>
         *      <div class="two" id="anonymous2"></div>
         *
         *  If a numeric `index` is passed, the ID of the element at that index
         *  is returned as a string. If there is no element at that `index`,
         *  `undefined` is returned.
         *
         *  With this markup ...
         *
         *      <div class="three" id="first"></div>
         *      <span class="three" id="second"></span>
         *
         *  ... this script would generate these results:
         *
         *      $(".three").identify(0); // -> "first"
         *      $(".three").identify(1); // -> "second"
         *      $(".three").identify(2); // -> undefined
         *
         *  Any `index` that is not numeric (see `jQuery.isNumeric` from the
         *  official documentation) is ignored and treated as if no `index` were
         *  given.
         **/
        identify: function (index) {

            var identified = [];
            var results = this.each(function (i, element) {

                var id = element.id;

                if (!id) {

                    do {

                        id = IDENTIFY_PREFIX + count;
                        count += 1;

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

        /** chainable
         *  jQuery#aria(property, value) -> jQuery
         *  jQuery#aria(properties) -> jQuery
         *  jQuery#aria(property) -> String|undefined
         *  - property (String): WAI-ARIA property to get/set.
         *  - value (String|Number|Boolean|Function): Value to set for the
         *    property.
         *  - properties (Object): Properties to set in key/value pairs.
         *
         *  **Setting WAI-ARIA properties:**
         *
         *  To set WAI-ARIA properties, pass either a `property`/`value` pair
         *  of arguments or an object containing those pairs.
         *
         *      $("#element").aria("label", "test"); // sets aria-label="test"
         *      $("#element").aria({label: "test"}); // sets aria-label="test"
         *
         *  When this is done, the attributes are set on all elements in the
         *  collection and the `jQuery` object is returned to allow for
         *  chaining.
         *
         *  If `value` is a function, the result of the function will be set as
         *  the value. The function is called with the element as the context
         *  and passed the index of the element within the collection and the
         *  normalised attribute name. This is done to keep consistency with the
         *  `jQuery#attr` function mentioned in the official documentation.
         *
         *      $("#element").aria("label", function (i, attr) {
         *          return this.id + "__" + i + "__" + attr;
         *      });
         *      // sets aria-label="element__0__aria-label"
         *
         *  If the `value` function returns `undefined` (or nothing) then no
         *  action is taken for that element. This can be useful for selectively
         *  setting values only when certain criteria are met.
         *
         *  **Getting WAI-ARIA properties:**
         *
         *  To get WAI-ARIA properties, only pass the `property` that you want
         *  to get. If there is no matching property, `undefined` is returned.
         *
         *      $("#element").aria("label"); // -> "test"
         *      $("#element").aria("checked"); // -> undefined
         *
         *  All properties are normalised (see [[jQuery.normaliseAria]]).
         **/
        aria: function (property, value) {

            return access(
                this,
                property,
                value
            );

        },

        /** chainable
         *  jQuery#ariaRef(property, value) -> jQuery
         *  jQuery#ariaRef(properties) -> jQuery
         *  jQuery#ariaRef(property) -> jQuery
         *  - property (String): WAI-ARIA property to get/set.
         *  - value (String|Element|jQuery|Function): Reference to set.
         *  - properties (Object): Properties to set in key/value pairs.
         *
         *  Sets a WAI-ARIA reference. This is functionally identical to
         *  [[jQuery#aria]] with the main difference being that an element may
         *  be passed as the `value`.
         *
         *      <h1>Heading</h1>
         *      <div class="one">Lorem ipsum dolor sit amet ...</div>
         *
         *  With markup like the example above, this function may be used
         *  similar to this:
         *
         *      $(".one").ariaRef("labelledby", $("h1"));
         *      // Same effects gained with:
         *      // $(".one").ariaRef("labelledby", "h1");
         *      // $(".one").ariaRef("labelledby", $("h1")[0]);
         *
         *  That code would change the example to this:
         *
         *      <h1 id="anonymous0">Heading</h1>
         *      <div class="one" aria-labelledby="anonymous0">
         *          Lorem ipsum dolor sit amet ...
         *      </div>
         *
         *  IDs are worked out using [[jQuery#identify]]. Be aware that any
         *  string passed to [[jQuery#ariaRef]] will be **treated like a CSS
         *  selector**. If you already have the ID and wish to set it without it
         *  being trreated like a CSS selector, use [[jQuery#aria]].
         *
         *  If `value` is a function then the resulting value is identified.
         *  This can be particularly useful for performing DOM traversal to find
         *  the reference. To understand that, consider this markup:
         *
         *      <div class="js-collapse">
         *          <div class="js-collapse-content">
         *              Lorem ipsum dolor sit amet ...
         *          </div>
         *          <button type="button" class="js-collapse-toggle">
         *              Toggle
         *          </button>
         *      </div>
         *
         *  With that markup, this script could be run:
         *
         *      $(".js-collapse-toggle").ariaRef("controls", function (i, attr) {
         *
         *          // this = each button.
         *          // i = index of this button with the jQuery collection.
         *          // attr = normalised WAI-ARIA attribute ("aria-controls").
         *
         *          return $(this)
         *              .closest(".js-collapse")
         *              .find(".js-collapse-content");
         *
         *      });
         *
         *  The script will convert the markup like this:
         *
         *      <div class="js-collapse">
         *          <div class="js-collapse-content" id="anonymous0">
         *              Lorem ipsum dolor sit amet ...
         *          </div>
         *          <button type="button" class="js-collapse-toggle" aria-controls="anonymous0">
         *              Toggle
         *          </button>
         *      </div>
         *
         *  As with [[jQuery#aria]], if the `value` function returns nothing or
         *  returns `undefined` then no action is taken.
         *
         *  When accessing the attribute using this function, a `jQuery` object
         *  representing the reference is returned.
         *
         *      $(".one").ariaRef("labelledby"); // -> $(<h1>)
         *
         *  If there are multiple elements in the collection, only the reference
         *  for the first element is returned. To get the value of the attribute
         *  rather than the element, use [[jQuery#aria]].
         **/
        ariaRef: function (property, value) {

            return access(
                this,
                property,
                value,
                "reference"
            );

        },

        /** chainable
         *  jQuery#ariaState(property, value) -> jQuery
         *  jQuery#ariaState(properties) -> jQuery
         *  jQuery#ariaState(property) -> Boolean|String|undefined
         *  - property (String): WAI-ARIA attribute to set.
         *  - value (Boolean|String|Number|Function): Value of the attribute.
         *  - properties (Object): Key/value combination properties to set.
         *
         *  Sets or gets the WAI-ARIA state of the collection. To better
         *  understand the getting, imagine this markup:
         *
         *      <div id="one" aria-busy="true" aria-checked="mixed"></div>
         *
         *  With markup like that, this function will return these results:
         *
         *      $("#one").ariaState("busy"); // -> true
         *      $("#one").ariaState("checked"); // -> "mixed"
         *      $("#one").ariaState("hidden"); // -> undefined
         *
         *  If you are expecting a certain value, be sure to test it with the
         *  explicit equality operator `===`. With the examples above, messages
         *  would be logged to the `console` in each case.
         *
         *      if ($("#one").ariaState("checked")) {
         *          console.log("#one is checked or mixed");
         *      }
         *
         *      if (!$("#one").ariaState("hidden")) {
         *          console.log("#one is not hidden or has no hidden state");
         *      }
         *
         *  Depending on your situation, this may not be desirable. The strict
         *  equality operator will guarantee expected results.
         *
         *      if ($("#one").ariaState("checked") === true) {
         *          console.log("#one is explicitly checked");
         *      }
         *
         *      if ($("#one").ariaState("hidden") === false) {
         *          console.log("#one has the hidden state set to false");
         *          // Note: According to WAI-ARIA specs, aria-hidden should be
         *          // removed rather than being set to false.
         *      }
         *
         *  When setting the state, the following values will set the state of
         *  `aria-busy` to `false`:
         *
         *      $("#one").ariaState("busy", "false");
         *      $("#one").ariaState("busy", "FALSE");
         *      $("#one").ariaState("busy", false);
         *      $("#one").ariaState("busy", 0);
         *      $("#one").ariaState("busy", "0");
         *
         *  The value can be set to `"mixed"`:
         *
         *      $("#one").ariaState("checked", "mixed");
         *      $("#one").ariaState("checked", "MIXED");
         *
         *  The value can also be set to `true`:
         *
         *      $("#one").ariaState("busy", "true");
         *      $("#one").ariaState("busy", "TRUE");
         *      $("#one").ariaState("busy", true);
         *      $("#one").ariaState("busy", 1);
         *      $("#one").ariaState("busy", "1");
         *
         *  The default setting of a state is `true`, so these values will also
         *  set the state to `true`:
         *
         *      $("#one").ariaState("busy", {});
         *      $("#one").ariaState("busy", null);
         *      $("#one").ariaState("busy", "nothing");
         *      $("#one").ariaState("busy", "");
         *      $("#one").ariaState("busy", -1);
         *
         *  If `value` is a function then the result is converted as described
         *  above. This can be useful for setting the state to match the state
         *  of another element. For example, consider this markup.
         *
         *      <div class="checkbox"></div>
         *      <input type="checkbox" checked>
         *
         *  With that markup, this script could be run:
         *
         *      $(".checkbox").ariaState("checked", function (i, attr) {
         *
         *          // this = each .checkbox element.
         *          // i = index of this element in the collection.
         *          // attr = normalised WAI-ARIA attribute ("aria-checked").
         *
         *          return $(this)
         *              .next("input[type=\"checkbox\"]")
         *              .prop("checked");
         *
         *      });
         *
         *  That would modify the markup like this:
         *
         *      <div class="checkbox" aria-checked="true"></div>
         *      <input type="checkbox" checked>
         *
         *  As with [[jQuery#aria]], if the `value` function returns nothing or
         *  returns `undefined` then no action is taken.
         *
         *  To set the state more explicitly instead of going through the state
         *  coercion, use [[jQuery#aria]].
         **/
        ariaState: function (property, value) {

            return access(
                this,
                property,
                value,
                "state"
            );

        },

        /** chainable
         *  jQuery#role(role) -> jQuery
         *  jQuery#role() -> String|undefined
         *  - role (String): Role to set.
         *
         *  Sets the role of all elements in the collection or gets the role of
         *  the first element in the collection, depending on whether or not the
         *  `role` argument is provided.
         *
         *      <div id="one"></div>
         *      <div id="two"></div>
         *
         *  If this script wrote run:
         *
         *      $("#one").role("presentation");
         *
         *  ... then the markup would become:
         *
         *      <div id="one" role="presentation"></div>
         *      <div id="two"></div>
         *
         *  When setting a role, the `jQuery` object is returned to allow for
         *  chaining.
         *
         *  With the modified markup, this script would return these values:
         *
         *      $("#one").role(); // -> "presentation"
         *      $("#two").role(); // -> undefined
         *
         *  As [[jQuery#role]] is just a wrapper for `jQuery#attr`, the `role`
         *  parameter can actually be any value type that the official
         *  documentation mentions.
         **/
        role: function (role) {

            return role === undefined
                ? this.attr("role")
                : this.attr("role", role);

        },

        /** chainable
         *  jQuery#removeRole() -> jQuery
         *
         *  Removes the `role` from an element. Consider this markup:
         *
         *      <div id="one" role="presentation"></div>
         *
         *  In that situation, this could could be run:
         *
         *      $("#one").removeRole();
         *
         *  ... and the markup would become this:
         *
         *      <div id="one"></div>
         *
         *  The `jQuery` object is returned to allow for chaining.
         **/
        removeRole: function () {
            return this.removeAttr("role");
        },

        /** chainable
         *  jQuery#removeAria(name) -> jQuery
         *  - name (String): Name of the attribute to remove
         *
         *  Removes the WAI-ARIA attribute from the given collection.
         *
         *      <div id="one" aria-hidden="true"></div>
         *
         *  If this script were run:
         *
         *      $("#one").removeAria("hidden");
         *
         *  ... then the markup would become this:
         *
         *      <div id="one"></div>
         *
         *  The `jQuery` object is returned to allow for chaining.
         **/
        removeAria: removeAttribute,

        /** alias of: jQuery#removeAria
         *  jQuery#removeAriaRef(name) -> jQuery
         *  - name (String): Name of the attribute to remove
         **/
        removeAriaRef: removeAttribute,

        /** alias of: jQuery#removeAria
         *  jQuery#removeAriaState(name) -> jQuery
         *  - name (String): Name of the attribute to remove
         **/
        removeAriaState: removeAttribute,

        /** chainable
         *  jQuery#ariaVisible(state) -> jQuery
         *  - state (Boolean|String|Number): Visibility state.
         *
         *  Sets the visibility of the matching elements on a WAI-ARIA level. To
         *  better understand that, consider the following markup:
         *
         *      <div id="one" aria-hidden="true"></div>
         *      <div id="two"></div>
         *
         *  With that markup, the following script could be run:
         *
         *      $("#one").ariaVisible(false);
         *      $("#one").ariaVisible(true);
         *
         *  ... the markup would become:
         *
         *      <div id="one"></div>
         *      <div id="two" aria-hidden="true"></div>
         *
         *  _Note: According to the WAI-ARIA specs, declaring an element to be
         *  visible should be done by removing the `aria-hidden` attribute
         *  rather than setting the value to `false`._
         *
         *  Strings, numbers and booleans are understood as `state` - see
         *  [[jQuery#ariaState]] for full details as the algorythm is the same.
         *
         *  Be aware that this function will _only_ modify the `aria-hidden` of
         *  the matching elements. It's possible that after running this
         *  function, the element cannot be seen visually or is still hidden to
         *  WAI-ARIA devices. To understand that, consider this markup:
         *
         *      <div id="one" aria-hidden="true">
         *          <div id="two" aria-hidden="true" style="display:none"></div>
         *      </div>
         *
         *  With that markup, `$("#two").ariaVisible(true);` will change the
         *  markup to be this:
         *
         *      <div id="one" aria-hidden="true">
         *          <div id="two" style="display:none"></div>
         *      </div>
         *
         **/
        ariaVisible: function (state) {

            var theState = handlers.state.read(state);

            return theState
                ? access(this, ATTRIBUTE_HIDDEN, theState)
                : this.removeAttr(ATTRIBUTE_HIDDEN);

        },

        /** chainable
         *  jQuery#ariaFocusable(state) -> jQuery
         *  - state (Boolean|String|Number): Focusable state.
         *
         *  Sets whether or not the matching elements are focusable.
         *
         *      <div id="one"></div>
         *      <div id="two"></div>
         *
         *  With the above markup, this script can be run:
         *
         *      $("#one").ariaFocusable(true);
         *      $("#two").ariaFocusable(false);
         *
         *  ... the markup would now become this:
         *
         *      <div id="one" tabindex="0"></div>
         *      <div id="two" tabindex="-1"></div>
         *
         *  Strings, numbers and booleans are understood as `state` - see
         *  [[jQuery#ariaState]] for full details as the algorythm is the same.
         *
         *  Be aware this this function will only modify the matching elements,
         *  it will not check any parents or modify any other elements that
         *  could affect the focusability of the element.
         *
         *      <div id="one" tabindex="-1">
         *          <div id="two" disabled></div>
         *      </div>
         *
         *  With that markup, `$("#two").ariaFocusable(true);` would modify the
         *  markup to this:
         *
         *      <div id="one" tabindex="-1">
         *          <div id="two" disabled tabindex="0"></div>
         *      </div>
         *
         **/
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
