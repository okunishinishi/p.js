/**
 * @file Test for parari screen.
 * Runs with kara.
 */

"use strict";


describe('pr.screen', function () {

    var pr = window.parari,
        body = document.body;

    it('Create screen.', function () {
        var canvas = document.createElement('canvas'),
            screen = new pr.Screen(canvas);
        expect(screen).toBeDefined();

        screen.scroller = document.body;
        screen.sizer = window;

        screen.redraw();
        screen.resize();

    });

    it('New canvas id.', function () {
        var id = pr.Screen.newCanvasId();
        expect(id).toBeDefined();
    });

});