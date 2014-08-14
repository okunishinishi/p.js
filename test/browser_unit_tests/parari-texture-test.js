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
});