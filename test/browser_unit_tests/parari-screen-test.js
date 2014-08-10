/**
 * Brower unit test for pr.screen
 * Runs with Kamra.
 */

"use strict";

describe('pr.screen', function () {

    var pr = window.parari;

    it('pr.screen', function () {
        expect(function () {
            new pr.Screen(null);
        }).toThrow();
    });

    it('Create a screen element.', function () {
        var elm = pr.Screen._newScreenElement('foo-id');
        expect(elm).toBeDefined();
        var canvas = elm.querySelector('canvas');
        expect(canvas).toBeDefined();
        expect(canvas.id).toEqual('foo-id');
    });

    it('Create a new canvas id.', function () {
        var id = pr.Screen._newCanvasId();
        expect(id).toBeDefined();
    });
});