/**
 * Brower unit test for pr.Drawable
 * Runs with Kamra.
 */

"use strict";

describe('pr.Drawable', function () {

    var pr = window.parari,
        f = fabric;

    it('pr.Drawable', function () {
        var drawable = new pr.Drawable(document.body);
        expect(drawable).toBeDefined();
    });

    it('From element.', function () {
        var drawable = new pr.Drawable(document.body);
        expect(drawable).toBeDefined();
    });

    it('Check conflicts with prototype.', function () {
        Object.keys(pr.Drawable.prototype).forEach(function (key) {
            var hasConflict = f.Object.prototype[key] !== undefined;
            expect(hasConflict).toBe(false);
        });
    });
});