describe("handlers." + HANDLER_PROPERTY, function () {

    describe("parse", function () {

        it("should parse an attribute name", function () {

            chai.assert.deepEqual(
                handlers[HANDLER_PROPERTY].parse("aria-busy"),
                {full: "aria-busy", stem: "busy"}
            );

        });

        it("should normalise the attribute", function () {

            var expected = {full: "aria-busy", stem: "busy"};

            chai.assert.deepEqual(
                handlers[HANDLER_PROPERTY].parse("aria-busy"),
                expected
            );
            chai.assert.deepEqual(
                handlers[HANDLER_PROPERTY].parse("busy"),
                expected
            );
            chai.assert.deepEqual(
                handlers[HANDLER_PROPERTY].parse("BUSY"),
                expected
            );

        });

    });

    describe("set", function () {

        it("should set the aria attribute", function () {

            var div = document.createElement("div");

            handlers[HANDLER_PROPERTY].set(div, "busy", true);

            chai.assert.equal(div.getAttribute("aria-busy"), "true");

        });

        it("should do nothing if the first argument isn't an element", function () {

            var o = {};

            handlers[HANDLER_PROPERTY].set(o, "busy", true);
            chai.assert.isUndefined(o["aria-busy"]);
            chai.assert.isUndefined(o.attributes);

        });

        it("should allow value to be a function", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", "true");
            var context;
            var index;
            var value;

            handlers[HANDLER_PROPERTY].set(div, "busy", function (i, v) {

                context = this;
                index = i;
                value = v;

                return false;

            }, 0);

            chai.assert.equal(context, div);
            chai.assert.equal(index, 0);
            chai.assert.equal(value, "true");
            chai.assert.equal(div.getAttribute("aria-busy"), "false");

        });

        it("should allow the value to be converted", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", "true");
            var value;

            handlers[HANDLER_PROPERTY].set(
                div,
                "busy",
                "true",
                undefined,
                function (v) {

                    value = v;
                    return v.toUpperCase();

                }
            );

            chai.assert.equal(value, "true");
            chai.assert.notEqual(div.getAttribute("aria-busy"), "true");
            chai.assert.equal(div.getAttribute("aria-busy"), "TRUE");

        });

        it("should do nothing if value is null or undefined", function () {

            var div = document.createElement("div");

            handlers[HANDLER_PROPERTY].set(div, "busy", true);
            chai.assert.equal(div.getAttribute("aria-busy"), "true");

            handlers[HANDLER_PROPERTY].set(div, "busy", null);
            chai.assert.equal(div.getAttribute("aria-busy"), "true");

            handlers[HANDLER_PROPERTY].set(div, "busy", undefined);
            chai.assert.equal(div.getAttribute("aria-busy"), "true");

            handlers[HANDLER_PROPERTY].set(div, "busy", function () {});
            chai.assert.equal(div.getAttribute("aria-busy"), "true");

            handlers[HANDLER_PROPERTY].set(div, "busy", function () {
                return null;
            });
            chai.assert.equal(div.getAttribute("aria-busy"), "true");

        });

        it("should allow hooks to modify the result", function () {

            var div = document.createElement("div");
            var element;
            var value;
            var attribute;

            $.ariaHooks.hook = {

                set: function (e, v, a) {

                    element = e;
                    value = v;
                    attribute = a;

                    return v + "_" + v;

                }

            };

            handlers[HANDLER_PROPERTY].set(div, "hook", "one");
            chai.assert.equal(element, div);
            chai.assert.equal(value, "one");
            chai.assert.equal(attribute, "aria-hook");
            chai.assert.equal(div.getAttribute("aria-hook"), "one_one");

            handlers[HANDLER_PROPERTY].set(div, "hook", "one", undefined, function (v) {
                return v.toUpperCase();
            });
            chai.assert.equal(div.getAttribute("aria-hook"), "ONE_ONE");

            delete $.ariaHooks.hook;

        });

    });

    describe("has", function () {

        it("should check that the element has the attribute", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);

            chai.assert.isTrue(handlers[HANDLER_PROPERTY].has(div, "busy"));
            chai.assert.isFalse(handlers[HANDLER_PROPERTY].has(div, "checked"));

        });

        it("should always return false for not an element", function () {

            var o = {};
            o["aria-busy"] = "true";

            chai.assert.isFalse(handlers[HANDLER_PROPERTY].has(o, "busy"));

        });

        it("should allow the result to be changed by a hook", function () {

            var div1 = document.createElement("div");
            div1.setAttribute("aria-hook", "one");
            var div2 = document.createElement("div");
            div2.setAttribute("aria-hook", "1");
            var element;
            var attribute;

            $.ariaHooks.hook = {

                has: function (e, a) {

                    element = e;
                    attribute = a;

                    return e.hasAttribute(a) && !isNaN(e.getAttribute(a));

                }

            };

            var has1 = handlers[HANDLER_PROPERTY].has(div1, "hook");
            chai.assert.isFalse(has1);
            chai.assert.equal(element, div1);
            chai.assert.equal(attribute, "aria-hook");
            var has2 = handlers[HANDLER_PROPERTY].has(div2, "hook");
            chai.assert.isTrue(has2);
            chai.assert.equal(element, div2);
            chai.assert.equal(attribute, "aria-hook");

            delete $.ariaHooks.hook;

        });

    });

    describe("get", function () {

        it("should get the value of the attribute", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);

            chai.assert.equal(handlers[HANDLER_PROPERTY].get(div, "busy"), "true");

        });

        it("should always return a string", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-a", 1);
            div.setAttribute("aria-b", "1");
            div.setAttribute("aria-c", true);

            chai.assert.isTrue(typeof handlers[HANDLER_PROPERTY].get(div, "a") === "string");
            chai.assert.isTrue(typeof handlers[HANDLER_PROPERTY].get(div, "b") === "string");
            chai.assert.isTrue(typeof handlers[HANDLER_PROPERTY].get(div, "c") === "string");

        });

        it("should return undefined if the attribute doesn't exist or not an element", function () {

            var div = document.createElement("div");

            chai.assert.isUndefined(handlers[HANDLER_PROPERTY].get(div, "busy"));
            chai.assert.isUndefined(handlers[HANDLER_PROPERTY].get({}, "busy"));

        });

        it("should allow a hook to get the value", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-hook", "true");
            var element;
            var attribute;

            $.ariaHooks.hook = {

                get: function (e, a) {

                    element = e;
                    attribute = a;
                    var value = e.getAttribute(a);
                    return value + "_" + value;

                }

            };

            chai.assert.equal(handlers[HANDLER_PROPERTY].get(div, "hook"), "true_true");
            chai.assert.equal(element, div);
            chai.assert.equal(attribute, "aria-hook");

            delete $.ariaHooks.hook;

        });

        it("should bail early if the attribute does not exist", function () {

            var div = document.createElement("div");
            var element;
            var attribute;

            $.ariaHooks.hook = {

                get: function (e, a) {

                    element = e;
                    attribute = a;
                    var value = e.getAttribute(a);
                    return value + "_" + value;

                }

            };

            chai.assert.isUndefined(handlers[HANDLER_PROPERTY].get(div, "hook"));
            chai.assert.isUndefined(element);
            chai.assert.isUndefined(attribute);

            delete $.ariaHooks.hook;

        });

    });

    describe("unset", function () {

        it("should remove an attribute", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);

            chai.assert.isTrue(div.hasAttribute("aria-busy"));
            handlers[HANDLER_PROPERTY].unset(div, "busy");
            chai.assert.isFalse(div.hasAttribute("aria-busy"));

        });

        it("should do nothing if not given an element", function () {

            var o = {};
            o["aria-busy"] = "true";
            o.hasAttribute = function () { return true; };

            handlers[HANDLER_PROPERTY].unset(o, "busy");
            chai.assert.equal(o["aria-busy"], "true");
            chai.assert.isTrue(o.hasAttribute("aria-busy"));

        });

        it("should allow a hook to determin whether the attribute can be removed", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-hook", "true");
            var element;
            var attribute;

            $.ariaHooks.hook = {

                unset: function (e, a) {

                    element = e;
                    attribute = a;

                    return false;

                }

            };

            handlers[HANDLER_PROPERTY].unset(div, "hook");
            chai.assert.equal(element, div);
            chai.assert.equal(attribute, "aria-hook");
            chai.assert.isTrue(div.hasAttribute("aria-hook"));

            delete $.ariaHooks.hook;

        });

    });

});
