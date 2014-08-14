/**
 * Brower unit test for pr.rainbowColorTexture
 * Runs with Kamra.
 */

"use strict";

describe('pr.rainbowColorTexture', function () {

    var pr = window.parari,
        RainbowColorTexture = pr.textures.RainbowColorTexture;

    it('pr.rainbowColorTexture', function () {
        var texture = new RainbowColorTexture({

        });
        expect(texture).toBeDefined();
        var fillColor = texture.fillColor(0.5);
        expect(fillColor).toBeDefined();
        expect(typeof fillColor).toEqual('string');
    });
});