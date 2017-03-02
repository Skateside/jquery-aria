/**
 * Interprets the given object as a string. If the object is <code>null</code>
 * or <code>undefined</code>, an empty string is returned.
 *
 * @global
 * @private
 * @param   {?} string
 *          Object to interpret.
 * @return  {String}
 *          Interpreted string.
 *
 * @example
 * interpretString("1");       // -> "1"
 * interpretString(1);         // -> "1"
 * interpretString([1, 2]);    // -> "1,2"
 * interpretString(null);      // -> ""
 * interpretString(undefined); // -> ""
 * interpretString();          // -> ""
 */
var interpretString = function (string) {

    return (string === null || string === undefined)
        ? ""
        : String(string);

};
