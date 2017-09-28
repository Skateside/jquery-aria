describe("handlers." + HANDLER_STATE, function () {

    describe("read", function () {

        it("should return false for falsy values", function () {

            [
                false,
                0,
                "0",
                "false",
                "FALSE"
            ].forEach(function (item) {
                chai.assert.isFalse(handlers[HANDLER_STATE].read(item));
            });

        });

        it("should return true for truthy values", function () {

            [
                true,
                1,
                "1",
                "true",
                "TRUE"
            ].forEach(function (item) {
                chai.assert.isTrue(handlers[HANDLER_STATE].read(item));
            });

        });

        it("should return \"mixed\" for \"mixed\"", function () {

            [
                "mixed",
                "MIXED"
            ].forEach(function (item) {
                chai.assert.equal(handlers[HANDLER_STATE].read(item), "mixed");
            });

        });

        it("it should return true for unrecognised values", function () {

            [
                2,
                "orange",
                {},
                []
            ].forEach(function (item) {
                chai.assert.isTrue(handlers[HANDLER_STATE].read(item));
            });

        });

    });

    describe("set", function () {

        it("should set a state", function () {

            var div = document.createElement("div");

            handlers[HANDLER_STATE].set(div, "busy", 1);
            chai.assert.isTrue(div.hasAttribute("aria-busy"));
            chai.assert.equal(div.getAttribute("aria-busy"), "true");

        });

    });

    describe("get", function () {

        it("should get a boolean or a string", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", "true");
            div.setAttribute("aria-checked", "mixed");
            div.setAttribute("aria-disabled", "false");

            chai.assert.isTrue(handlers[HANDLER_STATE].get(div, "busy"));
            chai.assert.equal(handlers[HANDLER_STATE].get(div, "checked"), "mixed");
            chai.assert.isFalse(handlers[HANDLER_STATE].get(div, "disabled"));

        });

        it("should return undefined if the attribute isn't there", function () {

            var div = document.createElement("div");

            chai.assert.isUndefined(handlers[HANDLER_STATE].get(div, "busy"));

        });

    });

});
