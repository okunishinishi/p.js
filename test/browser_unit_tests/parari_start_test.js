/**
 * @file Test for parari start.
 * Runs with kara.
 */

"use strict";


describe('pr.start', function () {

    var pr = window.parari,
        start = pr.start;

    it('New layers.', function () {
        var layers = start._newLayers('sunLight', [
            {},
            {}
        ], true, false);
        expect(layers).toBeDefined();
        expect(layers.length).toEqual(2);
        expect(layers[0].vLock).toEqual(true);
        expect(layers[0].hLock).toEqual(false);
    });


});