/**
 * A boolean or the string "mixed" (always in lower case). This type will
 * be undefined when trying to read a state that has not been set on the
 * element.
 *
 * @typedef {Boolean|String|undefined} ARIA_state
 *
 * @example
 * // Markup is
 * // <div id="one" aria-checked="true"></div>
 * // <div id="two" aria-checked="false"></div>
 * // <div id="three" aria-checked="mixed"></div>
 * // <div id="four"></div>
 *
 * $("#one").ariaState("checked");   // -> true
 * $("#two").ariaState("checked");   // -> false
 * $("#three").ariaState("checked"); // -> "mixed"
 * $("#four").ariaState("checked");  // -> undefined
 */
