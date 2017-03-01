/**
 * Handles modifying WAI-ARIA references. Unlike {@link handlers.property}, this
 * will create references to elements and return them. The only defined methods
 * are:
 * <br>{@link handlers.reference.set} sets a reference.
 * <br>{@link handlers.reference.get} gets a reference.
 *
 * @alias     reference
 * @memberof  handlers
 * @namespace
 * @private
 */
handlers[HANDLER_REFERENCE] = {

    /**
     * Adds the WAI-ARIA reference to <code>element</code>. This differs from
     * {@link handlers.property.set} in that <code>reference</code> is passed
     * through [jQuery's $ function]{@link http://api.jquery.com/jquery/} and
     * identified (see [jQuery#identify]{@link external:jQuery#identify}) with
     * the ID of the first match being used. There is also no
     * <code>convert</code> parameter.
     * <br><br>
     * The <code>name</code> is still normalised (see
     * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}). If
     * <code>element</code> is not an element (see {@link isElement}) then no
     * action is taken.
     *
     * @private
     * @param   {Element}      element
     *          Element to modify.
     * @param   {String}       name
     *          WAI-ARIA attribute to set.
     * @param   {jQuery_param} reference
     *          Element to reference.
     * @param   {Number}       index
     *          Index of <code>element</code> within the collection.
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

        handlers[HANDLER_PROPERTY].set(
            element,
            name,
            reference,
            index,
            identify
        );

    },

    /**
     * Gets the reference from the given <code>element</code> and returns it as
     * a <code>jQuery</code> object. This differs from
     * {@link handlers.property.get} in that the match is assumed to be an ID
     * and a DOM lookup is done based upon that. The <code>name</code> is still
     * normalised (see
     * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}). If the
     * WAI-ARIA attribute is not found (see {@link handlers.property.has} then
     * <code>undefined</code> is returned.
     *
     * @private
     * @param   {Element}          element
     *          Element to check.
     * @param   {String}           name
     *          WAI-ARIA reference.
     * @return  {jQuery|undefined}
     *          jQuery object representing the reference or undefined if the
     *          attribute isn't set.
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

        var handler = handlers[HANDLER_PROPERTY];

        return handler.has(element, name)
            ? $("#" + handler.get(element, name))
            : undefined;

    }

};
