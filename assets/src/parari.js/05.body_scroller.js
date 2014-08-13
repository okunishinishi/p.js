/**
 * Object to get body scroll amount.
 * @membrerof parari
 * @member bodyScroller
 * @property {number} scrollLeft - Scroll left position.
 * @property {number} scrollTop - Scroll top position.
 */
(function (pr) {
    "use strict";

    var u = pr.utilities;

    pr.bodyScroller = {
        _scrollValueForKey: function (key) {
            return document.documentElement[key] || document.body[key];
        },
        get scrollLeft() {
            var s = this;
            return s._scrollValueForKey('scrollLeft');
        },
        get scrollTop() {
            var s = this;
            return s._scrollValueForKey('scrollTop');
        }
    };


})(window.parari = window.parari || {});