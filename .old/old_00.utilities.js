/**
 * Utilitis for parari.
 * @membrerof para
 * @namespace utilities
 */
(function (pr, document) {
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
        devicePixelRatio: window.devicePixelRatio || 1,
        /**
         * Insert element
         * @param {HTMLElement} newElement
         * @param {HTMLElement} targetElement
         */
        insertAfter: function (newElement, targetElement) {
            var parent = targetElement.parentNode;
            if (!parent) {
                return parent;
            }
            var isLast = parent.lastchild === targetElement;
            if (isLast) {
                parent.appendChild(newElement);
            } else {
                parent.insertBefore(newElement, targetElement.nextSibling);
            }
        },
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
            canvas.width = w * ratio;
            canvas.height = h * ratio;
            ctx.scale(ratio, ratio);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
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
         * Copy a object.
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
         * Get style object.
         * @param {HTMLElement} elm - The element.
         * @returns {object} - Element styles.
         */
        getStyles: function (elm) {
            var style = window.getComputedStyle(elm, ''),
                result = {};
            for (var i = 0, len = style.length; i < len; i++) {
                var key = style[i],
                    val = style.getPropertyValue(key);
                if (val) {
                    result[key] = val;
                }
            }
            return result;
        },
        /**
         * Get style string for a element.
         * @param {HTMLElement} elm - The element.
         * @returns {string} - Element style string.
         */
        getStyleString: function (elm) {
            var styles = u.getStyles(elm);
            return Object.keys(styles)
                .map(function (key) {
                    var val = styles[key];
                    return [key, val].join(':');
                })
                .join(';');
        },
        /**
         * Get child elements of a element.
         * @param {HTMLElement} elm
         * @returns {Array}
         */
        getChildElements: function (elm) {
            var childElements = [],
                nodes = elm.childNodes;
            for (var i = 0; i < nodes.length; i++) {
                var isElement = nodes[i].nodeType === 1;
                if (isElement) {
                    childElements.push(nodes[i]);
                }
            }
            return childElements;
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
         * Get rating value.
         * @param {number} min - Minimum value.
         * @param {number} max - Maxmium value.
         * @param {number} value - Value to rate.
         * @returns {number} - Rate value (betewee 0 and 1).
         */
        rate: function (min, max, value) {
            var range = max - min;
            return (value - min ) / range;
        },
        /**
         * Visible elm in window.
         * @param {HTMLElement} elm
         */
        visibleRect: function (elm) {
            var offset = u.offsetSum(elm),
                w = elm.offsetWidth,
                h = elm.offsetHeight;
            var left = offset.left,
                right = left + w,
                top = offset.top,
                bottom = top + h;
            if (window.innerWidth < right) {
                w = window.innerWidth - left;
            }
            if (window.innerHeight < bottom) {
                h = window.innerHeight - top;
            }
            return {
                left: left,
                top: top,
                width: w,
                height: h
            };
        },
        /**
         * Center point for a element.
         * @param {HTMLElement} elm
         * @returns {{x: *, y: *}}
         */
        centerPoint: function (elm) {
            var w = elm.offsetWidth,
                h = elm.offsetHeight;
            var offset = u.offsetSum(elm);
            return {
                x: offset.left + (w / 2),
                y: offset.top + (h / 2)
            };
        },
        /**
         * Convert html to svg embeddable.
         * @param {string} html - Html string.
         * @returns {string} - Converted html string.
         */
        toSVGEmbeddableHtml: function (html) {
            var workingDiv = document.createElement('div');
            workingDiv.innerHTML = html;
            var imgs = workingDiv.querySelectorAll('img');
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                img.parentNode.removeChild(img);
            }
            return workingDiv.outerHTML.replace(/&nbsp;/g, '');
        },
        toSVGString: function (html, width, height) {
            html = u.toSVGEmbeddableHtml(html);
            return [
                    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">',
                '<foreignObject width="100%" height="100%">',
                    '<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;position:relative;">' + html + '</div>',
                '</foreignObject>' ,
                '</svg>'
            ].join('');
        },
        /**
         * Convert an html to a image.
         * @param {string} html -  Html string.
         * @param {number} width - Render width.
         * @param {number} height - Render height.
         * @param {function} callback - Callback when done.
         */
        htmlToImage: function (html, width, height, callback) {
            var svgString = u.toSVGString(html, width, height),
                svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'}),
                src = u.createObjectURL(svg),
                image = new Image();
            image.onload = function () {
                callback && callback(image);
            };
            image.onerror = function (err) {
                console.error(err.stack || err);
                console.log('Failed to create image from html:', html);
                callback && callback(null);
            };
            image.src = src;
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
         * Get a random int.
         * @param {number} min - Min value.
         * @param {number} max - Max value.
         */
        randomInt: function (min, max) {
            var range = max - min;
            return parseInt(min + range * Math.random());
        },
        hsv2rgb: function (h, s, v) {
            //r, g, b means  red, blue, green, 0 ~ 255.
            //a means alpha, 0.0 ~ 1.0
            //h means hue, 0 ~ 360
            //s, v means saturation, value of brgitness, 0 ~ 100
            var rgb = (function (h, s, v) {
                if (s == 0) return ({r: v, g: v, b: v});//gray
                h = h % 360;
                var i = Math.floor(h / 60);
                var f = h / 60 - i;
                v = v * 255 / 100;
                var m = v * (1 - s / 100);
                var n = v * (1 - s / 100 * f);
                var k = v * (1 - s / 100 * (1 - f));
                switch (i) {
                    case 0:
                        return {r: v, g: k, b: m};
                    case 1:
                        return {r: n, g: v, b: m};
                    case 2:
                        return {r: m, g: v, b: k};
                    case 3:
                        return {r: m, g: n, b: v};
                    case 4:
                        return {r: k, g: m, b: v};
                    case 5:
                        return {r: v, g: m, b: n};
                }
            })(h, s, v);
            rgb.r = parseInt(rgb.r);
            rgb.g = parseInt(rgb.g);
            rgb.b = parseInt(rgb.b);
            return rgb;
        },
        rgba2string: function (r, g, b, a) {
            if (!a) a = 1;
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        },
        hsv2rgbaString: function (h, s, v) {
            var rgba = this.hsv2rgb(h, s, v)
            return this.rgba2string(rgba.r, rgba.g, rgba.b);
        }
    };

    pr.utilities = u;

})(window.parari = window.parari || {}, document);