/**
 * Brower unit test for pr.utilities
 * Runs with Kamra.
 */

"use strict";

describe('pr.utilities', function () {

    var pr = window.parari,
        u = pr.utilities;

    it('toElement', function () {
        expect(u.toElement('__invalid_id__')).toBe(null);
        expect(u.toElement(document.body) === document.body).toBe(true);
    });

    it('copy', function () {
        var src = {foo: 'bar'},
            dest = {foo: 'bbb', baz: 'quz'};
        u.copy(src, dest);
        expect(dest.foo).toEqual('bar');
        expect(dest.baz).toEqual('quz');
    });

    it('Offset sum.', function () {
        var offsetSum = u.offsetSum(document.window);
        expect(offsetSum.top).toBeDefined();
        expect(offsetSum.left).toBeDefined();
    });

    it('toArray.', function () {
        var array = u.toArray(['a', 'b', 'c']);
        expect(array).toBeDefined();
        expect(array[0]).toEqual('a');
        expect(array[1]).toEqual('b');
        expect(array[2]).toEqual('c');
    });

    it('Get min.', function () {
        expect(u.min(2, 5, 1)).toEqual(1);
    });
    it('Get max.', function () {
        expect(u.max(2, 5, 1)).toEqual(5);
    });

    it('extractNumber', function () {
        expect(u.extractNumber('20px')).toEqual(20);
    });

    it('Optimize canvas rate.', function () {
        var canvas = document.createElement('canvas');
        u.optimizeCanvasRatio(canvas);
    });

    it('Concat reduce.', function () {
        var reduced = ['a', 'b', 'c'].reduce(u.concatReduce, '');
        expect(reduced).toEqual('abc');
    });

    it('Trigger an event.', function () {
        u.triggerEvent(document.body, 'parari-event');
    });

    it('Is a extNode.', function () {
        expect(u.isTextNode(document)).toBe(false);
        expect(u.isTextNode(null)).toBe(false);
    });
    it('Is an element node.', function () {
        expect(u.isElementNode(document)).toBe(false);
        expect(u.isElementNode(document.body)).toBe(true);
        expect(u.isElementNode(null)).toBe(false);
    });

    it('Composite actions.', function () {
        var composited = u.composite(function (val) {
            return ['foo', val].join('-');
        }, function (val) {
            return ['bar', val].join('-');
        });
        var result = composited('one');
        expect(result[0]).toEqual('foo-one');
        expect(result[1]).toEqual('bar-one');
    });

    it('Is IE.', function () {
        expect(u.isIE({all: function () {
        }})).toBe(true);
        expect(u.isIE({})).toBe(false);
    });

    it('Get event offset.', function () {
        var o1 = {
            x: u.eventOffsetX({offsetX: 100}),
            y: u.eventOffsetY({offsetY: 200}),
        }
        expect(o1.x).toEqual(100);
        expect(o1.y).toEqual(200);

        var o2 = {
            x: u.eventOffsetX({offsetX: 300}),
            y: u.eventOffsetY({offsetY: 400}),
        }
        expect(o2.x).toEqual(300);
        expect(o2.y).toEqual(400);
    });

    it('Camelize', function () {
        expect(u.camelize('Foo-barBaz')).toEqual('fooBarBaz');
    });

    it('Generate uuid.', function () {
        for (var i = 0; i < 100; i++) {
            expect(u.uuid()).not.toEqual(u.uuid());
        }
    });
});