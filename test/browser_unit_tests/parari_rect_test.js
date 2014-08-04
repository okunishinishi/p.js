/**
 * @file Test for parari rect.
 * Runs with kara.
 */

"use strict";


describe('pr.Rect', function () {

    var pr = window.parari,
        Rect = pr.Rect;

    it('Create Rect', function () {
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

});