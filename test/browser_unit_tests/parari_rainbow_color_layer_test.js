/**
 *  @file Test for parari rainbow color layer.
 *  RUn with karma.
 */

"use strcit"


describe('pr.layers.RainbowColorLayer', function () {

    var pr = window.parari,
        l = pr.layers;

    it('Create a layer', function () {
        var layer = new l.RainbowColorLayer({

        });
        expect(layer).toBeDefined();
        expect(layer.fillColor(0.4)).toBeDefined();
    });
});