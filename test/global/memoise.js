describe("memoise", function () {

    it("should return a function", function () {
        chai.assert.isTrue(typeof memoise(function () {}) === "function");
    });

    it("should prevent a function executing mutliple times", function () {

        var count = 0;
        var func = memoise(function () {
            count += 1;
        });

        func();
        func();
        func();

        chai.assert.equal(count, 1);

    });

    it("should create a cache of results", function () {

        var add = memoise(function (a, b) {
            return a + b;
        });

        add(1, 2);
        add(1, 2);
        add(1, 2);

        chai.assert.isDefined(add.cache);
        chai.assert.equal(add.cache["1,2"], 3);

    });

    it("should allow a resolver to be defined", function () {

        var add = memoise(function (a, b) {
            return a + b;
        }, function () {
            return "a-" + JSON.stringify(Array.prototype.slice.call(arguments));
        });

        add(1, 2);
        add(1, 2);
        add(1, 2);

        chai.assert.isDefined(add.cache["a-[1,2]"]);
        chai.assert.isUndefined(add.cache["1,2"]);
        chai.assert.equal(add.cache["a-[1,2]"], 3);

    });

});
