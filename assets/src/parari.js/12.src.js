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
        s.elm = elm;
    };

    Src.prototype = {
        /**
         * Source element.
         */
        elm: null,

        _findObjectElements: function () {
            var s = this,
                selector = c.OBJECT_SELECOTR,
                elements = s.elm.querySelectorAll(selector);
            return u.toArray(elements);
        },
        /**
         * Create fragments from src.
         * @returns {pr.Fragment[]}
         */
        createFragments: function () {
            var s = this;
            return s._findObjectElements()
                .map(function (elm) {
                    return new pr.Fragment(elm);
                });
        }
    }

    pr.Src = Src;

})(window.parari = window.parari || {}, document);