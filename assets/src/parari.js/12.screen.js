/**
 * Screen element.
 * @memberof parari
 * @constructor Screen
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities;


    /**
     * @lends Screen
     * @param {HTMLElement} canvas - Canvas element
     */
    function Screen(canvas) {
        var s = this;
        s.canvas = canvas;
        s.objects = [];
        s.wrapCanvas(s.canvas);
        s.canvas.addEventListener('click', function (e) {
            s.onclick(e);
        }, false);
    };

    Screen.prototype = {
        /**
         * Wrap canvas element with screen div.
         */
        wrapCanvas: function (canvas) {
            var div = document.createElement('div');
            div.classList.add(Screen._className);
            u.insertAfter(div, canvas);
            div.appendChild(canvas);
        },
        /**
         * Get canvas context.
         * @returns {CanvasRenderingContext2D}
         */
        getContext: function () {
            var s = this,
                ctx = s._ctx;
            if (!ctx) {
                ctx = s._ctx = s.canvas.getContext('2d');
            }
            return ctx;
        },
        /**
         * Handle click event.
         * @param {Event} e
         */
        onclick: function (e) {
            var s = this,
                x = e.offsetX, y = e.offsetY;
            for (var i = 0, len = s.objects.length; i < len; i++) {
                var object = s.objects[len - 1 - i];
//                    hit = object.bounds.contains(x, y);
//                console.log(hit);
            }
        },
        /**
         * Load objects.
         * @param {para.Object[]} objects - Objects to load.
         * @param {function} callback - Callback when done.
         */
        loadObjects: function (objects, callback) {
            var s = this;
            var queue = [].concat(objects);
            var object = queue.shift();
            if (!object) {
                callback(s);
                return;
            }
            object.load(function () {
                var center = u.centerPoint(s.canvas);
                object.dx = object.x - center.x;
                object.dy = object.y - center.y;
                s.objects.push(object);
                s.loadObjects(queue, callback);
            });
            object.onPrImgLoad = function (img) {
                s.addImgElement(img);
                s.redraw();
            };
        },
        /**
         * Resort objects.
         */
        resort: function () {
            var s = this;
            s.objects = s.objects.sort(function (a, b) {
                return Number(a.z || 0) - Number(b.z || 0);
            });
        },
        /**
         * Add a image elemnt.
         * @param img
         */
        addImgElement: function (img) {

            var s = this,
                obj = new pr.Object(img);
            obj.image = img;
            obj.z = 10;
            obj.load = function (callback) {
                var center = u.centerPoint(s.canvas);
                obj.dx = obj.x - center.x;
                obj.dy = obj.y - center.y;
                s.objects.push(obj);
                s.resort();
                callback && callback(null);
            };
            obj.invalidate = function () {
                var s = this;
                s.offset = u.offsetSum(img);
            };
            obj.invalidate();
            obj.draw = function (ctx, scrollX, scrollY) {
                var s = this;
                if (!s.image) {
                    return;
                }

                var w = s.width || s.image.width,
                    h = s.height || s.image.height;
                var left = s.offset.left,
                    top = s.offset.top;
                var x = left - scrollX,
                    y = top - scrollY;
                ctx.drawImage(s.image, x, y, w, h);
            }

            obj.load(function () {
                setTimeout(function () {
                    s.invalidate();
                    s.redraw();
                }, 100);
            });
        },
        /**
         * Draw screen.
         */
        draw: function (scrollX, scrollY) {
            var s = this,
                ctx = s.getContext();
            ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);

            for (var i = 0, len = s.objects.length; i < len; i++) {
                s.objects[i].draw(ctx, scrollX, scrollY);
            }
        },
        /**
         * Set screen size.
         * @param {number} w - Screen width.
         * @param {number} h - Screen height.
         */
        size: function (w, h) {
            var s = this;
            s.canvas.width = w;
            s.canvas.height = h;
            u.optimizeCanvasRatio(s.canvas, s.getContext());
            for (var i = 0; i < s.objects.length; i++) {
                s.objects[i].setBounds(0, 0, w, h);
            }
            s.redraw();
        },
        /**
         * Element to tell the scroll position.
         */
        scroller: null,
        /**
         * Element to toll the sieze.
         */
        sizer: null,
        /**
         * Redraw screen with scroller position.
         */
        redraw: function () {
            var s = this,
                x = s.scroller.scrollLeft,
                y = s.scroller.scrollTop;
            s.draw(x, y);
        },
        invalidate: function () {
            var s = this;
            for (var i = 0; i < s.objects.length; i++) {
                var object = s.objects[i];
                object && object.invalidate();
            }
        },
        /**
         * Resize screen with sizer size.
         */
        resize: function () {
            var s = this,
                rect = u.visibleRect(s.sizer),
                w = rect.width,
                h = rect.height;
            s.size(w, h);
            setTimeout(function () {
                s.invalidate();
                s.redraw();
            }, 1);
        }
    };

    Screen._className = pr.prefixed('screen');

    pr.Screen = Screen;

})(window.parari = window.parari || {}, document);