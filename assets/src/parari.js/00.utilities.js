/**
 * Utilities for parari.
 * @membrerof parari
 * @namespace utilities
 */
(function (pr, document) {
    "use strict";
    var u = {
        /**
         * Reduce function to concat. Should be passed to Array.prototype.reduce.
         * @param {*} prev - Previous entry.
         * @param {*} cur - Current entry.
         * @returns {*}
         */
        concatReduce: function (prev, cur) {
            return prev.concat(cur);
        },

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
         * Device pixel ratio.
         */
        devicePixelRatio: window.devicePixelRatio || 1,
        /**
         * Extract number from text.
         * @param {string} text - Text to extract from.
         * @returns {number} - Extracted number.
         * @example extractNumber('20px')
         */
        extractNumber: function (text) {
            return Number(text.replace(/[^\d\.]/g, ''));
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
         * Optimize canvas pixel rate.
         * @param {HTMLElement} canvas
         */
        optimizeCanvasRatio: function (canvas) {
            var ratio = u.devicePixelRatio;
            if (!ratio) {
                return;
            }
            var w = canvas.width,
                h = canvas.height;
            canvas.width = w * ratio;
            canvas.height = h * ratio;
            canvas.getContext('2d').scale(ratio, ratio);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
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
        /**
         * Trigger a event.
         * @param {HTMLElement} elm - A html element.
         * @param {string} eventName - Evenet name.
         */
        triggerEvent: function (elm, eventName) {
            var event;
            if (document.createEvent) {
                event = document.createEvent("HTMLEvents");
                event.initEvent(eventName, true, true);
                elm.dispatchEvent(event);
            } else {
                event = document.createEventObject();
                event.eventType = eventName;
                elm.fireEvent('on' + eventName, event);
            }
        }
    }
    pr.utilities = u;

})(window.parari = window.parari || {}, document);