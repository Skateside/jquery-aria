describe("jQuery#addRole", function () {

    it("should add a role", function () {

        var jQdiv = $("<div></div>");

        jQdiv.addRole("presentation");
        chai.assert.equal(jQdiv.role(), "presentation");

        jQdiv.addRole("alert");
        chai.assert.equal(jQdiv.role(), "presentation alert");


    });

    it("should not add a role already assigned", function () {

        var jQdiv = $("<div role=\"presentation\"></div>");

        jQdiv.addRole("presentation");
        chai.assert.equal(jQdiv.role(), "presentation");
        jQdiv.addRole("");
        chai.assert.equal(jQdiv.role(), "presentation");

    });

    it("should be able to add multiple roles", function () {

        var jQdiv = $("<div></div>");

        jQdiv.addRole("presentation alert");
        chai.assert.equal(jQdiv.role(), "presentation alert");

    });

    it("should return a jQuery object", function () {
        chai.assert($("<div></div>").addRole("presentation") instanceof $);
    });

});
