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
        console.log(x, y);
        ctx.drawImage(s.image, s.getLeft() - x, s.getTop() - y);
    };


})(window.para = window.para || {});