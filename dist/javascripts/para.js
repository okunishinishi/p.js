/**
 * para.js
 * @license MIT
 * @author Taka Okunishi
 */

window.para = (function (para) {

    /**
     * Para object
     * @memberof para
     * @constructor Object
     */

    (function (para) {
        "use strict";


        var u = para.util;

        /**
         * Create an
         * @lends para.Object
         * @param {object} data - Data to load.
         */
        para.Object = function (data) {
            var s = this;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    s[key] = data[key];
                }
            }
        };

        /**
         * Load object data as image.
         * @param {function} callback - Callback when done.
         */
        para.Object.prototype.load = function (callback) {
            var s = this;
            u.htmlToImage(s.html, s.width, s.height, function (image) {
                s.image = image;
                callback(s);
            });
        };

        /**
         * Get left position.
         * @returns {*}
         */
        para.Object.prototype.getLeft = function () {
            var s = this;
            return s.x - s.width / 2;
        };

        /**
         * Get top position.
         * @returns {*}
         */
        para.Object.prototype.getTop = function () {
            var s = this;
            return s.y - s.height / 2;
        };

        /**
         * Draw object.
         * @param {CanvasRenderingContext2D} ctx
         * @param {number} x
         * @param {number} y
         */
        para.Object.prototype.draw = function (ctx, x, y) {
            var s = this;
            var left = s.getLeft(),
                top = s.getTop(),
                speed = s.speed;
            var dx = s.dx * (1 - speed),
                dy = s.dy * (1 - speed);
            ctx.drawImage(s.image,
                    left - x * speed - dx,
                    top - y * speed - dy);
        };


    })(window.para = window.para || {});
    /**
     * Para Screen.
     * @memberof para
     * @constructor Screen
     */

    (function (para) {
        "use strict";

        var u = para.util;

        /**
         *
         * @lends para.Screen
         * @param {HTMLElement} canvas - Canvas element
         */
        para.Screen = function (canvas) {
            var s = this;
            s.canvas = canvas;
            s.objects = [];
        };

        /**
         * Get canvas context.
         * @returns {CanvasRenderingContext2D}
         */
        para.Screen.prototype.getContext = function () {
            var s = this,
                ctx = s._ctx;
            if (!ctx) {
                ctx = s._ctx = s.canvas.getContext('2d');
                u.optimizeCanvasRatio(s.canvas, ctx);
            }
            return ctx;
        };

        /**
         * Insert the canvas after element
         * @param {HTMLElement} element - Target element
         */
        para.Screen.prototype.insertAfter = function (element) {
            var s = this;
            u.insertAfter(s.canvas, element);
        };

        /**
         * Load objects.
         * @param {para.Object[]} objects - Objects to load.
         * @param {function} callback - Callback when done.
         */
        para.Screen.prototype.loadObjects = function (objects, callback) {
            var s = this;
            var queue = [].concat(objects);
            var object = queue.shift();
            if (!object) {
                callback(s);
                return;
            }
            object.load(function (object) {
                var center = u.centerPoint(s.canvas);
                object.dx = object.x - center.x;
                object.dy = object.y - center.y;
                s.objects.push(object);
                s.loadObjects(queue, callback);
            });
        };

        /**
         * Draw screen.
         */
        para.Screen.prototype.draw = function (scrollX, scrollY) {
            var s = this,
                ctx = s.getContext();
            ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);

            for (var i = 0, len = s.objects.length; i < len; i++) {
                s.objects[i].draw(ctx, scrollX, scrollY);
            }
        };


    })(window.para = window.para || {});
    /**
     * Start para.
     * @function start
     */

    (function (para, document) {
        "use strict";

        var u = para.util;


        function createSrc(root, w, h) {
            var src = u.ensureElement(root);
            src.classList.add('pr-src');
            src.style.width = w + 'px';
            src.style.height = h + 'height';
            src.findPrObjects = function () {
                return u.toArray(src.querySelectorAll('[data-pr-object]'));
            };
            return src;
        }

        function createScreen(w, h) {
            var id = ['pr', 'screen', new Date().getTime()].join('-');
            var canvas = u.newCanvas(id, w, h);
            canvas.classList.add('pr-screen');
            return  new para.Screen(canvas);
        }


        function createObject(elm, style) {
            var w = elm.offsetWidth,
                h = elm.offsetHeight,
                point = u.centerPoint(elm);
            var data = elm.dataset;
            var elmStyle = u.getStyleString(elm);
            return new para.Object({
                width: w,
                height: h,
                x: point.x,
                y: point.y,
                speed: Number(data.prSpeed || 1),
                html: [
                        '<div class="pr-object" style="' + elmStyle + '">',
                        '<style type="text/css">' + style + '</style>',
                    elm.innerHTML,
                    '</div>'
                ].join('')
            });
        }


        para.start = function (root, options) {

            var w = options.width || window.innerWidth,
                h = options.height || window.innerHeight;

            var style = u.getDocumentStyleString();

            var body = document.body,
                src = createSrc(root, w, h),
                screen = createScreen(w, h),
                objects = src.findPrObjects().map(function (src) {
                    return createObject(src, style);
                });

            function redraw() {
                var x = body.scrollLeft,
                    y = body.scrollTop;
                screen.draw(x, y);
            }

            screen.insertAfter(src);
            screen.loadObjects(objects, redraw);

            window.addEventListener('scroll', redraw, false);

        };
    })(window.para = window.para || {}, document);
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


    return para;

})({});