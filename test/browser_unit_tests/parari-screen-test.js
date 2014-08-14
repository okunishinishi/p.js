/**
 * Brower unit test for pr.screen
 * Runs with Kamra.
 */

"use strict";

describe('pr.screen', function () {

    var pr = window.parari,
        Screen = pr.Screen;

    it('pr.screen', function () {
        expect(function () {
            new Screen(null);
        }).toThrow();
    });

    it('Create a canvas element.', function () {
        var canvas = Screen._newCanvasElement();
        expect(canvas).toBeDefined();
        var canvas2 = Screen._newCanvasElement();
        expect(canvas.id).not.toEqual(canvas2.id);
    });

    it('Create a screen element.', function () {
        var elm = Screen._newScreenElement([]);
        expect(elm).toBeDefined();
    });

    it('newFabricCanvas', function () {
        var canvas = Screen.newFabricCanvas('foo', 'bar');
        expect(canvas).toBeDefined();
    });

});