/**
 * Brower unit test for pr.start
 * Runs with Kamra.
 */

"use strict";

describe('pr.start', function () {

    var pr = window.parari;

    it('Invalid root.', function () {
        expect(function () {
            pr.start('__invalid_id')
        }).toThrow();
    });
});