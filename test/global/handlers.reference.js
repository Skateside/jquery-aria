describe("handlers." + HANDLER_REFERENCE, function () {

    describe("set", function () {

        it("should set a reference", function () {

            var div = document.createElement("div");
            var article = document.createElement("article");

            handlers[HANDLER_REFERENCE].set(div, "labelledby", article);

            chai.assert.isTrue(div.hasAttribute("aria-labelledby"));
            chai.assert.isTrue((/^anonymous\d+$/).test(article.id));
            chai.assert.equal(div.getAttribute("aria-labelledby"), article.id);

        });

    });

    describe("get", function () {

        it("should get an element", function () {

            var div = document.createElement("div");
            var article = document.createElement("article");

            handlers[HANDLER_REFERENCE].set(div, "labelledby", article);
            $(article).appendTo("body");
            var reference = handlers[HANDLER_REFERENCE].get(div, "labelledby");

            chai.assert.isTrue(reference instanceof jQuery);
            chai.assert.isTrue(reference.length === 1);
            chai.assert.equal(reference[0], article);

            $(article).remove();

        });

        it("should return an empty jQuery object if the element isn't found", function () {

            var div = document.createElement("div");
            var article = document.createElement("article");

            handlers[HANDLER_REFERENCE].set(div, "labelledby", article);
            var reference = handlers[HANDLER_REFERENCE].get(div, "labelledby");

            chai.assert.isTrue(reference instanceof jQuery);
            chai.assert.isTrue(reference.length === 0);

        });

        it("should return undefined if the attribute doesn't exist", function () {

            var div = document.createElement("div");

            chai.assert.isUndefined(handlers[HANDLER_REFERENCE].get(div, "labelledby"));

        });

    });

});
