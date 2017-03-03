describe("jQuery#ariaRef", function () {

    it("should set WAI-ARIA attributes by reference", function () {

        var jQdiv = $("<div id=\"ref-test-1\" class=\"alpha\"></div>").appendTo("body");
        var jQtest = $("<div></div>");

        jQtest.ariaRef("aria-labelledby", jQdiv);
        chai.assert.equal(jQtest[0].getAttribute("aria-labelledby"), jQdiv[0].id);

        jQtest.ariaRef({
            "aria-describedby": jQdiv[0],
            "aria-flowto": "." + jQdiv[0].className
        });
        chai.assert.equal(jQtest[0].getAttribute("aria-describedby"), jQdiv[0].id);
        chai.assert.equal(jQtest[0].getAttribute("aria-flowto"), jQdiv[0].id);

        jQdiv.remove();

    });

    it("should auto-prefix WAI-ARIA attributes", function () {

        var jQdiv = $("<div id=\"ref-test-2\" class=\"bravo\"></div>").appendTo("body");
        var jQtest = $("<div></div>");

        jQtest.ariaRef("labelledby", jQdiv);
        chai.assert.equal(jQtest[0].getAttribute("aria-labelledby"), jQdiv[0].id);

        jQtest.ariaRef({
            "describedby": jQdiv[0],
            "flowto": "." + jQdiv[0].className
        });
        chai.assert.equal(jQtest[0].getAttribute("aria-describedby"), jQdiv[0].id);
        chai.assert.equal(jQtest[0].getAttribute("aria-flowto"), jQdiv[0].id);

        jQdiv.remove();

    });

    it("should auto-generate an ID for elements", function () {

        var jQdiv = $("<div></div>");
        var jQtest = $("<div></div>");

        jQtest.ariaRef("flowto", jQdiv);
        chai.assert.isDefined(jQdiv[0].id);
        chai.assert.equal(jQtest.attr("aria-flowto"), jQdiv.attr("id"));

    });

    it("should get references from WAI-ARIA attributes", function () {

        var jQdiv = $("<div id=\"ref-test-3\"></div>").appendTo("body");
        var jQtest = $("<div></div>").ariaRef("labelledby", jQdiv);

        chai.assert.equal(jQtest.ariaRef("labelledby")[0], jQdiv[0]);

        jQdiv.remove();

    });

    it("should return a jQuery object after setting", function () {

        var jQdiv = $("<div></div>");
        var jQaria = jQdiv.ariaRef("flowto", jQdiv);

        chai.assert(jQaria instanceof $);
        chai.assert.equal(jQdiv[0], jQaria[0]);
        chai.assert.equal(jQdiv.length, jQaria.length);

    });

});
