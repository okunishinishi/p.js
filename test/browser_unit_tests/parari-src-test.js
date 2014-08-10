/**
 * Brower unit test for pr.src
 * Runs with Kamra.
 */

"use strict";

describe('pr.src', function () {

    var pr = window.parari;

    it('pr.src', function () {
        var div = document.createElement('div'),
            src = new pr.Src(div);
        expect(src).toBeDefined();
        expect(div.className).toEqual('pr-src');

        var drawables = src.getDrawables();
        expect(drawables).toBeDefined();
    });

});