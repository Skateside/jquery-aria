/**
 * Adds a role to a collection of elements. The role will not be added if it's
 * empty ("" or undefined), if the function response is empty or if the element
 * already has that role. In that way it's similar to
 * [jQuery#addClass]{@link https://api.jquery.com/addClass/}.
 *
 * @memberof external:jQuery
 * @instance
 * @alias addRole
 * @param  {Attribute_Callback|String} role
 *         Role(s) to add to the matching elements or function to generate the
 *         role(s) to add.
 * @return {jQuery}
 *         jQuery object representing the matching elements.
 *
 * @example <caption>Adding a role</caption>
 * // Markup is:
 * // <div class="one" role="presentation"></div>
 * // <div class="one"></div>
 *
 * $(".one").addRole("alert"); // -> jQuery(<div>, <div>)
 *
 * // Now markup is:
 * // <div class="one" role="presentation alert"></div>
 * // <div class="one" role="alert"></div>
 *
 * @example <caption>Adding a role with a function</caption>
 * // Markup is:
 * // <div class="one" role="presentation"></div>
 *
 * $(".one").addRole(function (index, current) {
 *     return "alert combobox";
 * });
 *
 * // Now markup is:
 * // <div class="one" role="presentation alert combobox"></div>
 */
$.fn.addRole = function (role) {

    var isFunction = $.isFunction(role);

    return this.role(function (index, current) {

        var value = isFunction
            ? role.call(this, index, current)
            : role;
        var roles = toWords(current);

        toWords(value).forEach(function (val) {

            if (
                val !== ""
                && val !== undefined
                && roles.indexOf(val) < 0
            ) {
                roles.push(val);
            }

        });

        return roles.join(" ");

    });

};
