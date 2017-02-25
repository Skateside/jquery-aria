/**
 * This function handles all the heavy lifting of getting or setting WAI-ARIA
 * attributes. It is designed to be all that's necessary for
 * [jQuery#aria]{@link external:jQuery#aria},
 * [jQuery#ariaRef]{@link external:jQuery#ariaRef} and
 * [jQuery#ariaState]{@link external:jQuery#ariaState}. This function will check
 * its arguments to determine whether it should be used as a getter or a setter
 * and passes the appropriate arguments to the {@link handlers} methods based on
 * <code>type</code> (which will default to {@link handlers.property} if
 * ommitted or not recognised).
 * <br><br>
 * The return value is based on the type of action being performed. If this
 * function is setting then a jQuery object of the matches is returned (which is
 * almost always <code>jQelements</code>); if the function is a getter then the
 * results are returned for the first element in <code>jQelements</code>.
 * <br><br>
 * Although this description is not especially extensive, the code should be
 * very easy to follow and commented should there be any need to modify it. Once
 * the correct arguments are being passed to the appropriate {@link handlers}
 * method, they will take care of the rest.
 *
 * @global
 * @private
 * @param  {jQuery}            jQelements
 *         jQuery object to modify/access.
 * @param  {Object|String}     property
 *         Either WAI-ARIA names and values or the WAI-ARIA property name.
 * @param  {?}                 [value]
 *         Value to set.
 * @param  {String}            [type="property"]
 *         Optional attribute type.
 * @return {jQuery|ARIA_state}
 *         Either the jQuery object on which WAI-ARIA properties were set or the
 *         values of the WAI-ARIA properties.
 *
 * @example <caption>Setting a single property</caption>
 * // Markup is
 * // <div id="one"></div>
 *
 * var jQone = $("#one");
 * access(jQone, "controls", "two"); // -> jQuery(<div id="one">)
 *
 * // Now markup is
 * // <div id="one" aria-controls="two">
 *
 * @example <caption>Setting multiple references</caption>
 * // Markup is
 * // <div id="one"></div>
 * // <div id="two"></div>
 *
 * var jQone = $("#one");
 * access(jQone, {
 *     controls: $("div").eq(1)
 * }, "reference"); // -> jQuery(<div id="one">)
 *
 * // Now markup is
 * // <div id="one" aria-controls="two">
 * // <div id="two"></div>
 *
 * @example <caption>Getting a state</caption>
 * // Markup is
 * // <div id="one" aria-busy="true"></div>
 *
 * var jQone = $("#one");
 * access(jQone, "busy", undefined, "state"); // -> true
 */
function access(jQelements, property, value, type) {

    var tempProperty = property;
    var isPropertyObject = $.isPlainObject(property);
    var isGet = value === undefined && !isPropertyObject;

    // Make sure the property value is in the expected format: an object for
    // setting and a string for getting.
    if (!isGet && !isPropertyObject) {

        property = {};
        property[tempProperty] = value;

    } else if (isGet && isPropertyObject) {
        property = Object.keys(property)[0];
    }

    // If we don't have or don't recognise the type, default to "property".
    if (!type || !handlers[type]) {
        type = HANDLER_PROPERTY;
    }

    return isGet
        ? handlers[type].get(jQelements[0], property)
        : jQelements.each(function (index, element) {

            $.each(property, function (key, val) {
                handlers[type].set(element, key, val, index);
            });

        })

}
