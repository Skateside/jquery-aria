/**
 * Sets the visibility of the matching elements on a WAI-ARIA level. Strings,
 * numbers and booleans are understood as <code>state</code> - see
 * [jQuery#ariaState]{@link external:jQuery#ariaState} for full details as the
 * algorythm is the same.
 * <br><br>
 * Note that according to the WAI-ARIA specs, declaring an element to be visible
 * should be done by removing the <code>aria-hidden</code> attribute rather than
 * setting the value to <code>false</code>.
 * <br><br>
 * Be aware that this function will only modify the <code>aria-hidden</code> of
 * the matching elements. It's possible that after running this function, the
 * element cannot be seen visually or is still hidden to WAI-ARIA devices.
 *
 * @memberof external:jQuery
 * @instance
 * @alias ariaVisible
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
$.fn.ariaVisible = function (state) {

    var theState = handlers.state.read(state);

    return theState
        ? access(this, "hidden", theState)
        : this.removeAttr("hidden");

};
