/**
 * Returns <code>true</code> if the given <code>element</code> is an HTML
 * element.
 *
 * @global
 * @private
 * @param  {?} element
 *         Object to test.
 * @return {Boolean}
 *         true if <code>element</code> is an HTMLElement.
 *
 * @example
 * isElement(document.createElement("div")); // -> true
 * isElement(document.body); // -> true
 * isElement(document.createTextNode("")); // -> false
 * isElement($("body")); // -> false
 * isElement($("body")[0]); // -> true
 */
var isElement = function (element) {
    return element instanceof HTMLElement;
};
