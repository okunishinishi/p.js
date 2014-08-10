/**
 * Brower unit test for pr.prefixed
 * Runs with Kamra.
 */

"use strict";

describe('pr.prefixed', function(){

    var pr = window.parari;

    it('pr.prefixed', function(){
        expect(pr.prefixed('src')).toEqual('pr-src');
    });
});