/**
 * Rect.
 * @membrerof para
 * @constructor Rect
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
        }
    };

    pr.Rect = Rect;


})(window.parari = window.parari || {});