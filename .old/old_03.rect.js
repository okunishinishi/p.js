/**
 * Object to represent rectangle.
 * @membrerof parari
 * @constructor Rect
 * @param {number} left - Left position.
 * @param {number} top - Top position.
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
        left: 0,
        top: 0,
        get right() {
            var s = this;
            return s.left + s.width;
        },
        get bottom() {
            var s = this;
            return s.top + s.height;
        },
        width: 0,
        height: 0,
        get center() {
            var s = this;
            return {
                x: (s.left + s.right) / 2,
                y: (s.top + s.bottom) / 2
            }
        },
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
        }
    };


    pr.Rect = Rect;

    pr.Rect.RectZero = function () {
        return new Rect(0, 0, 0, 0);
    }


})(window.parari = window.parari || {});