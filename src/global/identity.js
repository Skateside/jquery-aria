/**
 * An identity function that simply returns whatever it is given without
 * modifying it. This can be useful for cases when a modification function is
 * needed but optional.
 *
 * @global
 * @private
 * @param   {?} x
 *          Object to return.
 * @return  {?}
 *          Original object.
 *
 * @example
 * identity("a");           // -> "a"
 * identity("a", "b");      // -> "a", only first argument is returned.
 * identity.call("b", "a"); // -> "a", context has no effect.
 */
var identity = function (x) {

    "use strict";

    return x;

};
