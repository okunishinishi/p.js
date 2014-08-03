/**
 * @file Test for parari constatns.
 * Runs with karma.
 */

"use strict";


describe('pr.constants', function () {

    var pr = window.parari,
        c = pr.constants;

    it('Access constants', function () {
        expect(c).toBeDefined();
        expect(c.PREFIX).toBeDefined();
    });

});