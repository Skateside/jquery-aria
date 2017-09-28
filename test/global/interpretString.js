describe("interpretString", function () {

    it("should always return a string", function () {


        [
            "",
            0,
            true,
            [],
            {},
            null,
            undefined,
            function () {}
        ].forEach(function (type) {
            chai.assert.isTrue(typeof interpretString(type) === "string");
        });

    });

    it("should covert object to string", function () {

        var o1 = {};
        var o2 = {
            toString: function () {
                return "a";
            }
        };

        chai.assert.equal(interpretString(o1), "[object Object]");
        chai.assert.equal(interpretString(o2), "a");

    });

    it("should convert null and undefined to empty strings", function () {

        chai.assert.equal(interpretString(), "");
        chai.assert.equal(interpretString(null), "");
        chai.assert.equal(interpretString(undefined), "");

    });

});
