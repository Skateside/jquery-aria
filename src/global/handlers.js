var HANDLER_PROPERTY = "property";
var HANDLER_REFERENCE = "reference";
var HANDLER_STATE = "state";

/**
 * Handlers for properties, references and states. Each handler has at least a
 * <code>get</code> and <code>set</code> method to write and read the values.
 * <code>has</code> methods check whether the property exists,
 * <code>unset</code> removes the property.
 *
 * {@link handlers.reference} and {@link handlers.state} defer to
 * {@link handlers.property} (they don't inherit from {@link handlers.property}
 * but they may do in another implementation - any functionality they don't have
 * will be taken from {@link handlers.property}).
 *
 * @global
 * @namespace
 * @private
 */
var handlers = {};
