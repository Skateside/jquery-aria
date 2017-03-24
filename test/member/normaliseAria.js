describe("jQuery.normaliseAria", function () {

    it("should prefix a string with \"aria-\"", function () {
        chai.assert.equal($.normaliseAria("busy"), "aria-busy");
    });

    it("should prefix convert the string to lower case", function () {
        chai.assert.equal($.normaliseAria("BUSY"), "aria-busy");
    });

    it("should not prefix an already prefixed string", function () {
        chai.assert.equal($.normaliseAria("aria-busy"), "aria-busy");
    });

    it("should convert the argument to a string before prefixing", function () {

        var o = {
            toString: function () {
                return "abc";
            }
        };

        chai.assert.equal($.normaliseAria(o), "aria-abc");

    });

    it("should convert attributes using values from $.ariaFix", function () {
        chai.assert.equal($.normaliseAria("labeledby"), "aria-labelledby");
        chai.assert.equal($.normaliseAria("LABELEDBY"), "aria-labelledby");
    });

    it("should have the alias $.normalizeAria", function () {
        chai.assert.equal($.normaliseAria, $.normalizeAria);
    });

    it("should have a cache object that contains the history of conversions", function () {

        $.normaliseAria.cache = {};
        var flowto = $.normaliseAria("flowto");
        var key = Object.keys($.normaliseAria.cache)[0];

        chai.assert.equal(flowto, "aria-flowto");
        chai.assert.isDefined(key);
        chai.assert.equal($.normaliseAria.cache[key], "aria-flowto");

    });

    it("should take changes to $.ariaFix into account", function () {

        chai.assert.equal($.normaliseAria("budy"), "aria-budy");
        $.ariaFix.budy = "busy";
        chai.assert.equal($.normaliseAria("budy"), "aria-busy");
        delete $.ariaFix.budy;

    });

});
