/**
 * Remove prefix.
 * @membrerof parari
 * @function unprefixed
 * @param {string} value - String value to remove prefix.
 */
(function (pr) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends unprefixed */
    function unprefixed(name) {
        name = name.replace(c.PREFIX_PATTERN, '').replace(/^\-/, '');
        return  name.substr(0, 1).toLowerCase() + name.substr(1);
    }

    pr.unprefixed = unprefixed;


})(window.parari = window.parari || {});