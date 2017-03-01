/**
 * Removes the named WAI-ARIA attribute from all elements in the current
 * collection. The <code>name</code> is normalised (see
 * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}). This function
 * is aliased as [jQuery#removeAriaRef]{@link external:jQuery#removeAriaRef} and
 * [jQuery#removeAriaState]{@link external:jQuery#removeAriaState}.
 *
 * @alias    removeAria
 * @memberof external:jQuery
 * @instance
 * @param    {String} name
 *           WAI-ARIA attribute to remove.
 * @return   {jQuery}
 *           jQuery attribute representing the elements modified.
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
        handlers[HANDLER_PROPERTY].unset(element, name);
    });

}
