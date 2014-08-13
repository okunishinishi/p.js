/**
 * Brower unit test for pr.resolveLayer
 * Runs with Kamra.
 */

"use strict";

describe('pr.resolveLayer', function () {

    var pr = window.parari;

    it('pr.resolveLayer', function () {
        expect(pr.resolveLayer('starFlow')).toBeDefined();
        expect(pr.resolveLayer('StarFlowLayer')).toBeDefined();
        expect(pr.resolveLayer('__invald_name')).not.toBeDefined();
    });
});