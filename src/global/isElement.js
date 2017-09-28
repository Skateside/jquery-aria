/**
 * Returns <code>true</code> if the given <code>element</code> is an HTML
 * element.
 *
 * @global
 * @private
 * @param   {?} element
 *          Object to test.
 * @return  {Boolean}
 *          true if <code>element</code> is an HTMLElement.
 *
 * @example
 * isElement(document.createElement("div")); // -> true
 * isElement(document.body); // -> true
 * isElement(document.createTextNode("")); // -> false
 * isElement($("body")); // -> false
 * isElement($("body")[0]); // -> true
 */
var isElement = function (element) {

    "use strict";

    // relying on polymorphism rather than instanceof is usually wise, but in
    // this situation it'd be so much eaasier to simply type:
    // return element instanceof HTMLElement;
    return (
        element !== null
        && element !== undefined
        && (/^\[object\sHTML(?:[A-Z][a-z]+)?Element\]$/).test(element)
        && typeof element.nodeName === "string"
        && typeof element.nodeType === "number"
    );

};
