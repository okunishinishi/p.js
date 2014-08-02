/**
 * @file Test for parari utility.
 * Runs with kara.
 */

"use strict";


describe('pr.utilities', function () {

    var pr = window.parari,
        u = pr.utilities;

    it('Optimize canvas ratio', function () {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        u.optimizeCanvasRatio(canvas, ctx);
    });

    it('Get URL.', function () {
        expect(u.URL).toBeDefined();
    });

    it('Ensure element.', function () {
        expect(u.ensureElement('__id_not_exists'));
    });

    it('Copy object.', function () {
        var from = {foo: 'bar'},
            to = {baz: 'quz'};
        u.copy(from, to);
        expect(to.foo).toEqual('bar');
    });

    it('Convert to array', function () {
        (function () {
            var args = u.toArray(arguments);
            expect(Array.isArray(args)).toBe(true);
        })('foo', 'bar');
    });

    it('Covert to svn embeddable html.', function () {
        var html = u.toSVGEmbeddableHtml('<span><img src="foo"></span>');
        expect(html).toBeDefined();
    });

    it('Min.', function () {
        expect(u.min(100, 10, 3, 500)).toEqual(3);

    });

    it('Rate.', function () {
        expect(u.rate(10, 40, 25)).toEqual(0.5);
    });
});