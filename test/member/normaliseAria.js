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

    it("should map using values from $.ariaMap", function () {
        chai.assert.equal($.normaliseAria("labeledby"), "aria-labelledby");
        chai.assert.equal($.normaliseAria("LABELEDBY"), "aria-labelledby");
    });

    it("should have the alias $.normalizeAria", function () {
        chai.assert.equal($.normaliseAria, $.normalizeAria);
    });

});
