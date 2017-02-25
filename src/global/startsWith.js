/**
 * A fallback for older browsers that do not understand
 * [String#startsWith]{@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith}
 * without modifiying <code>String.prototype</code> unnecessarily.
 *
 * @global
 * @private
 * @type   {Function}
 * @param  {String} text
 *         String to search for.
 * @param  {Number} [offset=0]
 *         Offset from which to start.
 * @return {Boolean}
 *         True if the string starts with <code>text</code>, false otherwise.
 *
 * @example
 * startsWith.call("abcdef", "abc"); // -> true
 */
var startsWith = String.prototype.startsWith || function (text, offset) {
    return this.indexOf(text, offset) === 0;
};
