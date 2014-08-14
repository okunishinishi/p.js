/**
 * Brower unit test for pr.texture
 * Runs with Kamra.
 */

"use strict";

describe('pr.texture', function () {

    var pr = window.parari,
        Texture = pr.textures.Texture;

    it('pr.texture', function () {
        var texture = new Texture({});
        expect(texture).toBeDefined();
    });

    it('Create a canvas.', function () {
        var canvas = Texture.newCanvas(100, 200);
        expect(canvas).toBeDefined();
        expect(canvas.style.width).toEqual(100 + 'px');
        expect(canvas.style.height).toEqual(200 + 'px');
    });
});