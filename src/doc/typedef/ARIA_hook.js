/**
 * A hook for a WAI-ARIA attribute. Every property is optional so there is no
 * need to specify one to execute the default functionality.
 * <br><br>
 * Be aware that these hooks only affect the aria methods;
 * [jQuery#attr]{@link http://api.jquery.com/attr/} and
 * [jQuery#prop]{@link http://api.jquery.com/prop/} will not be affected by any
 * changes here. There are similar <code>jQuery.attrHooks</code> and
 * <code>jQuery.propHooks</code> (for set and get) that work in the same way if
 * you need to completely control attribute/property setting.
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
 * Handles the setting of a WAI-ARIA attribute. If the function returns a value,
 * that value is used to set the attribute; returning null, undefined, or not
 * returning anything will prevent the normal attribute setting process from
 * completing.
 * <br><br>
 * When setting an attribute, please do not use
 * [jQuery#aria]{@link external:jQuery#aria},
 * [jQuery#ariaRef]{@link external:jQuery#ariaRef} or
 * [jQuery#ariaState]{@link external:jQuery#ariaState} as this can create an
 * infinite loop.
 *
 * @typedef {Function}    ARIA_hook_set
 * @param   {HTMLElement}           element
 *          Element whose attribute should be modified.
 * @param   {Boolean|Number|String} value
 *          Value of the attribute in the form given to the aria function.
 * @param   {String}                attribute
 *          Full attribute name, lower case and including "aria-" prefix.
 * @return  {?}
 *          Possible conversion of the value.
 *
 * @example <caption>Setting fictitious "volume" or "soundsetup" attributes</caption>
 * $.ariaHooks.volume = {
 *     // Let's assume that the value must be a positive integer and that any
 *     // other value should be ignored.
 *     set: function (element, value, attribute) {
 *         var posInt = Math.floor(Math.abs(value));
 *         return isNaN(posInt)
 *             ? undefined
 *             : posInt;
 *     }
 * };
 * $.ariaHooks.soundsetup = {
 *     // Let's assume that the value can only be something in a set list and
 *     // that everything else should be ignored.
 *     set: function (element, value, attribute) {
 *         var values = ["mono", "stereo", "5.1"];
 *         return values.indexOf(value) > -1
 *             ? value
 *             : undefined;
 *     }
 * };
 *
 * // Markup is:
 * // <div id="one"></div>
 * // <div id="two"></div>
 *
 * $("#one").aria({
 *     volume: 5,
 *     soundsetup: "mono"
 * });
 * $("#two").aria({
 *     volume: "loud",
 *     soundsetup: "legendary"
 * });
 *
 * // Now markup is:
 * // <div id="one" aria-volume="5" aria-soundsetup="mono"></div>
 * // <div id="two"></div>
 */

/**
 * Handles the getting of a WAI-ARIA attribute. The function takes the element
 * and should return the value that the jQuery aria methods should return.
 * <br><br>
 * When getting an attribute, please do not use
 * [jQuery#aria]{@link external:jQuery#aria},
 * [jQuery#ariaRef]{@link external:jQuery#ariaRef} or
 * [jQuery#ariaState]{@link external:jQuery#ariaState} as this can create an
 * infinite loop.
 *
 * @typedef {Function}    ARIA_hook_get
 * @param   {HTMLElement} element
 *          Element whose attribute value should be returned.
 * @param   {String}      attribute
 *          Full attribute name, lower case and including "aria-" prefix.
 * @return  {?Boolean|Number|String}
 *          Value of the attribute.
 *
 * @example <caption>Getting a fictitious "volume" attribute</caption>
 * $.ariaHooks.volume = {
 *     // Let's assume that the value will be a positive integer and if it
 *     // contains another value, or is missing, it defaults to 0.
 *     get: function (element, attribute) {
 *         var value = element.getAttribute(attribute);
 *         return (value === null || isNaN(value) || value < 0)
 *             ? 0
 *             : Math.floor(value);
 *     }
 * };
 *
 * // Markup is:
 * // <div id="one" aria-volume="5"></div>
 * // <div id="two" aria-volume="loud"></div>
 *
 * $("#one").aria("volume"); // -> 5
 * $("#two").aria("volume"); // -> 0
 */

/**
 * Handles checking whether or not the WAI-ARIA attribute exists on the element
 * and it should return a boolean. Currently this functionality is not exposed
 * in an aria method, but the existence of a WAI-ARIA attribute will be checked
 * before getting occurs (and the {@link ARIA_hook_get} function executes).
 *
 * @typedef {Function}    ARIA_hook_has
 * @param   {HTMLElement} element
 *          Element whose attribute should be checked.
 * @param   {String}      attribute
 *          Full attribute name, lower case and including "aria-" prefix.
 * @return  {Boolean}
 *          Whether or not the attribute exists on the element (true if it
 *          does, false otherwise).
 *
 * @example <caption>Checking for a fictitious "volume" attribute</caption>
 * $.ariaHooks.volume = {
 *     get: function (element, attribute) {
 *         console.log("hi");
 *         return element.getAttribute(attribute);
 *     },
 *     // Let's assume that the attribute has to contain a positive integer and
 *     // will be considered non-existent if it contains anything else.
 *     has: function (element, attribute) {
 *         var value = element.getAttribute(attribute);
 *         var intVal = parseInt(value, 10);
 *         return value !== null && intVal === +value && intVal <= 0;
 *     }
 * };
 *
 * // Markup is:
 * // <div id="one" aria-volume="5"></div>
 * // <div id="two" aria-volume="loud"></div>
 *
 * $("#one").aria("volume");
 * // Logs: "hi"
 * // -> "5"
 * $("#two").aria("volume"); // -> undefined
 */

/**
 * Checks to see if the WAI-ARIA attribute should be removed. If the function
 * returns <code>true</code> (or a truthy value) then the attribute will be
 * removed, a falsy value will prevent the attribute being removed through the
 * aria methods (although there is nothing stopping it being removed in another
 * way or even through the function itself).
 * <br><br>
 * When removing an attribute, please do not use
 * [jQuery#removeAria]{@link external:jQuery#removeAria},
 * [jQuery#removeAriaRef]{@link external:jQuery#removeAriaRef} or
 * [jQuery#removeAriaState]{@link external:jQuery#removeAriaState} as this can
 * create an infinite loop.
 *
 * @typedef {Function}    ARIA_hook_unset
 * @param   {HTMLElement} element
 *          Element whose attribute should be removed.
 * @param   {String}      attribute
 *          Full attribute name, lower case and including "aria-" prefix.
 * @return  {Boolean}
 *          Whether or not the attribute should be removed.
 *
 * @example <caption>Removing a fictitious "volume" attribute</caption>
 * $.ariaHooks.volume = {
 *     // Let's assume that there is also a "soundsetup" attribute and that it
 *     // requires the "volume" attribute to exist, thus if "volume" is removed,
 *     // "soundsetup" should be removed as well.
 *     unset: function (element, attribute) {
 *         element.removeAttribute("aria-soundsetup");
 *         return true;
 *     }
 * };
 *
 * // Markup is:
 * // <div id="one" aria-volume="5" aria-soundsetup="mono"></div>
 *
 * $("#one").removeAria("volume");
 *
 * // Now markup is
 * // <div id="one"></div>
 */
