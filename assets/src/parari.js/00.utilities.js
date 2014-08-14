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
         * Camelize a string.
         * @param {string} string - String to camelize.
         * @returns {string} - Camlized string.
         */
        camelize: function (string) {
            string = string.replace(/(?:^|[-_])(\w)/g, u._camlizeReplace);
            string = string.substr(0, 1).toLowerCase() + string.substr(1);
            return string;
        },
        _camlizeReplace: function (_, letter) {
            return letter ? letter.toUpperCase() : '';
        },
        /**
         * Composite functions.
         * @param {...function} actions - Functions to compositse.
         * @returns {function} - Composited function.
         */
        composite: function () {
            var actions = u.toArray(arguments);
            return function () {
                var s = this, args = arguments,
                    results = [];
                for (var i = 0; i < actions.length; i++) {
                    var result = actions[i].apply(s, args);
                    results.push(result);
                }
                return results;
            }
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
         * Get offset x for an event.
         * @param {Event} e - Event
         * @returns {Number} - Offset x value.
         */
        eventOffsetX: function (e) {
            return (e.offsetX == undefined) ? e.layerX : e.offsetX;
        },
        /**
         * Get offset y for an event.
         * @param {Event} e - Event
         * @returns {Number} - Offset y value.
         */
        eventOffsetY: function (e) {
            return (e.offsetY == undefined) ? e.layerY : e.offsetY;
        },
        /**
         * Get style of an element.
         * @param {HTMLElement} elm - Element
         * @returns {CSSStyleDeclaration|*}
         */
        getComputedStyle: function (elm) {
            return window.getComputedStyle(elm, '');
        },
        /**
         * Is Internet Explorer or not.
         * @param {HTMLDocument} document - Document to detect.
         */
        isIE: function (document) {
            return !!document.all;
        },
        /**
         * Detecit if ie8 or older.
         * @param {HTMLDocument} document - Document to detect.
         * @returns {boolean}
         */
        isIE8orOlder: function (document) {
            return isIE(document) && !document.addEventListener;
        },
        /**
         * Detect textNode or not.
         * @param {HTMLNode} node - A node to detect.
         * @returns {boolean} - Is a text node or not.
         */
        isTextNode: function (node) {
            return !!node && (node.nodeType === Node.TEXT_NODE);
        },
        /**
         * Detect elementNode or not.
         * @param {HTMLNode} node - A node to detect.
         * @returns {boolean} - Is an element node or not.
         */
        isElementNode: function (node) {
            return !!node && (node.nodeType === Node.ELEMENT_NODE);
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
         * Get random value.
         * @returns {number} - Random value.
         */
        random: Math.random.bind(Math),
        /**
         * Round a value.
         * @param {number} value - Value to round.
         * @returns {number} - Rounded value.
         */
        round: Math.round.bind(Math),
        /**
         * Detect canvas supports.
         * @param {HTMLDocument} document - Document to work with.
         * @returns {boolean} - Supports or not.
         */
        supportsCanvas: function (document) {
            return !!document.createElement('canvas').getContext;
        },
        /**
         * Detect property defining supports.
         * @param {window} Window - Window.
         * @returns {boolean}
         */
        supportsPropertyDefining: function (window) {
            return !!window.Object.defineProperty;
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