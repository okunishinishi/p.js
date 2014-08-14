/**
 * Brower unit test for pr.resolveTexture
 * Runs with Kamra.
 */

"use strict";

describe('pr.resolveTexture', function () {

    var pr = window.parari;

    it('pr.resolveTexture', function () {
        expect(pr.resolveTexture('starFlow'));
        expect(pr.resolveTexture('StarFlow'));
        expect(pr.resolveTexture('star-flow'));
        expect(pr.resolveTexture('star-flow-texture'));
    });
});