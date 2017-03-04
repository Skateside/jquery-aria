describe("jQuery#aria", function () {

    it("should set WAI-ARIA attributes", function () {

        var jQdiv = $("<div></div>");

        jQdiv.aria("aria-label", "label");
        chai.assert.equal(jQdiv[0].getAttribute("aria-label"), "label");

        jQdiv.aria({
            "aria-labelledby": "labelledby",
            "aria-describedby": "describedby"
        });
        chai.assert.equal(jQdiv[0].getAttribute("aria-labelledby"), "labelledby");
        chai.assert.equal(jQdiv[0].getAttribute("aria-describedby"), "describedby");

    });

    it("should auto-prefix WAI-ARIA attributes", function () {

        var jQdiv = $("<div></div>");

        jQdiv.aria("label", "label");
        chai.assert.equal(jQdiv[0].getAttribute("aria-label"), "label");

        jQdiv.aria({
            "labelledby": "labelledby",
            "describedby": "describedby"
        });
        chai.assert.equal(jQdiv[0].getAttribute("aria-labelledby"), "labelledby");
        chai.assert.equal(jQdiv[0].getAttribute("aria-describedby"), "describedby");

    });

    it("should be able to get a WAI-ARIA attribute", function () {

        var jQdiv = $("<div aria-label=\"label\"></div>");

        chai.assert.equal(jQdiv.aria("aria-label"), "label");
        chai.assert.equal(jQdiv.aria("label"), "label");

    });

    it("should return undefined for non-existent WAI-ARIA attributes", function () {

        var jQdiv = $("<div aria-busy></div>");

        chai.assert.isUndefined(jQdiv.aria("checked"));
        chai.assert.isDefined(jQdiv.aria("busy"));

    });

    it("should be able to set by function", function () {

        var jQdiv = $("<div aria-label=\"one\"></div>");

        jQdiv.aria("label", function (i, attr) {
            return attr + "_" + i;
        });
        chai.assert.equal(jQdiv.aria("label"), "one_0");

    });

    it("should be able to handle different types", function () {

        var jQdiv = $("<div></div>").aria({
            checked: false,
            busy: 1
        });

        chai.assert.equal(jQdiv.aria("checked"), "false");
        chai.assert.equal(jQdiv.aria("busy"), "1");

    });

    it("should allow the process to be changed using $.ariaHooks", function () {

        $.ariaHooks.setter = {
            set: function (element, value) {
                element.setAttribute("aria-setter", value + "_" + value);
            },
            get: function (element) {
                return element.getAttribute("aria-setter").split("_")[0];
            }
        };

        var jQdiv = $("<div></div>").aria("setter", "one");
        chai.assert.equal(jQdiv.attr("aria-setter"), "one_one");
        chai.assert.equal(jQdiv.aria("setter"), "one");

        delete $.ariaHooks.setter;

    });

    it("should return a jQuery object after setting", function () {

        var jQdiv = $("<div></div>");
        var jQaria = jQdiv.aria("busy", true);

        chai.assert(jQaria instanceof $);
        chai.assert.equal(jQdiv[0], jQaria[0]);
        chai.assert.equal(jQdiv.length, jQaria.length);

    });

});
