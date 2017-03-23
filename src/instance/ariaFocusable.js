/*jslint
    this
*/
/*global
    $,
    handlers,
    HANDLER_STATE
*/

/**
 * Sets whether or not the matching elements are focusable. Strings, numbers and
 * booleans are understood as <code>state</code> - see
 * [jQuery#ariaState]{@link external:jQuery#ariaState} for full details as the
 * algorythm is the same.
 * <br><br>
 * Be aware this this function will only modify the matching elements, it will
 * not check any parents or modify any other elements that could affect the
 * focusability of the element.
 *
 * @memberof external:jQuery
 * @instance
 * @alias    ariaFocusable
 * @param    {Attribute_Callback|Boolean|Number|String} state
 *           State to set.
 * @return   {jQuery}
 *           jQuery object representing the affected element(s).
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
$.fn.ariaFocusable = function (state) {

    "use strict";

    return this.attr(
        "tabindex",
        handlers[HANDLER_STATE].read(state)
            ? 0
            : -1
    );

};
