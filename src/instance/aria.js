/**
 * Gets or sets WAI-ARIA properties. The properties will not be modified any
 * more than they need to be (unlike
 * [jQuery#ariaRef]{@link external:jQuery#ariaRef} or
 * [jQuery#ariaState]{@link external:jQuery#ariaState} which will interpret the
 * values).
 * <br><br>
 * To set WAI-ARIA properties, pass either a
 * <code>property</code>/<code>value</code> pair of arguments or an object
 * containing those pairs. When this is done, the attributes are set on all
 * elements in the collection and the <code>jQuery</code> object is returned to
 * allow for chaining. If <code>value</code> is a function and returns
 * <code>undefined</code> (or nothing) then no action is taken for that element.
 * This can be useful for selectively setting values only when certain criteria
 * are met.
 * <br><br>
 * To get WAI-ARIA properties, only pass the <code>property</code> that you want
 * to get. If there is no matching property, <code>undefined</code> is returned.
 * All properties are normalised (see
 * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}).
 *
 * @memberof external:jQuery
 * @instance
 * @alias aria
 * @param  {Object|String} property
 *         Either the properties to set in key/value pairs or the name of the
 *         property to get/set.
 * @param  {Attribute_Callback|Boolean|Number|String} [value]
 *         The value of the property to set.
 * @return {jQuery|String|undefined}
 *         Either the jQuery object (after setting) or a string or undefined
 *         (after getting)
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
 * // All of these set aria-label="test" on all matching elements and return a
 * // jQuery object representing "#element"
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
 * // Both of these set aria-label="element__0__undefined" on all matching
 * // elements and return a jQuery object representing "#element"
 *
 * @example <caption>Getting a WAI-ARIA attribute</caption>
 * // Markup is:
 * // <div id="element" aria-label="test"></div>
 * $("#element").aria("label");   // -> "test"
 * $("#element").aria("checked"); // -> undefined
 * // If "#element" matches multiple elements, the attributes from the first
 * // element are returned.
 */
$.fn.aria = function (property, value) {

    return access(
        this,
        property,
        value
    );

};
