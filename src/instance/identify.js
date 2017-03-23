/*jslint
    this
*/
/*global
    $,
    isElement
*/

var count = 0;

/**
 * Identifies the first element in the collection by getting its ID. If the
 * element doesn't have an ID attribute, a unique on is generated and assigned
 * before being returned. If the collection does not have a first element then
 * <code>undefined</code> is returned.
 * <br><br>
 * IDs are a concatenation of "anonymous" and a hidden counter that is increased
 * each time. If the ID already exists on the page, that ID is skipped and not
 * assigned to a second element.
 *
 * @memberof external:jQuery
 * @instance
 * @alias    identify
 * @return   {String|undefined}
 *           The ID of the first element or undefined if there is no first
 *           element.
 *
 * @example <caption>Identifying elements</caption>
 * // Markup is
 * // <div class="one"></div>
 * // <span class="one"></span>
 *
 * $(".one").identify(); // -> "anonymous0"
 *
 * // Now markup is:
 * // <div class="one" id="anonymous0"></div>
 * // <span class="one"></span>
 * // Running $(".one").identify(); again would not change the markup.
 *
 * @example <caption>Existing IDs are not duplicated</caption>
 * // Markup is:
 * // <div class="two" id="anonymous1"><!-- manually set --></div>
 * // <div class="two"></div>
 * // <div class="two"></div>
 *
 * $(".two").each(function () {
 *     $(this).identify();
 * });
 *
 * // Now markup is:
 * // <div class="two" id="anonymous1"><!-- manually set --></div>
 * // <div class="two" id="anonymous0"></div>
 * // <div class="two" id="anonymous2"></div>
 */
$.fn.identify = function () {

    "use strict";

    var element = this[0];
    var isAnElement = isElement(element);
    var id = isAnElement
        ? element.id
        : undefined;

    if (isAnElement && !id) {

        do {

            id = "anonymous" + count;
            count += 1;

        } while (document.getElementById(id));

        element.id = id;

    }

    return id;

};
