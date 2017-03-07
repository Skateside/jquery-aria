describe("jQuery#removeRole", function () {

    it("should remove a role", function () {

        var jQdiv = $("<div role=\"presentation alert\"></div>");

        jQdiv.removeRole("presentation");
        chai.assert.equal(jQdiv.role(), "alert");

        jQdiv.removeRole("alert");
        chai.assert.equal(jQdiv.role(), "");


    });

    it("should not remove a role not already assigned", function () {

        var jQdiv = $("<div role=\"presentation\"></div>");

        jQdiv.removeRole("alert");
        chai.assert.equal(jQdiv.role(), "presentation");

    });

    it("should be able to remove multiple roles", function () {

        var jQdiv = $("<div role=\"presentation alert banner\"></div>");

        jQdiv.removeRole("presentation alert");
        chai.assert.equal(jQdiv.role(), "banner");

    });

    it("should return a jQuery object", function () {
        chai.assert($("<div></div>").removeRole("presentation") instanceof $);
    });

});
