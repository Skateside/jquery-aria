/**
 * Modifies a function so that the results are retrieved from a cache if
 * possible rather than from executing the function again. The cache is publicly
 * exposed (as the property <code>cache</code>) to allow it to be cleared,
 * forcing the function to re-execute.
 * <br><br>
 * If defined, the <code>resolver</code> is passed the same arguments as the
 * <code>handler</code>; it should return a string and that string will be used
 * as the key for <code>cache</code>. If a <code>resolver</code> isn't defined,
 * or isn't a function, the arguments are simply joined together as a
 * comma-separated string.
 *
 * @global
 * @private
 * @param   {Function} handler
 *          Function to convert.
 * @param   {Function} [resolver]
 *          Optional function for working out the key for the cache.
 * @return  {Function}
 *          Converted function.
 *
 * @example <caption>Basic example</caption>
 * var increase = function (number) {
 *     console.log(number);
 *     return number + 1;
 * };
 * var memIncrease = memoise(increase);
 *
 * memIncrease(1);
 * // Logs: 1
 * // -> 2
 * memIncrease(1); // -> 2
 * memincrease(2);
 * // Logs: 2
 * // -> 3
 * memIncrease(1); // -> 1
 * memIncrease.cache; // -> {"1": 2, "2": 3}
 *
 * @example <caption>Specifying a resolver</caption>
 * var sum = function (numbers) {
 *     return numbers.reduce(function (prev, curr) {
 *         return prev + curr;
 *     }, 0);
 * };
 * var memSum = memoise(sum, function (numbers) {
 *     return JSON.stringify(numbers);
 * });
 * memSum([1, 2, 3]); // -> 6
 * memSum.cache; // -> {"[1,2,3]": 6}
 */
var memoise = function (handler, resolver) {

    var hasOwn = Object.prototype.hasOwnProperty;
    var slice = Array.prototype.slice;

    handler.cache = {};

    return function () {

        var args = slice.call(arguments);
        var key = typeof resolver === "function"
            ? resolver.apply(undefined, args)
            : args.join(",");
        var response = handler.cache[key];

        if (!hasOwn.call(handler.cache, key)) {

            response = handler.apply(this, args);
            handler.cache[key] = response;

        }

        return response;

    };

};
