/**
 * Brower unit test for pr.bodyScroller
 * Runs with Kamra.
 */

"use strict";

describe('pr.bodyScroller', function () {

    var pr = window.parari;

    it('pr.bodyScroller', function () {
        expect(pr.bodyScroller.scrollLeft).toBeDefined();
        expect(pr.bodyScroller.scrollTop).toBeDefined();
    });
});