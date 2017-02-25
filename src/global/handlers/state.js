var REGEXP_BOOLEAN = /^(?:true|false)$/;
var VALUE_MIXED = "mixed";

/**
 * Handles WAI-ARIA states. This differs from {@link handlers.property} in that
 * values are coerced into booleans before being set and a boolean (or the
 * string "mixed") will be returned.
 * <br>{@link handlers.state.read} converts the value into a boolean.
 * <br>{@link handlers.state.set} sets the state.
 * <br>{@link handlers.state.get} gets the state.
 *
 * @alias state
 * @memberof handlers
 * @namespace
 * @private
 */
handlers[HANDLER_STATE] = {

    /**
     * Reads the raw value and converts it into a boolean or the string
     * <code>"mixed"</code> (always lower case). If <code>raw</code> cannot be
     * correctly converted, it is assumed to be <code>true</code>.
     *
     * @private
     * @param  {?} raw
     *         Value to read.
     * @return {Boolean|String}
     *         Converted value.
     *
     * @example <caption>Converting values</caption>
     * handlers.state.read(true);    // -> true
     * handlers.state.read("false"); // -> false
     * handlers.state.read("1");     // -> true
     * handlers.state.read(0);       // -> false
     * handlers.state.read("mixed"); // -> "mixed"
     *
     * @example <caption>Unrecognised values default to true</caption>
     * handlers.state.read("2");      // -> true
     * handlers.state.read(-1);       // -> true
     * handlers.state.read([]);       // -> true
     * handlers.state.read("mixed."); // -> true
     */
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

    /**
     * Sets the WAI-ARIA state defined in <code>name</code> on the given
     * <code>element</code>. This differs from {@link handlers.property.set} in
     * that <code>state</code> is converted into a boolean or
     * <code>"mixed"</code> before being assigned (see
     * {@link handlers.state.read}) and there is no <code>convert</code>
     * paramter. The <code>name</code> is still normalised (see
     * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}).
     *
     * @private
     * @param {Element} element
     *        Element to modify.
     * @param {String}  name
     *        WAI-ARIA attribute to set.
     * @param {?}       state
     *        State to set.
     * @param {Number}  index
     *        Index of <code>element</code> within the collection.
     *
     * @example
     * // Markup is:
     * // <div id="one"></div>
     * // <div id="two"></div>
     *
     * var one = document.getElementById("one");
     * var two = document.getElementById("two");
     * handlers.state.set(one, "busy", true);
     * handlers.state.set(two, "checked", "mixed");
     *
     * // Now markup is:
     * // <div id="one" aria-busy="true"></div>
     * // <div id="two" aria-checked="mixed"></div>
     */
    set: function (element, name, state, index) {

        handlers.property.set(
            element,
            name,
            state,
            index,
            handlers.state.read
        );

    },

    /**
     * Reads the WAI-ARIA state on <code>element</code>. This differs from
     * {@link handlers.property.get} in that the result is converted into a
     * boolean or the strign `"mixed"` before being returned. The
     * <code>name</code> is still normalised (see {@link jQuery.normaliseAria}).
     *
     * @private
     * @param  {Element}    element
     *         Element to access.
     * @param  {String}     name
     *         WAI-ARIA state to read.
     * @return {ARIA_state}
     *         State of the WAI-ARIA property.
     *
     * @example
     * // Markup is:
     * // <div id="one" aria-busy="true" aria-checked="mixed"></div>
     *
     * var element = document.getElementById("one");
     * handlers.state.get(element, "busy");     // -> true
     * handlers.state.get(element, "checked");  // -> "mixed"
     * handlers.state.get(element, "disabled"); // -> undefined
     */
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

};
