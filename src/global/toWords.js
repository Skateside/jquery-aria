/**
 * Converts the given string into an array of the words. The <code>string</code>
 * argument is converted into a string before being split - see
 * {@link interpretString} for more information.
 *
 * @global
 * @private
 * @param   {String} string
 *          String (or other variable type) to break into words.
 * @return  {Array.<String>}
 *          Words from the string.
 *
 * @example
 * toWords("abc def");  // -> ["abc", "def"]
 * toWords("abc  def"); // -> ["abc", "def"]
 */
var toWords = function (string) {
    return interpretString(string).split(/\s+/);
};
