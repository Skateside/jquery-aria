describe("access", function () {

    it("should get the property of the first element", function () {

        var jQelements = $(
            "<div aria-busy=\"false\"></div>"
            + "<div aria-busy=\"true\"></div>"
        );

        chai.assert.equal(access(jQelements, "busy"), "false");

    });

    it("should set the properties of all elements", function () {

        var jQelements = $(
            "<div></div>"
            + "<div></div>"
        );

        access(jQelements, "busy", true);

        chai.assert.equal(jQelements.eq(0).attr("aria-busy"), "true");
        chai.assert.equal(jQelements.eq(1).attr("aria-busy"), "true");

    });

    it("should return a jQuery element after setting", function () {

        var jQelements = $(
            "<div></div>"
            + "<div></div>"
        );
        var jQaccess = access(jQelements, "busy", true);

        chai.assert.isTrue(jQaccess instanceof jQuery);
        chai.assert.equal(jQaccess.length, jQelements.length);
        chai.assert.equal(jQaccess[0], jQelements[0]);
        chai.assert.equal(jQaccess[1], jQelements[1]);

    });

    it("should be able to set using an object", function () {

        var jQelements = $("<div></div>");
        var jQaccess = access(jQelements, {
            busy: false,
            checked: false
        });

        chai.assert.equal(jQelements.attr("aria-busy"), "false");
        chai.assert.equal(jQelements.attr("aria-checked"), "false");
        chai.assert.isTrue(jQaccess instanceof jQuery);

    });

    it("should allow the process to be set with a type", function () {

        var jQtrue = $("<true></true").appendTo("body");
        var jQelements = $("<div></div>");

        access(jQelements, "busy", true);
        access(jQelements, "checked", true, HANDLER_STATE);
        access(jQelements, "hidden", true, HANDLER_REFERENCE);

        chai.assert.equal(jQelements.attr("aria-busy"), "true");
        chai.assert.equal(jQelements.attr("aria-checked"), "true");
        chai.assert.isTrue(access(jQelements, "checked", undefined, HANDLER_STATE));
        chai.assert.equal(jQelements.attr("aria-hidden"), jQtrue.attr("id"));

        jQtrue.remove();

    });

    it("should default to the \"property\" type if type isn't recognised", function () {

        var jQtrue = $("<true></true").appendTo("body");
        var jQelements = $("<div></div>");

        access(jQelements, "busy", true, "DOES_NOT_EXIST");

        chai.assert.equal(jQelements.attr("aria-busy"), "true");
        chai.assert.notEqual(jQelements.attr("aria-busy"), jQtrue.attr("id"));

        jQtrue.remove();

    });

});
