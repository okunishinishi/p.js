/**
 *  @file Test for parari night sky layer
 *  RUn with karma.
 */

"use strcit"


describe('pr.layers.NightSkyLayer', function () {

    var pr = window.parari,
        l = pr.layers;

    it('Create a star.', function () {
        var star = new l.NightSkyLayer.Star({
            radius: 2,
            speed: 1,
            color: '#FFF'
        });
        expect(star).toBeDefined();
        expect(star.radius).toEqual(2);
    });

    it('Craet a night sky.', function () {
        var layer = new l.NightSkyLayer({

        });
        expect(layer).toBeDefined();
    });

    it('Create stars.', function () {
        var stars = l.NightSkyLayer.stars(10, {});
        expect(stars.length).toEqual(10);
    });
});