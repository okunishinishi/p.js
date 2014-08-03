/**
 *  @file Test for parari sun light layer.
 *  RUn with karma.
 */

"use strcit"


describe('pr.layers.SunLightLayer', function () {

    var pr = window.parari,
        l = pr.layers;


    it('Create a layer', function () {
        var layer = new l.SunLightLayer({

        });
        expect(layer).toBeDefined();
    });
});