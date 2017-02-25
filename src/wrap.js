/**
 * @external jQuery
 */

/**
 * Alerts a message
 *
 * @param {String} msg
 *        The message to alert.
 * @memberof external:jQuery
 *
 * @example
 * $.alertMsg("hello world");
 * // Alerts "hello world"
 */
$.alertMsg = function (msg) {
    window.alert(msg);
};
