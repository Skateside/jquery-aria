/**
 * Removes roles from the collection of elements. If the method is called
 * without any arguments then the role attribute itself is removed. Be aware
 * that this is not the same as passing a function which returns undefined -
 * such an action will have no effect.
 *
 * @memberof external:jQuery
 * @instance
 * @alias removeRole
 * @param  {Attribute_Callback|String} [role]
 *         Role(s) to remove or a function to generate the role(s) to remove.
 * @return {jQuery}
 *         jQuery object representing the matched elements.
 *
 * @example <caption>Removing a role</caption>
 * // Markup is:
 * // <div class="one" role="presentation alert"></div>
 * // <div class="one" role="alert"></div>
 *
 * $(".one").removeRole("alert"); // -> jQuery(<div>, <div>)
 *
 * // Now markup is:
 * // <div class="one" role="presentation"></div>
 * // <div class="one" role=""></div>
 *
 * @example <caption>Completely removing a role</caption>
 * // Markup is:
 * // <div class="one" role="presentation alert"></div>
 * // <div class="one" role="alert"></div>
 *
 * $(".one").removeRole(); // -> jQuery(<div>, <div>)
 *
 * // Now markup is:
 * // <div class="one"></div>
 * // <div class="one"></div>
 *
 * @example <caption>Removing a role with a function</caption>
 * // Markup is:
 * // <div class="one" role="presentation alert combobox"></div>
 *
 * $(".one").removeRole(function (index, current) {
 *     return current
 *         .split(/\s+/)
 *         .filter(function (role) {
 *             return role.indexOf("a") > -1;
 *         })
 *         .join(" ");
 *     // "presentation alert"
 * });
 *
 * // Now markup is:
 * // <div class="one" role="combobox"></div>
 */
$.fn.removeRole = function (role) {

    var isFunction = $.isFunction(role);

    return role === undefined
        ? this.removeAttr("role")
        : this.role(function (index, current) {

            var value = isFunction
                ? role.call(this, index, current)
                : role;
            var values = toWords(value);

            return toWords(current)
                .filter(function (aRole) {
                    return values.indexOf(aRole) < 0;
                })
                .join(" ");

        });

};
