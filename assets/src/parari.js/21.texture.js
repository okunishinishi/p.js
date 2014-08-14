/**
 * Parari texture
 * @memberof parari
 * @constructore Texture
 * @param {object} options - Optional settings.
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities;

    /** @lends Texture */
    function Texture(options) {
        var s = this;
        u.copy(options || {}, s);
    }

    Texture.prototype = {
        /**
         * Render texture.
         * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
         * @param {number} scrollX
         * @param {number} scrollY
         */
        render: function (ctx, scrollX, scrollY) {

        },
        /**
         * Sync texture.
         * @param {parari.Rect} canvasBounds - Bounds of the canvas.
         */
        sync: function (canvasBounds) {
            var s = this,
                w = canvasBounds.width,
                h = canvasBounds.height;
            s.bounds = new pr.Rect(0, 0, w, h);
        }
    };

    u.copy(
        /** @lends Texture */
        {
            /**
             * Create a new canvas.
             * @param {nubmer} width - Canvas width.
             * @param {number} height - Canvas height.
             * @returns {*}
             */
            newCanvas: function (width, height) {
                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                u.optimizeCanvasRatio(canvas);
                return canvas;
            }
        },
        Texture
    );

    pr.textures.Texture = Texture;

})(window.parari = window.parari || {}, document);