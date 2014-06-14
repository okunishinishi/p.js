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
        var dx = s.hLock ? 0 : s.dx * (1 - speed),
            dy = s.vLock ? 0 : s.dy * (1 - speed);
        ctx.drawImage(s.image,
                left - x * speed - dx,
                top - y * speed - dy);
    };


})(window.para = window.para || {});

