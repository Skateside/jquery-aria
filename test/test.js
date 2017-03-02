// https://mochajs.org/
//var chai.assert = require("chai.assert");

// Normalising WAI-ARIA attributes
describe("jQuery.normaliseAria", function () {

    it("should prefix a string with \"aria-\"", function () {
        chai.assert.equal($.normaliseAria("busy"), "aria-busy");
    });

    it("should prefix convert the string to lower case", function () {
        chai.assert.equal($.normaliseAria("BUSY"), "aria-busy");
    });

    it("should not prefix an already prefixed string", function () {
        chai.assert.equal($.normaliseAria("aria-busy"), "aria-busy");
    });

    it("should convert the argument to a string before prefixing", function () {

        var o = {
            toString: function () {
                return "abc";
            }
        };

        chai.assert.equal($.normaliseAria(o), "aria-abc");

    });

    it("should map using values from $.ariaMap", function () {
        chai.assert.equal($.normaliseAria("labeledby"), "aria-labelledby");
        chai.assert.equal($.normaliseAria("LABELEDBY"), "aria-labelledby");
    });

    // it("should map using values from $.ariaMap and convert to lower case", function () {
    // });

    it("should have the alias $.normalizeAria", function () {
        chai.assert.equal($.normaliseAria, $.normalizeAria);
    });

});

// Identify
describe("jQuery#identify", function () {

    function makeHolder() {

        var holder = document.createElement("div");
        holder.innerHTML = (
            "<div id=\"one\"></div>" +
            "<div></div>"
        );
        return holder;

    }

    it("should get the ID of the matching element", function () {
        chai.assert.equal($("div:first-child", makeHolder()).identify(), "one");
    });

    it("should generate an ID if there is not already one", function () {
        chai.assert.equal($("div:last-child", makeHolder()).identify().substr(0, 9), "anonymous");
    });

    it("should only get the ID of the first matching element", function () {

        var jQdiv = $("div", makeHolder());

        chai.assert.equal(jQdiv.identify(), jQdiv.eq(0).attr("id"));

    });

    // Will this work through Grunt?
    it("should skip existing IDs", function () {

        var elements = [0, 1, 2, 3, 4, 5].map(function (i) {

            var div = document.createElement("div");

            div.id = "anonymous" + i;

            document.body.appendChild(div);

            return div;

        });

        var id = $("<div></div>").identify();
        var ids = elements.map(function (elem) {
            return elem.id;
        });

        chai.assert.equal(ids.indexOf(id), -1);

        elements.forEach(function (elem) {
            document.body.removeChild(elem);
        });

    });

});

// Roles
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

describe("jQuery#addrole", function () {

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
