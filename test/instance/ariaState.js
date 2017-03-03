describe("jQuery#ariaState", function () {

    it("should set WAI-ARIA attributes by state", function () {

        var jQdiv = $("<div></div>");

        jQdiv.ariaState("aria-busy", true);
        chai.assert.equal(jQdiv[0].getAttribute("aria-busy"), "true");

        jQdiv.ariaState({
            "aria-checked": true,
            "aria-hidden": true
        });
        chai.assert.equal(jQdiv[0].getAttribute("aria-checked"), "true");
        chai.assert.equal(jQdiv[0].getAttribute("aria-hidden"), "true");

    });

    it("should auto-prefix WAI-ARIA attributes", function () {

        var jQdiv = $("<div></div>");

        jQdiv.ariaState("busy", true);
        chai.assert.equal(jQdiv[0].getAttribute("aria-busy"), "true");

        jQdiv.ariaState({
            "checked": true,
            "hidden": true
        });
        chai.assert.equal(jQdiv[0].getAttribute("aria-checked"), "true");
        chai.assert.equal(jQdiv[0].getAttribute("aria-hidden"), "true");

    });

    it("should handle other types", function () {

        var jQdiv = $("<div></div>");

        jQdiv.ariaState({
            busy: 0,
            disabled: "0",
            invalid: false
        });
        chai.assert.equal(jQdiv[0].getAttribute("aria-busy"), "false");
        chai.assert.equal(jQdiv[0].getAttribute("aria-disabled"), "false");
        chai.assert.equal(jQdiv[0].getAttribute("aria-invalid"), "false");

    });

    it("should default to true for unrecognised types other types", function () {

        var jQdiv = $("<div></div>");

        jQdiv.ariaState({
            busy: [],
            disabled: -1,
            invalid: ""
        });
        chai.assert.equal(jQdiv[0].getAttribute("aria-busy"), "true");
        chai.assert.equal(jQdiv[0].getAttribute("aria-disabled"), "true");
        chai.assert.equal(jQdiv[0].getAttribute("aria-invalid"), "true");

    });

    it("should get booleans or \"mixed\" from WAI-ARIA attributes", function () {

        var jQdiv = $("<div aria-checked=\"mixed\" aria-busy=\"true\", aria-disabled=\"false\"></div>");

        chai.assert.equal(jQdiv.ariaState("checked"), "mixed");
        chai.assert.isTrue(jQdiv.ariaState("busy"));
        chai.assert.isFalse(jQdiv.ariaState("disabled"));

    });

    it("should return a jQuery object after setting", function () {

        var jQdiv = $("<div></div>");
        var jQaria = jQdiv.ariaState("busy", true);

        chai.assert(jQaria instanceof $);
        chai.assert.equal(jQdiv[0], jQaria[0]);
        chai.assert.equal(jQdiv.length, jQaria.length);

    });

});
