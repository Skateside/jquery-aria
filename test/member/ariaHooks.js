describe("jQuery.ariaHooks", function () {

    it("should allow a value to be changed when setting", function () {

        var jQdiv = $("<div></div>");

        $.ariaHooks.hook = {
            set: function (element, value, attribute) {
                return value + "_" + value;
            }
        };

        jQdiv.aria("hook", "one");
        chai.assert.equal(jQdiv.attr("aria-hook"), "one_one");

        delete $.ariaHooks.hook;

    });

    it("should stop processing if undefined is returned", function () {

        var jQdiv = $("<div></div>");

        $.ariaHooks.hook = {
            set: function (element, value, attribute) {
                element.setAttribute(attribute + "0", value);
            }
        };

        jQdiv.aria("hook", "one");
        chai.assert.isUndefined(jQdiv.attr("aria-hook"));
        chai.assert.equal(jQdiv.attr("aria-hook0"), "one");

        delete $.ariaHooks.hook;

    });

    it("should allow values to be converted before being returned", function () {

        var jQdiv = $("<div aria-hook=\"1\"></div>");

        $.ariaHooks.hook = {
            get: function (element, attribute) {
                return parseInt(element.getAttribute(attribute), 10);
            }
        };

        chai.assert.equal(jQdiv.aria("hook"), 1);
        chai.assert.equal(typeof jQdiv.aria("hook"), "number");

        delete $.ariaHooks.hook;

    });

    it("should allow testing to be manipulated", function () {

        var jQdiv = $("<div aria-hook=\"one\"></div>");

        $.ariaHooks.hook = {
            has: function (element, attribute) {
                return $.isNumeric(element.getAttribute(attribute));
            }
        };

        chai.assert.isUndefined(jQdiv.aria("hook"));
        chai.assert.isDefined(jQdiv.attr("aria-hook"));

        delete $.ariaHooks.hook;

    });

    it("should allow us to decide whether or not a value can be removed", function () {

        var jQdiv = $("<div aria-hook=\"1\"></div>");

        $.ariaHooks.hook = {
            unset: function (element, attribute) {
                return false;
            }
        };

        jQdiv.removeAria("hook");
        chai.assert.isDefined(jQdiv.attr("aria-hook"));
        jQdiv.removeAttr("aria-hook");
        chai.assert.isUndefined(jQdiv.aria("hook"));
        chai.assert.isUndefined(jQdiv.attr("aria-hook"));

        delete $.ariaHooks.hook;

    });

});
