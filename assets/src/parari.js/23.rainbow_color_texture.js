/**
 * Parari texture.
 * @memberof parari
 * @augments Texture
 * @constructore RainbowColorTexture
 * @param {object} options - Optional settings.
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        Texture = pr.textures.Texture;

    /** @lends RainbowColorTexture */
    function RainbowColorTexture(options) {
        var s = this;
        u.copy(options || {}, s);
    }


    RainbowColorTexture.prototype = u.copy(
        /** @lends RainbowColorTexture.prototype */
        {
            hue: 0,
            saturation: 80,
            value: 80,
            velocity: 0.5,
            alpha: 1,
            /**
             * Render texture.
             * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
             * @param {CanvasRenderingContext2D} ctx - Canvas 2d context.
             * @param {number} scrollX
             * @param {number} scrollY
             */
            render: function (ctx, scrollX, scrollY) {
                var s = this,
                    bounds = s.bounds;
                if (!bounds) {
                    return;
                }
                var v = Number(s.velocity);
                var xFactor = (scrollX * v) / bounds.width,
                    yFactor = (scrollY * v) / bounds.height,
                    factor = u.average(xFactor, yFactor);

                ctx.save();

                ctx.beginPath();
                ctx.rect(bounds.left, bounds.top, bounds.width, bounds.height);
                ctx.fillStyle = s.fillColor(factor);
                ctx.fill();
                ctx.closePath();

                ctx.restore();
            },
            /**
             * Get color for facor.
             * @param {number} factor - Factor value.
             * @returns {string} - Fill color hex string.
             */
            fillColor: function (factor) {
                var s = this,
                    hue = (s.hue + (factor / 2 + 1) * 360) % 360;
                var rgb = u.hsv2rgb(hue, s.saturation, s.value);
                return u.rgba2string(rgb.r, rgb.g, rgb.b, s.alpha);
            }

        },
        new Texture({})
    );

    u.copy(Texture, RainbowColorTexture);
    u.copy(
        /** @lends RainbowColorTexture */
        {

        },
        RainbowColorTexture);

    pr.textures.RainbowColorTexture = RainbowColorTexture;

})(window.parari = window.parari || {}, document);