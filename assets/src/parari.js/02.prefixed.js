/**
 * Append prefix.
 * @membrerof para
 * @function prefixed
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