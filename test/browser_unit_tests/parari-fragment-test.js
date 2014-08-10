/**
 * Brower unit test for pr.fragment
 * Runs with Kamra.
 */

"use strict";

describe('pr.fragment', function () {

    var pr = window.parari;

    it('pr.fragment', function () {
        var fragment = new pr.Fragment(document.body);
        expect(fragment).toBeDefined();

        fragment.sync(pr.Rect.RectZero());
    });
});