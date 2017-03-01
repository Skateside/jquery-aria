/**
 * The [jQuery#aria]{@link external:jQuery#aria},
 * [jQuery#ariaRef]{@link external:jQuery#ariaRef} and
 * [jQuery#ariaState]{@link external:jQuery#ariaState} methods all take
 * functions to set their value. The functions all have the same signature,
 * described here. It is important to remember that the value this function
 * returns will be treated as if it had originally been passed to the
 * function. See
 * [jQuery#attr]{@link http://api.jquery.com/attr/#attr-attributeName-function}
 * for more information and examples.
 *
 * @callback Attribute_Callback
 * @this     HTMLElement
 *           The element being referenced.
 * @param    {Number} index
 *           The index of the current element from within the overall jQuery
 *           collection.
 * @param    {String|undefined} attr
 *           Current attribute value (undefined if the element does not
 *           currently have the attribute assigned).
 * @return   {String}
 *           The value that should be passed to the function.
 *
 * @example
 * $("#one").aria("label", function (i, attr) {
 *     return "Test";
 * });
 * // is the same as
 * $("#one").aria("label", "Test");
 *
 * @example <caption>Elements without the attribute pass undefined</caption>
 * // Markup is
 * // <div id="one"></div>
 *
 * $("#one").aria("label", function (i, attr) {
 *     return Object.prototype.toString.call(attr);
 * });
 *
 * // Now markup is
 * // <div id="one" aria-label="[object Undefined]"></div>
 */
