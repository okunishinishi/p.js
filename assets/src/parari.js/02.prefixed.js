/**
 * Append prefix.
 * @membrerof parari
 * @function prefixed
 * @param {string} value - String value to add prefix.
 */
(function (pr) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends prefixed */
    function prefixed(value) {
        return [c.PREFIX, value].join('-');
    }

    pr.prefixed = prefixed;


})(window.parari = window.parari || {});