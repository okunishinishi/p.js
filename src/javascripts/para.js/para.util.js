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
                        '<div xmlns="http://www.w3.org/1999/xhtml">' + html + '</div>',
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
        }
    };

    para.util = u;

})(window.para = window.para || {}, document);