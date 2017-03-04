describe("jQuery#role", function () {

    it("should be able to set a role", function () {

        var jQdiv = $("<div></div>");
        jQdiv.role("presentation");

        chai.assert.equal(jQdiv[0].getAttribute("role"), "presentation");

    });

    it("should be able to get a role", function () {

        var jQdiv = $("<div role=\"presentation\"></div>");

        chai.assert.equal(jQdiv.role(), "presentation");

    });

    it("should return a jQuery object after setting", function () {
        chai.assert($("<div></div>").role("presentation") instanceof $);
    });

});
