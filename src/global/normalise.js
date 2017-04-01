/*global
    $,
    interpretString,
    IS_PROXY_AVAILABLE,
    identity,
    memoise
*/

/**
 * Normalises a WAI-ARIA attribute name so that it's always lower case and
 * always stars with <code>aria-</code>. If the unprefixed value appears in
 * [jQuery.ariaFix]{@link external:jQuery.ariaFix} then the mapped version is
 * used before being prefixed.
 * <br><br>
 * The results of this function are cached to help reduce processing. This is
 * exposed as <code>jQuery.normaliseAria.cache</code> if needed but there is no
 * need to clear the cache after modifying
 * [jQuery.ariaFix]{@link external:jQuery.ariaFix} - changes are automatically
 * considered in the caching process.
 * <br><br>
 * This function is aliased as
 * [jQuery.normalizeAria]{@link external:jQuery.normalizeAria}.
 *
 * @function
 * @alias    external:jQuery.normaliseAria
 * @memberof external:jQuery
 * @param    {String} name
 *           Attribute name to normalise.
 * @return   {String}
 *           Normalised attribute name.
 * @property {Object.<String>} cache
 *           The cache of requests to responses.
 *
 * @example <caption>Basic example</caption>
 * $.normaliseAria("label");      // -> "aria-label"
 * $.normaliseAria("LABEL");      // -> "aria-label"
 * $.normaliseAria("aria-label"); // -> "aria-label"
 * $.normaliseAria();             // -> "aria-"
 *
 * @example <caption>Alias</caption>
 * $.normalizeAria("label");      // -> "aria-label"
 * $.normalizeAria("LABEL");      // -> "aria-label"
 * $.normalizeAria("aria-label"); // -> "aria-label"
 * $.normalizeAria();             // -> "aria-"
 *
 * @example <caption>Mapped attribute</caption>
 * // $.ariaFix = {labeledby: "labelledby"}
 * $.normaliseAria("labeledby");      // -> "aria-labelledby"
 * $.normaliseAria("LABELEDBY");      // -> "aria-labelledby"
 * $.normaliseAria("aria-labeledby"); // -> "aria-labelledby"
 *
 * @example <caption>The cache</caption>
 * $.normaliseAria("busy");    // -> "aria-busy"
 * $.normaliseAria("busy");    // -> "aria-busy" (from cache)
 * $.normaliseAria("checked"); // -> "aria-checked"
 * $.normaliseAria("busy");    // -> "aria-busy" (from cache)
 * $.normaliseAria.cache;
 * // -> {"busy": "aria-busy", "checked": "aria-checked"}
 */
var normalise = memoise(
    function (name) {

        "use strict";

        var prefix = "aria-";
        var lower = interpretString(name).toLowerCase();
        var full = (/^aria-/).test(lower)
            ? lower
            : prefix + lower;
        var stem = full.slice(prefix.length);
        var map = $.ariaFix[stem];

        if (map) {

            stem = map;
            full = prefix + stem;

        }

        return full;

    },
    IS_PROXY_AVAILABLE
        ? identity
        : function (name) {

            "use strict";

            return name + "|" + JSON.stringify($.ariaFix);

        }
);
