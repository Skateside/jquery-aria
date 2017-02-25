/**
 * Normalises a WAI-ARIA attribute name so that it's always lower case and
 * always stars with <code>aria-</code>.
 * <br><br>
 * This function is aliased as
 * [jQuery.normalizeAria]{@link external:jQuery.normalizeAria}.
 *
 * @alias    external:jQuery.normaliseAria
 * @memberof external:jQuery
 * @param    {String} name
 *           Attribute name to normalise.
 * @return   {String}
 *           Normalised attribute name.
 *
 * @example
 * $.normaliseAria("label");      // -> "aria-label"
 * $.normaliseAria("LABEL");      // -> "aria-label"
 * $.normaliseAria("aria-label"); // -> "aria-label"
 * $.normaliseAria();             // -> "aria-"
 *
 * // Alias:
 * $.normalizeAria("label"); // -> "aria-label"
 */
var normalise = function (name) {

    var lower = interpretString(name).toLowerCase();

    return startsWith.call(lower, "aria-")
        ? lower
        : "aria-" + lower;

};
