/**
 * Sets or gets the WAI-ARIA state of the collection.
 * <br><br>
 * When setting the state, false, "false" (any case), 0 and "0" will be
 * considered false. All other values will be considered true except for "mixed"
 * (any case) which will set the state to "mixed". The differs from
 * [jQuery#aria]{@link external:jQuery#aria} which will simply set the
 * attribute(s) without converting the value.
 * <br><br>
 * After setting the state(s), a jQuery object representing the affected
 * elements is returned. The state for the first matching element is returned
 * when getting.
 * <br><br>
 * All attributes are normalised - see
 * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria} for full details.
 *
 * @memberof external:jQuery
 * @instance
 * @alias    ariaState
 * @param    {Object|String} property
 *           Either a key/value combination properties to set or the name of the
 *           WAI-ARIA state to set.
 * @param    {Attribute_Callback|Boolean|Number|String} [value]
 *           Value of the attribute.
 * @return   {ARIA_state|jQuery}
 *           Either the jQuery object representing the modified elements
 *           (setting) or the state of the first matching element.
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
 * // Each example returns a jQuery object representing "#one" and an object
 * // can be passed as parameters as well:
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
$.fn.ariaState = function (property, value) {

    return access(
        this,
        property,
        value,
        HANDLER_STATE
    );

};
