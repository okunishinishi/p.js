/**
 * Detect browser support.
 * @member parari
 * @function isSupported
 * @param {Window} window
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities;

    /** @lends isSupported */
    function isSupported(window) {
        var document = window.document;

        var isIE = u.isIE(document);
        if (isIE) {
            var isIE8orOlder = u.isIE8orOlder(document);
            if (isIE8orOlder) {
                return false;
            }
        }

        return u.supportsCanvas(document)
            && u.supportsPropertyDefining(window);
    }


    pr.isSupported = isSupported;

})(
    window.parari = window.parari || {},
    document);