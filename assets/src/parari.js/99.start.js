/**
 * Start para.
 * @function start
 */

(function (pr, document) {
    "use strict";

    var u = pr.utilities;


    /**
     * @lends start
     * @param {HTMLElement|string} root - Root element.
     * @param {object} options - Parari options.
     */
    pr.start = function (root, options) {
        root = pr.root(root);
        console.log(root);
    };

})(window.parari = window.parari || {}, document);