/**
 * A hook for a WAI-ARIA attribute. Every property is optional so there is no
 * need to specify one to execute the default functionality.
 *
 * @typedef  {Object}          ARIA_hook
 * @property {ARIA_hook_set}   [set]
 *           Handles setting the attribute.
 * @property {ARIA_hook_get}   [get]
 *           Handles getting the attribute.
 * @property {ARIA_hook_has}   [has]
 *           Handlers checking whether or not the attribute is assigned.
 * @property {ARIA_hook_unset} [unset]
 *           Handles removing the attribute.
 */

/**
 * Handles the setting of a WAI-ARIA attribute. The function doesn't need to
 * return anything as it will completely handle the setting of the attribute.
 * <br><br>
 * When setting an attribute, feel free to use
 * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria} and
 * [jQuery#attr]{@link http://api.jquery.com/attr/} but do not use
 * [jQuery#aria]{@link external:jQuery#aria},
 * [jQuery#ariaRef]{@link external:jQuery#ariaRef} or
 * [jQuery#ariaState]{@link external:jQuery#ariaState} as this can create an
 * infinite loop.
 *
 * @typedef {Function}    ARIA_hook_set
 * @param   {HTMLElement} element
 *          Element whose attribute should be modified.
 * @param   {String}      value
 *          Value of the attribute.
 *
 * @example <caption>Setting a fictitious "volume" attribute</caption>
 * $.ariaHooks.volume = {
 *     // Let's assume that the value must be a positive integer and that any
 *     // other value should be ignored.
 *     set: function (element, value) {
 *         var posInt = Math.floor(Math.abs(value));
 *         if (!isNaN(posInt)) {
 *             element.setAttribute("aria-volume", posInt);
 *         }
 *     }
 * };
 */

/**
 * Handles the getting of a WAI-ARIA attribute. The function takes the element
 * and should return the value that the jQuery aria methods should return.
 * <br><br>
 * When getting an attribute, feel free to use
 * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria} and
 * [jQuery#attr]{@link http://api.jquery.com/attr/} but do not use
 * [jQuery#aria]{@link external:jQuery#aria},
 * [jQuery#ariaRef]{@link external:jQuery#ariaRef} or
 * [jQuery#ariaState]{@link external:jQuery#ariaState} as this can create an
 * infinite loop.
 *
 * @typedef {Function}    ARIA_hook_get
 * @param   {HTMLElement} element
 *          Element whose attribute value should be returned.
 * @return  {?}
 *          Value of the attribute.
 *
 * @example <caption>Getting a fictitious "volume" attribute</caption>
 * $.ariaHooks.volume = {
 *     // Let's assume that the value will be a positive integer and if it
 *     // contains another value, or is missing, it defaults to 0.
 *     get: function (element) {
 *         var value = element.getAttribute("aria-volume");
 *         return (value === null || isNaN(value) || value < 0)
 *             ? 0
 *             : Math.floor(value);
 *     }
 * };
 */

/**
 * Handles checking whether or not the WAI-ARIA attribute exists on the element
 * and it should return a boolean.
 * <br><br>
 * When checking for an attribute, feel free to use
 * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria}.
 *
 * @typedef {Function}    ARIA_hook_has
 * @param   {HTMLElement} element
 *          Element whose attribute should be checked.
 * @return  {Boolean}
 *          Whether or not the attribute exists on the element (true if it
 *          does, false otherwise).
 *
 * @example <caption>Checking for a fictitious "volume" attribute</caption>
 * $.ariaHooks.volume = {
 *     // Let's assume that the attribute has to contain a positive integer and
 *     // will be considered non-existent if it contains anything else.
 *     has: function (element) {
 *         var value = element.getAttribute("aria-volume");
 *         var intVal = parseInt(value, 10);
 *         return value !== null && intVal === +value && intVal <= 0;
 *     }
 * };
 */

/**
 * Handles unsetting a WAI-ARIA attribute from an element. This function does
 * not need to return anything.
 * <br><br>
 * When removing an attribute, feel free to use
 * [jQuery.normaliseAria]{@link external:jQuery.normaliseAria} and
 * [jQuery#removeAttr]{@link http://api.jquery.com/removeAttr/} but do not use
 * [jQuery#removeAria]{@link external:jQuery#removeAria},
 * [jQuery#removeAriaRef]{@link external:jQuery#removeAriaRef} or
 * [jQuery#removeAriaState]{@link external:jQuery#removeAriaState} as this can
 * create an infinite loop.
 *
 * @typedef {Function}    ARIA_hook_unset
 * @param   {HTMLElement} element
 *          Element whose attribute should be removed.
 *
 * @example <caption>Removing a fictitious "volume" attribute</caption>
 * $.ariaHooks.volume = {
 *     // Let's assume that there is also a "soundsetup" attribute and that it
 *     // requires the "volume" attribute to exist, thus if "volume" is removed,
 *     // "soundsetup" should be removed as well.
 *     unset: function (element) {
 *         element.removeAttribute("aria-volume");
 *         element.removeAttribute("aria-soundsetup");
 *     }
 * };
 */
