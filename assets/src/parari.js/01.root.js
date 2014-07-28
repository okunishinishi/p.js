/**
 * Utilitis for parari.
 * @function parari.root
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities;

    function root(root) {
        var src = u.ensureElement(root);
        if (!src) {
            throw new Error('Root not found: "' + root + '"');
        }
        src.classList.add('pr-src');
        src.findPrObjects = function () {
            return u.toArray(src.querySelectorAll('[data-pr-object]'));
        };
        return src;
    }

    pr.root = root;

})(window.parari = window.parari || {}, document);