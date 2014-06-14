/**
 * @file Test for para util.
 * Runs with kara.
 */

"use strict";


describe('para.util', function () {
    var util = para.util;
    it('Create a new canvas', function () {
        var canvas = util.newCanvas('foo', 200, 300);
        expect(canvas).toBeDefined();
        expect(canvas.width).toEqual(200);
        expect(canvas.height).toEqual(300);
        expect(canvas.id).toEqual('foo');
    });
    it('Get document style string.', function () {
        util.getDocumentStyleString();
    });

    it('Create image.', function (done) {
        util.htmlToImage('<span>foo</span>', 100, 100, function (image) {
            expect(image).toBeDefined();
            done();
        });
    });

    it('Optimize canvas ratio', function () {
        var canvas = util.newCanvas('foo', 200, 300),
            ctx = canvas.getContext('2d');
        util.optimizeCanvasRatio(canvas, ctx);
    });

    it('Get URL', function () {
        expect(util.URL).toBeDefined();
    });
});