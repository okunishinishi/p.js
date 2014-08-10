/**
 * Utilities for parari.
 * @membrerof parari
 * @namespace utilities
 */
(function (pr, document) {
    "use strict";
    var u = {
        /**
         * Copy object.
         * @param {object} src - Object to copy from.
         * @param {object} dest - Object to copy to.
         * @returns {object} - Destination object.
         */
        copy: function (src, dest) {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    dest[key] = src[key];
                }
            }
            return dest;
        },
        /**
         * Get max value.
         * @param {number...} values - Values to compare.
         */
        max: function () {
            return u.toArray(arguments)
                .sort(function (a, b) {
                    return b - a;
                })[0];
        },
        /**
         * Get min value.
         * @param {number...} values - Values to compare.
         */
        min: function () {
            return u.toArray(arguments)
                .sort(function (a, b) {
                    return a - b;
                })[0];
        },
        /**
         * Get offset from window.
         * @param {HTMLElement} elm
         * @returns {{top: number, left: number}}
         */
        offsetSum: function (elm) {
            var top = 0, left = 0;
            while (elm) {
                top = top + parseInt(elm.offsetTop, 10);
                left = left + parseInt(elm.offsetLeft, 10);
                elm = elm.offsetParent;
            }
            return {top: top, left: left};
        },
        /**
         * Convert an iteratable object to array.
         * @param iteratable
         * @returns {Array}
         */
        toArray: function (iteratable) {
            return Array.prototype.slice.call(iteratable, 0);
        },
        /**
         * Make sure that element is a HTML element.
         * @param {HTMLElement|string} elm - Html element or element id.
         * @returns {HTMLElement}
         */
        toElement: function (elm) {
            if (typeof(elm) === 'string') {
                return document.getElementById(elm);
            }
            return elm;
        },
    }
    pr.utilities = u;

})(window.parari = window.parari || {}, document);