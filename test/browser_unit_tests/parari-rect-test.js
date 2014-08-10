/**
 * Brower unit test for pr.rect
 * Runs with Kamra.
 */

"use strict";

describe('pr.rect', function () {

    var pr = window.parari;


    var pr = window.parari,
        Rect = pr.Rect;

    it('Create Rect.', function () {
        var rect = new Rect(10, 20, 70, 100);
        expect(rect).toBeDefined();
        expect(rect.left).toEqual(10);
        expect(rect.right).toEqual(80);
        expect(rect.top).toEqual(20);
        expect(rect.bottom).toEqual(120);
        expect(rect.width).toEqual(70);
        expect(rect.height).toEqual(100);
        var rect2 = new Rect(5, 6, 7, 8);
        expect(rect2.right).toEqual(12);
        expect(rect.right).toEqual(80);
    });

    it('Clone a rect.', function () {
        var rect = new Rect(10, 20, 70, 100),
            clone = rect.clone();
        expect(rect.left).toEqual(clone.left);
        expect(rect.right).toEqual(clone.right);
        expect(rect.top).toEqual(clone.top);
        expect(rect.bottom).toEqual(clone.bottom);
        expect(rect.width).toEqual(clone.width);
        expect(rect.height).toEqual(clone.height);
    });

    it('Contains a point.', function () {
        var rect = new Rect(10, 20, 70, 100);
        expect(rect.contains(10, 30)).toEqual(true);
        expect(rect.contains(0, 30)).toEqual(false);
        expect(rect.contains(20, 10)).toEqual(false);
    });

    it('Clip', function () {
        var rect = new Rect(20, 30, 100, 200),
            clpped = rect.clip(new Rect(10, 50, 20, 40));
        expect(clpped.left).toEqual(20);
        expect(clpped.right).toEqual(30);
        expect(clpped.top).toEqual(50);
        expect(clpped.bottom).toEqual(90);
    });

    it('ofElement', function () {
        var rect = Rect.ofElement(document.body);
        expect(rect).toBeDefined();
    });

    it('Relative', function () {
        var rect = new Rect(100, 100, 200, 200),
            bounds = new Rect(100, 100, 300, 300);
        var relative = rect.relative(bounds);
        expect(relative).toBeDefined();
        expect(relative.left).toEqual(0);
        expect(relative.right).toEqual(200);
        expect(relative.top).toEqual(0);
        expect(relative.bottom).toEqual(200);
    })
});