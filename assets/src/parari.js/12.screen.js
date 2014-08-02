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
                u.optimizeCanvasRatio(s.canvas, ctx);
            }
            return ctx;
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
            object.load(function (object) {
                var center = u.centerPoint(s.canvas);
                object.dx = object.x - center.x;
                object.dy = object.y - center.y;
                s.objects.push(object);
                s.loadObjects(queue, callback);
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
        /**
         * Resize screen with sizer size.
         */
        resize: function () {
            var s = this,
                w = s.sizer.innerWidth,
                h = s.sizer.innerHeight;
            s.size(w, h);
        }
    };

    Screen._className = pr.prefixed('screen');

    pr.Screen = Screen;

})(window.parari = window.parari || {}, document);