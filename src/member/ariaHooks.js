/*global
    $
*/

/**
 * A collection of hooks that change the behaviour of attributes being set,
 * retrieved, checked or removed (called [set]{@link ARIA_hook_set},
 * [get]{@link ARIA_hook_get}, [has]{@link ARIA_hook_has},
 * [unset]{@link ARIA_hook_unset} - see {@link ARIA_hook} for full details). The
 * name of the hook is always the un-prefixed WAI-ARIA attribute in lower case
 * after any mapping has occurred (see
 * [jQuery.ariaFix]{@link external:jQuery.ariaFix}). If you are ever in doubt,
 * the easiest way to know the key is to slice the normalised value:
 * <code>$.normaliseAria(__WAI-ARIA_ATTRIBUTE__).slice(5)</code> (see
 * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria} for more
 * information).
 * <br><br>
 * Do not use these functions to set different WAI-ARIA attributes without
 * setting the one being passed to the aria method; for example: do not create a
 * set for "attribute1" that sets "attribute2" instead - unless you add the same
 * conversion to <code>has</code>, <code>get</code> will not be triggered.
 * Instead, use [jQuery.ariaFix]{@link external:jQuery.ariaFix} to convert the
 * attribute name.
 * <br><br>
 * [jQuery#aria]{@link external:jQuery#aria},
 * [jQuery#ariaRef]{@link external:jQuery#ariaRef},
 * [jQuery#ariaState]{@link external:jQuery#ariaState},
 * [jQuery#removeAria]{@link external:jQuery#removeAria},
 * [jQuery#removeAriaRef]{@link external:jQuery#removeAriaRef} and
 * [jQuery#removeAriaState]{@link external:jQuery#removeAriaState} all run
 * through these hooks (if they exist) and these hooks replace the functionality
 * of manipulating or checking the attributes after any conversion process has
 * occurred within the method itself.
 *
 * @alias    external:jQuery.ariaHooks
 * @memberof external:jQuery
 * @type     {Object.<ARIA_hook>}
 *
 * @example
 * // aria-level should be an integer greater than or equal to 1 so the getter
 * // should return an integer.
 * $.ariaHooks.level = {
 *     set: function (element, value) {
 *         var intVal = Math.max(1, Math.floor(value));
 *         if (!isNaN(intVal)) {
 *             element.setAttribute("aria-level", intVal)
 *         }
 *     },
 *     get: function (element) {
 *         var value = element.getAttribute("aria-level");
 *         var intVal = Math.max(1, Math.floor(value));
 *         return (value === null || isNaN(intVal))
 *             ? undefined
 *             : intVal;
 *     }
 * };
 */
$.ariaHooks = {

    hidden: {

        // Setting aria-hidden="false" is considered valid, but removing the
        // aria-hidden attribute has the same effect and I think it's tidier.
        // https://www.w3.org/TR/wai-aria/states_and_properties#aria-hidden
        set: function (element, value, name) {

            "use strict";

            var response;

            if (value === false || +value === 0 || (/^false$/i).test(value)) {
                element.removeAttribute(name);
            } else {
                response = value;
            }

            return response;

        }

    }

};
