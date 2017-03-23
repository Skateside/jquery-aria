/*global
    $,
    removeAttribute
*/

$.fn.extend({

    removeAria: removeAttribute,

    /**
     * Alias of [jQuery#removeAria]{@link external:jQuery#removeAria}.
     *
     * @memberof external:jQuery
     * @instance
     * @function
     * @param    {String} name
     *           WAI-ARIA attribute to remove.
     * @return   {jQuery}
     *           jQuery attribute representing the elements modified.
     */
    removeAriaRef: removeAttribute,

    /**
     * Alias of [jQuery#removeAria]{@link external:jQuery#removeAria}.
     *
     * @memberof external:jQuery
     * @instance
     * @function
     * @param    {String} name
     *           WAI-ARIA attribute to remove.
     * @return   {jQuery}
     *           jQuery attribute representing the elements modified.
     */
    removeAriaState: removeAttribute

});
