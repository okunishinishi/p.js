/**
 *  @file Test for parari star flow layer.
 *  RUn with karma.
 */

"use strcit"


describe('pr.layers.StarFlowLayer', function () {

    var pr = window.parari,
        l = pr.layers;

    it('Create a star.', function () {
        var star = new l.StarFlowLayer.Star({
            radius: 2,
            speed: 1,
            color: '#FFF'
        });
        expect(star).toBeDefined();
        expect(star.radius).toEqual(2);
    });

    it('Craet a night sky.', function () {
        var layer = new l.StarFlowLayer({

        });
        expect(layer).toBeDefined();
    });

    it('Create stars.', function () {
        var stars = l.StarFlowLayer.stars({
            minX: 10,
            minY: 20,
            maxX: 200,
            maxY: 400
        });
        expect(stars).toBeDefined();
    });

    it('numberStartsForBounds', function () {
        var count = l.StarFlowLayer.numberStartsForBounds({
            minX: 10,
            minY: 20,
            maxX: 200,
            maxY: 400
        });
        expect(count).toBeDefined();
    });
});