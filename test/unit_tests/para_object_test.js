/**
 * @file Test for para object.
 * Runs with kara.
 */

"use strict";

describe('para.Object', function () {

    it('Create an object.', function () {
        var obj = new para.Object({
            x: 100,
            y: 200,
            width: 300,
            height: 400
        });
        expect(obj.x).toEqual(100);
        expect(obj.y).toEqual(200);
        expect(obj.width).toEqual(300);
        expect(obj.height).toEqual(400);
        expect(obj.getLeft()).toEqual(-50);
        expect(obj.getTop()).toEqual(0);
    });
});