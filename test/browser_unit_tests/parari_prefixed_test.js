/**
 * @file Test for parari constatns.
 * Runs with kara.
 */

"use strict";


describe('pr.prefixed', function () {

    var pr = window.parari,
        prefixed = pr.prefixed;

    it('Create prefixed', function () {
        expect(prefixed).toBeDefined();
        expect(prefixed('foo')).toEqual('pr-foo');
    });

});