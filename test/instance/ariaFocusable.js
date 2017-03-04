describe("jQuery#ariaFocusable", function () {

    it("should manipulate the tabindex attribute", function () {

        var jQdiv1 = $("<div></div>");
        var jQdiv2 = $("<div></div>");

        jQdiv1.ariaFocusable(true);
        jQdiv2.ariaFocusable(false);

        chai.assert.equal(jQdiv1.attr("tabindex"), "0");
        chai.assert.equal(jQdiv2.attr("tabindex"), "-1");

    });

    it("should return a jQuery object", function () {

        chai.assert($("<div></div>").ariaFocusable(true) instanceof $);
        chai.assert($("<div></div>").ariaFocusable(false) instanceof $);

    });

});
