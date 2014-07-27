/**
 * Start para.
 * @function start
 */

(function (pr, document) {
    "use strict";

    var u = pr.utilities;

    pr.start = function (elm) {
        elm = u.ensureElement(elm);
        console.log(this, elm);
    };

})(window.parari = window.parari || {}, document);