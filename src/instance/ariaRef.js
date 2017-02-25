/**
 * Gets or sets a WAI-ARIA reference. This is functionally identical to
 * [jQuery#aria]{@link external:jQuery#aria} with the main difference being that
 * an element may be passed as the <code>value</code> when setting and that a
 * jQuery object is returned when getting.
 * <br><br>
 * Because WAI-ARIA references work with IDs, IDs are worked out using
 * [jQuery#identify]{@link external:jQuery#identify}. Be aware that any string
 * passed to [jQuery#ariaRef]{@link external:jQuery#ariaRef} will be treated
 * like a CSS selector and looked up with the results being used to set the
 * property. If you already have the ID and wish to set it without the lookup,
 * use [jQuery#aria]{@link external:jQuery#aria}.
 * <br><br>
 * If <code>value</code> is a function then the resulting value is identified.
 * This can be particularly useful for performing DOM traversal to find the
 * reference (see examples below). As with
 * [jQuery#aria]{@link external:jQuery#aria}, if the <code>value</code> function
 * returns nothing or returns <code>undefined</code> then no action is taken.
 * <br><br>
 * When accessing the attribute using this function, a <code>jQuery</code>
 * object representing the reference is returned. If there are multiple elements
 * in the collection, only the reference for the first element is returned. To
 * get the value of the attribute rather than the element, use
 * [jQuery#aria]{@link external:jQuery#aria}.
 *
 * @memberof external:jQuery
 * @instance
 * @alias ariaRef
 * @param  {Object|String} property
 *         Either the properties to set in key/value pairs or the name of the
 *         property to set.
 * @param  {Attribute_Callback|jQuery_param} [value]
 *         Reference to set.
 * @return {jQuery}
 *         jQuery object representing either the elements that were modified
 *         (when setting) or the referenced element(s) (when getting - may be an
 *         empty jQuery object).
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
$.fn.ariaRef = function (property, value) {

    return access(
        this,
        property,
        value,
        HANDLER_REFERENCE
    );

};
