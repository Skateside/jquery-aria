/*jslint
    this
*/
/*global
    $
*/

/**
 * Sets the role of all elements in the collection or gets the role of the first
 * element in the collection, depending on whether or not the <code>role</code>
 * argument is provided. As [jQuery#role]{@link external:jQuery#role} is just a
 * wrapper for [jQuery#attr]{@link http://api.jquery.com/attr/}, the
 * <code>role</code> parameter can actually be any value type that the official
 * documentation mentions.
 * <br><br>
 * According to the WAI-ARIA specs, an element can have mutliple roles as a
 * space-separated list. This method will only set the role attribute to the
 * given string when setting. If you want to modify the roles, use
 * [jQuery#addRole]{@link external:jQuery#addRole} and
 * [jQuery#removeRole]{@link external:jQuery#removeRole}.
 *
 * @memberof external:jQuery
 * @instance
 * @alias    role
 * @param    {Attribute_Callback|String} [role]
 *           Role to get or function to set the role.
 * @return   {jQuery|String|undefined}
 *           Either the jQuery object representing the elements that were
 *           modified or the role value.
 *
 * @example
 * // Markup is:
 * // <div id="one"></div>
 * // <div id="two"></div>
 *
 * $("#one").role("presentation"); // -> jQuery(<div id="one">)
 *
 * // Now markup is:
 * // <div id="one" role="presentation"></div>
 * // <div id="two"></div>
 *
 * $("#one").role(); // -> "presentation"
 * $("#two").role(); // -> undefined
 *
 * @example <caption>Setting a role with a function</caption>
 * // Markup is:
 * // <div id="one" role="button"></div>
 *
 * $("#one").role(function (index, current) {
 *     return current + " tooltip";
 * });
 *
 * // Now markup is:
 * // <div id="one" role="button tooltip"></div>
 */
$.fn.role = function (role) {

    "use strict";

    return role === undefined
        ? this.attr("role")
        : this.attr("role", role);

};
