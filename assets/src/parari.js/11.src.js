/**
 * Data source.
 * @memberof parari
 * @constructor Src
 * @param {HTMLElement} elm - Element which contains the slide data source.
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends Src */
    function Src(elm) {
        var s = this;
        elm.classList.add(c.classNames.SRC);
    };

    Src.prototype = {

    }

    pr.Src = Src;

})(window.parari = window.parari || {}, document);