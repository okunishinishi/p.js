/**
 * Brower unit test for pr.unprefixed
 * Runs with Kamra.
 */

"use strict";

describe('pr.unprefixed', function () {

    var pr = window.parari;

    it('pr.unprefixed', function () {
        expect(pr.unprefixed('prSpeed')).toEqual('speed');
        expect(pr.unprefixed('pr-speed')).toEqual('speed');
    });
});