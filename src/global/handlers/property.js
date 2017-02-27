/**
 * Handles WAI-ARIA properties without modifying the values any more than it
 * needs to. These methods also act as the fallback for other namespaces such as
 * {@link handlers.reference} and {@link handlers.state}.
 * <br>{@link handlers.property.get} gets the value of the property.
 * <br>{@link handlers.property.set} sets a property.
 * <br>{@link handlers.property.has} checks to see if the property exists.
 * <br>{@link handlers.property.unset} removes the property.
 *
 * @alias property
 * @memberof handlers
 * @namespace
 * @private
 */
handlers[HANDLER_PROPERTY] = {

    /**
     * Sets the property of an element. The <code>value</code> is unchanged
     * (other than normal string coercion) and the <code>name</code> is
     * normalised into a WAI-ARIA property (see
     * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}).
     * <br><br>
     * If <code>element</code> is not an element (see {@link isElement}) then no
     * action will be taken.
     * <br><br>
     * If <code>value</code> is a function, it is treated like an
     * {@link Attribute_callback}. This is for consistency with
     * [jQuery#attr]{@link http://api.jquery.com/attr/}.
     * <br><br>
     * A <code>convert</code> function can also be passed. That function will
     * convert <code>value</code> (if <code>value</code> is a function,
     * <code>convert</code> will convert the result) before assigning it. If
     * <code>convert</code> is ommitted or not a function then {@link identity}
     * is used so <code>value</code> will not be changed.
     *
     * @private
     * @param {Element}  element
     *        Element to have a property set.
     * @param {String}   name
     *        WAI-ARIA property to set.
     * @param {?}        value
     *        Value of the property.
     * @param {Number}   [index]
     *        Optional index of <code>element</code> within the jQuery object.
     *        This is needed to keep consistency with the
     *        [jQuery#attr]{@link http://api.jquery.com/attr/} function and
     *        should be derived rather than manually passed.
     * @param {Function} [convert=identity]
     *        Optional conversion process. If ommitted, no conversion occurs.
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
     * <code>element</code>. The <code>name</code> is always normalised (see
     * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}) and if
     * <code>element</code> is not an element (see {@link isElement}) then
     * <code>false</code> will always be returned.
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
     * handlers.property.has(element, "busy");  // -> false
     */
    has: function (element, name) {

        return isElement(element)
            ? element.hasAttribute(normalise(name))
            : false;

    },

    /**
     * Gets the value of the WAI-ARIA property from the given
     * <code>element</code> and returns it unchanged. The <code>name</code> is
     * normalised (see
     * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}). If
     * <code>element</code> is not an element (see {@link isElement}) or
     * <code>name</code> is not recognised (see
     * {@link handlers.property.has}) then <code>undefined</code> is returned.
     *
     * @private
     * @param  {Element}          element
     *         Element to access.
     * @param  {String}           name
     *         WAI-ARIA property to access.
     * @return {String|undefined}
     *         WAI-ARIA attribute or undefined if the attribute isn't set.
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

        return handlers[HANDLER_PROPERTY].has(element, name)
            ? element.getAttribute(normalise(name))
            : undefined;

    },

    /**
     * Removes a WAI-ARIA attribute from the given <code>element</code>. The
     * <code>name</code> if normalised (see
     * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}) and if
     * <code>element</code> is not an element (see {@link isElement}) then no
     * action is taken.
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

};
