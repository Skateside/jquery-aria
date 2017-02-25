var IDENTIFY_PREFIX = "anonymous";
var count = 0;

/**
 * Identifies all elements in the collection by getting all their IDs. If the
 * elements don't have an ID attribute, a unique one is generated. The
 * <code>jQuery</code> object is returned to allow chaining.
 * <br><br>
 * IDs are a concatenation of "anonymous" and a hidden counter that is increased
 * each time. If the ID already exists on the page, that ID is skipped and not
 * assigned to a second element.
 * <br><br>
 * If a numeric <code>index</code> is passed, the ID of the element at that
 * index is returned as a string. If there is no element at that
 * <code>index</code>, <code>undefined</code> is returned. Any
 * <code>index</code> that is not numeric (see
 * [jQuery.isNumeric]{@link https://api.jquery.com/jQuery.isNumeric/}) is
 * ignored and treated as if no <code>index</code> were given.
 *
 * @memberof external:jQuery
 * @instance
 * @alias identify
 * @param  {Number|String} [index]
 *         Index of the matching element whose ID should be returned.
 * @return {jQuery|String|undefined}
 *         jQuery object of the identified elements or the ID of the requested
 *         element.
 *
 * @example <caption>Identifying elements</caption>
 * // Markup is
 * // <div class="one"></div>
 * // <span class="one"></span>
 *
 * $(".one").identify(); // -> jQuery(<div>, <span>)
 *
 * // Now markup is:
 * // <div class="one" id="anonymous0"></div>
 * // <span class="one" id="anonymous1"></span>
 * // Running $(".one").identify(); again would not change the markup.
 *
 * @example <caption>Existing IDs are not duplicated</caption>
 * // Markup is:
 * // <div class="two" id="anonymous1"><!-- manually set --></div>
 * // <div class="two"></div>
 * // <div class="two"></div>
 *
 * $(".two").identify();
 *
 * // Now markup is:
 * // <div class="two" id="anonymous1"><!-- manually set --></div>
 * // <div class="two" id="anonymous0"></div>
 * // <div class="two" id="anonymous2"></div>
 *
 * @example <caption>Returning the ID</caption>
 * // Markup is:
 * // <div class="three" id="first"></div>
 * // <span class="three" id="second"></span>
 *
 * $(".three").identify(0); // -> "first"
 * $(".three").identify(1); // -> "second"
 * $(".three").identify(2); // -> undefined
 * // Numeric strings also work:
 * $(".three").identify("0"); // -> "first"
 */
$.fn.identify = function (index) {

    var identified = [];
    var results = this.each(function (i, element) {

        var id = element.id;

        if (!id) {

            do {

                id = IDENTIFY_PREFIX + count;
                count += 1;

            // NOTE: document.getElementById(id) is faster, but jQuery's $
            // function can handle things like frames which could affect the
            // results.
            } while ($("#" + id).length);

            element.id = id;

        }

        identified.push(id);

        return id;

    });

    return $.isNumeric(index)
        ? identified[index]
        : results;

};
