/**
 * Brower unit test for pr.constants
 * Runs with Kamra.
 */

"use strict";

describe('pr.constants', function(){

    var pr = window.parari;

    it('pr.constants', function(){
        expect(pr.constants).toBeDefined();
        expect(pr.constants.PREFIX).toBeDefined();
    });
});