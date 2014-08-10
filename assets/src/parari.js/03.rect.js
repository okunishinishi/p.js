/**
 * Object to represent rectangle.
 * @membrerof parari
 * @constructor Rect
 * @param {number} left - Left position.
 * @param {number} top - Top position.
 * @param {number} width - Horizontal size.
 * @param {number} height - Vertical size.
 */
(function (pr) {
    "use strict";

    var u = pr.utilities;

    /** @lends Rect */
    function Rect(left, top, width, height) {
        var s = this;
        s.left = left;
        s.top = top;
        s.width = width;
        s.height = height;
    }

    Rect.prototype = {
        /** Left position */
        left: 0,
        /** Top position */
        top: 0,
        /** Right position. */
        get right() {
            var s = this;
            return s.left + s.width;
        },
        /** Bottom position */
        get bottom() {
            var s = this;
            return s.top + s.height;
        },
        /** Height */
        width: 0,
        /** With */
        height: 0,
        /**
         * Center point.
         * @returns {{x: number, y: number}}
         */
        get center() {
            var s = this;
            return {
                x: (s.left + s.right) / 2,
                y: (s.top + s.bottom) / 2
            }
        },
        /**
         * Create a clone of this rect.
         * @returns {Rect}
         */
        clone: function () {
            var s = this;
            return new Rect(s.left, s.top, s.width, s.height);
        },
        /**
         * Contains a porint or not.
         * @param {number} x - X position.
         * @param {number} y - Y position.
         * @returns {boolean} - Contains or not.
         */
        contains: function (x, y) {
            var s = this;
            return (s.left <= x) && (x <= s.right) &&
                (s.top <= y) && (y <= s.bottom);
        },
        /**
         * Create a clipped rect.
         * @param {Rect} bounds
         * @returns {Rect} - Clpped rect.
         */
        clip: function (bounds) {
            var s = this;
            var left = u.max(s.left, bounds.left),
                top = u.max(s.top, bounds.top),
                right = u.min(s.right, bounds.right),
                bottom = u.min(s.bottom, bounds.bottom);
            var w = right - left, h = bottom - top;
            return new Rect(left, top, w, h);
        },
        /**
         * Create a relative rect.
         * @param {Rect} bounds - Bounds rect.
         */
        relative: function (bounds) {
            var s = this;
            var left = s.left - bounds.left,
                top = s.top - bounds.top,
                w = s.width,
                h = s.height;
            return new Rect(left, top, w, h);

        }
    };


    pr.Rect = Rect;

    /**
     * Rect for an element.
     * @param {HTMLElement} elm - Element.
     */
    pr.Rect.ofElement = function (elm, bounds) {
        var offset = u.offsetSum(elm),
            left = offset.left,
            top = offset.top,
            w = elm.offsetWidth,
            h = elm.offsetHeight;
        var rect = new Rect(left, top, w, h);
        return bounds ? rect.relative(bounds) : rect;
    };

    /**
     * Zero rect.
     * @returns {Rect}
     * @constructor
     */
    pr.Rect.RectZero = function () {
        return new Rect(0, 0, 0, 0);
    }


})(window.parari = window.parari || {});