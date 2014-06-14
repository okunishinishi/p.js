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
            var object = s.objects[i],
                baseX = object.getLeft() - scrollX,
                baseY = object.getTop() -scrollY;
            object.draw(ctx, baseX, baseY);
        }
    };


})(window.para = window.para || {});