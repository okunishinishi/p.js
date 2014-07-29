/**
 * @file Test for parari src.
 * Runs with kara.
 */

"use strict";


describe('pr.object', function () {

    var pr = window.parari,
        body = document.body;

    it('Create object.', function () {
        var object = new pr.Object();
        expect(object).toBeDefined();
    });

    it('Get position.', function () {
        var object = new pr.Object({
            x: 50,
            y: 100,
            width: 200,
            height: 400
        });
        expect(object.getLeft()).toEqual(-50);
        expect(object.getRight()).toEqual(150);
        expect(object.getTop()).toEqual(-100);
        expect(object.getBottom()).toEqual(300);
    });

});