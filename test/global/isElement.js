describe("isElement", function () {

    it("should detect HTML Elements", function () {

        chai.assert.isTrue(isElement(document.createElement("div")));
        chai.assert.isTrue(isElement(document.createElement("article")));

    });

    it("should return false for a Node that is not an Element", function () {

        chai.assert.isFalse(isElement(document.createTextNode("a")));
        chai.assert.isFalse(isElement(document.createComment("a")));
        chai.assert.isFalse(isElement(document.createDocumentFragment()));

    });

    it("should not be fooled but Element-like objects", function () {

        chai.assert.isFalse(isElement({
            nodeName: "A",
            nodeType: 1
        }));

        chai.assert.isFalse(isElement({
            toString: function () {
                return "[object HTMLElement]";
            }
        }));

    });

});
