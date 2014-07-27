/**
 * @file Test for para util.
 * Runs with kara.
 */

"use strict";


describe('pr.utilities', function () {
    var util = pr.utilities;
    it('Create a new canvas', function () {
        var canvas = util.newCanvas('foo', 200, 300);
        expect(canvas).toBeDefined();
        expect(canvas.width).toEqual(200);
        expect(canvas.height).toEqual(300);
        expect(canvas.id).toEqual('foo');
    });

    it('Optimize canvas ratio', function () {
        var canvas = util.newCanvas('foo', 200, 300),
            ctx = canvas.getContext('2d');
        util.optimizeCanvasRatio(canvas, ctx);
    });

    it('Get URL.', function () {
        expect(util.URL).toBeDefined();
    });

    it('Ensure element.', function () {
        expect(util.ensureElement('__id_not_exists'));
    });

    it('Convert to array', function () {
        (function () {
            var args = util.toArray(arguments);
            expect(Array.isArray(args)).toBe(true);
        })('foo', 'bar');
    });

});