describe("handlers.property", function () {

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

});
