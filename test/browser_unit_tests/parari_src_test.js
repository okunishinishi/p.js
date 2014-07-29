/**
 * @file Test for parari src.
 * Runs with kara.
 */

"use strict";


describe('pr.src', function () {

    var pr = window.parari,
        body = document.body;

    it('Src properties.', function(){
        expect(pr.Src._objectSelector).toEqual('[data-pr-object]');
        expect(pr.Src._className).toEqual('pr-src');
    });

    it('Create src.', function () {
        var root = document.createElement('div'),
            src = new pr.Src(root);
        expect(src).toBeDefined();
        expect(src._findElements()).toBeDefined();
        expect(src.getObjects()).toBeDefined();
    });

});