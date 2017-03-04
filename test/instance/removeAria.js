describe("jQuery#removeAria", function () {

    it("should remove WAI-ARIA attributes", function () {

        var jQdiv = $("<div aria-busy=\"true\"></div>");

        jQdiv.removeAria("aria-busy");
        chai.assert.isNull(jQdiv[0].getAttribute("aria-busy"));

    });

    it("should prefix WAI-ARIA attributes", function () {

        var jQdiv = $("<div aria-busy=\"true\"></div>");

        jQdiv.removeAria("busy");
        chai.assert.isNull(jQdiv[0].getAttribute("aria-busy"));

    });

    it("should map WAI-ARIA attributes using jQuery.ariaMap", function () {

        var jQdiv = $("<div aria-labelledby=\"id\"></div>");

        jQdiv.removeAria("labeledby");
        chai.assert.isNull(jQdiv[0].getAttribute("aria-labelledby"));

    });

    it("should return a jQuery object", function () {
        chai.assert($("<div></div>").removeAria("busy") instanceof $);
    });

    it("should have the aliases jQuery#removeAriaRef and jQuery#removeAriaState", function () {

        chai.assert.equal($.fn.removeAria, $.fn.removeAriaRef);
        chai.assert.equal($.fn.removeAria, $.fn.removeAriaState);

    });

});
