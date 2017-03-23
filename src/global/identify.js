/*global
    $
*/

/**
 * Helper function for identifying the given <code>reference</code>. The ID of
 * the first match is returned - see
 * [jQuery#identify]{@link external:jQuery#identify} for full details.
 *
 * @global
 * @private
 * @param   {jQuery_param} reference
 *          Element to identify.
 * @return  {String}
 *          ID of the element.
 */
var identify = function (reference) {

    "use strict";

    return $(reference).identify();

};
