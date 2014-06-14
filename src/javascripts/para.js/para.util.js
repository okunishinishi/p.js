/**
 * Utility functions for para.
 * @namespace util
 */
(function (para, document) {
    "use strict";

    var u = {
        URL: window.URL || window.webkitURL || window.mozURL || window,
        /**
         * Create an object url.
         * @returns {string} - Object url
         */
        createObjectURL: function () {
            return u.URL.createObjectURL.apply(u.URL, arguments);
        },
        /**
         * Revoke an object url.
         * @returns {*}
         */
        revokeObjectURL: function () {
            return u.URL.revokeObjectURL.apply(u.URL, arguments);
        },
        /**
         * Device pixel ratio.
         */
        devicePixelRatio: window.devicePixelRatio,
        /**
         * Optimize canvas pixel rate.
         * @param {HTMLElement} canvas
         * @param ctx
         */
        optimizeCanvasRatio: function (canvas, ctx) {
            var ratio = u.devicePixelRatio;
            if (!ratio) {
                return;
            }
            var w = canvas.width,
                h = canvas.height;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            canvas.width = w * ratio;
            canvas.height = h * ratio;
            ctx.scale(ratio, ratio);
        },

        /**
         * Convert an html to a image.
         * @param {string} html -  Html string.
         * @param {number} width - Render width.
         * @param {number} height - Render height.
         * @param {function} callback - Callback when done.
         */
        htmlToImage: function (html, width, height, callback) {
            var svgString = [
                        '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">',
                    '<foreignObject width="100%" height="100%">',
                        '<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%">' + html + '</div>',
                    '</foreignObject>' ,
                    '</svg>'
                ].join(''),
                svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'}),
                src = u.createObjectURL(svg),
                image = new Image();
            image.onload = function () {
                callback(image);
            };
            image.src = src;
        },
        /**
         * Get css texts
         * @returns {string} css string.
         */
        getDocumentStyleString: function () {
            var result = '';
            var styleSheets = document.styleSheets;
            for (var i = 0; i < styleSheets.length; i++) {
                var rules = styleSheets[i].cssRules;
                for (var j = 0; j < rules.length; j++) {
                    result += rules[j].cssText + ' ';
                }
            }
            return result;
        },
        getStyleString: function (elm) {
            var style = window.getComputedStyle(elm, ''),
                result = '';
            for (var i = 0, len = style.length; i < len; i++) {
                var key = style[i],
                    val = style.getPropertyValue(key);
                result += [key, val].join(':') + ';';
            }
            return result;
        },
        /**
         * Create a new canvas.
         * @param {string} id - Canvas element id.
         * @param {number} width - Canvas width.
         * @param {number} height - Canvas height.
         * @returns {HTMLElement}
         */
        newCanvas: function (id, width, height) {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.id = id;
            return canvas;
        },
        /**
         * Make sure that element is a HTML element.
         * @param {HTMLElement|string} elm - Html element or element id.
         * @returns {HTMLElement}
         */
        ensureElement: function (elm) {
            if (typeof(elm) === 'string') {
                return document.getElementById(elm);
            }
            return elm;
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
         * Insert element
         * @param {HTMLElement} newElement
         * @param {HTMLElement} targetElement
         */
        insertAfter: function (newElement, targetElement) {
            var parent = targetElement.parentNode;
            var isLast = parent.lastchild == targetElement;
            if (isLast) {
                parent.appendChild(newElement);
            } else {
                parent.insertBefore(newElement, targetElement.nextSibling);
            }
        },
        /**
         * Center point for a element.
         * @param {HTMLElement} elm
         * @returns {{x: *, y: *}}
         */
        centerPoint: function (elm) {
            var w = elm.offsetWidth,
                h = elm.offsetHeight;
            return {
                x: elm.offsetLeft + (w / 2),
                y: elm.offsetTop + (h / 2)
            };
        }
    };

    para.util = u;

})(window.para = window.para || {}, document);