/**
 * A map of unprefixed WAI-ARIA attributes that should be converted before being
 * normalised (see [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}).
 *
 * @alias    external:jQuery.ariaMap
 * @memberof external:jQuery
 * @type     {Object.<String>}
 *
 * @example <caption>Correcting a common typo</caption>
 * $.ariaMap.budy = "busy";
 * $.normaliseAria("budy");      // -> "aria-busy"
 * $.normaliseAria("aria-budy"); // -> "aria-busy"
 */
$.ariaMap = {

    // This is the US English spelling but the ccessibility API defined the
    // attribute with the double L.
    // https://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby
    labeledby: "labelledby"

};

// If Proxy is available, we can use it to check whenever $.ariaMap is modified
// and invalidate the cache of normalise() when it is. This is a lot more
// efficient than always converting $.ariaMap to a JSON string to ensure the
// cache is accurate.
if (IS_PROXY_AVAILABLE) {

    $.ariaMap = new Proxy($.ariaMap, {

        set: function (target, name, value) {

            normalise.cache = {};
            target[name] = value;

        }

    });

}
