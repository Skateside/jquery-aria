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
