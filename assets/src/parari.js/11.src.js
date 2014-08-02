/**
 * Create src element, which holds src markuped elements.
 * @memberof parari
 * @constructor Src
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends Src */
    function Src(elm, style) {
        var s = this;
        s.style = style;
        s.elm = elm;
        s.elm.classList.add(Src._className);
    }

    Src.prototype = {
        /**
         * Find pr objects included in the src.
         * @returns {*}
         */
        _findElements: function () {
            var s = this,
                selector = Src._objectSelector,
                objects = s.elm.querySelectorAll(selector);
            return u.toArray(objects);
        },
        /**
         * Get parari objects.
         * @param options
         * @returns {*}
         */
        getObjects: function (options) {
            var s = this;
            return s._findElements().map(function (elm) {
                var object = pr.Object.fromElement(elm);
                u.copy(options || {}, object);
                return object;
            });
        }
    }

    Src._objectSelector = '[data-' + pr.prefixed('object') + ']';
    Src._className = pr.prefixed('src');

    pr.Src = Src;

})(window.parari = window.parari || {}, document);