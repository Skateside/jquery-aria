describe("identity", function () {

    it("should always return the first argument", function () {

        var o = {};

        chai.assert.equal(identity(""), "");
        chai.assert.equal(identity(0), 0);
        chai.assert.equal(identity(o), o);

    });

    it("should ignore subsequent arguments", function () {

        var o = {};

        chai.assert.equal(identity(o), o);
        chai.assert.equal(identity(o, true), o);
        chai.assert.equal(identity(o, 0), o);

    });

    it("should not be affected by context", function () {

        var o = {};

        chai.assert.equal(identity(o), o);
        chai.assert.equal(identity.call(null, o), o);
        chai.assert.equal(identity.apply(null, [o]), o);

    });

});
