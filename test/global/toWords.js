describe("toWords", function () {

    it("should split a string into words", function () {
        chai.assert.deepEqual(toWords("a b"), ["a", "b"]);
    });

    it("should consider multiple spaces as one", function () {
        chai.assert.deepEqual(toWords("a  b"), ["a", "b"]);
    });

    it("should discard empty entries", function () {

        chai.assert.deepEqual(toWords(" a b"), ["a", "b"]);
        chai.assert.deepEqual(toWords("a b "), ["a", "b"]);
        chai.assert.deepEqual(toWords(" a b "), ["a", "b"]);
        chai.assert.deepEqual(toWords(" "), []);
        chai.assert.deepEqual(toWords("  "), []);

    });

});
