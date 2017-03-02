/**
 * A collection of hooks that change the behaviour of attributes being set,
 * retrieved, checked or removed (called [set]{@link ARIA_hook_set},
 * [get]{@link ARIA_hook_get}, [has]{@link ARIA_hook_has},
 * [unset]{@link ARIA_hook_unset} - see {@link ARIA_hook} for full details). The
 * name of the hook is always the un-prefixed WAI-ARIA attribute in lower case
 * after any mapping has occurred (see
 * [jQuery.ariaMap]{@link external:jQuery.ariaMap}). If you are ever in doubt,
 * the easiest way to know the key is to slice the normalised value:
 * <code>$.normaliseAria(__WAI-ARIA_ATTRIBUTE__).slice(5)</code> (see
 * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria} for more
 * information).
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
 *         var intVal = (Math.max(1, Math.floor(value));
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
        set: function (element, value) {

            if ((/^false$/i).test(value)) {
                element.removeAttribute("aria-hidden");
            } else {
                element.setAttribute("aria-hidden", value);
            }

        }

    }

};
