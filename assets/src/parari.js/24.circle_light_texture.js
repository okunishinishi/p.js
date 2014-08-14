/**
 * Parari texture.
 * @memberof parari
 * @augments Texture
 * @constructore CircleLightTexture
 * @param {object} options - Optional settings.
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        Texture = pr.textures.Texture;

    /** @lends CircleLightTexture */
    function CircleLightTexture(options) {
        var s = this;
        u.copy(options || {}, s);
    }


    CircleLightTexture.prototype = u.copy(
        /** @lends CircleLightTexture.prototype */
        {
            z: -11,
            velocity: 0.5,
            expansion: 3,
            radius: 120,
            top:80,
            left:80,
            colors: [
                'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)'
            ],
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
                ctx.save();

                ctx.rect(bounds.left, bounds.top, bounds.width, bounds.height);

                var v = Number(s.velocity),
                    xFactor = (scrollX * v) / bounds.width,
                    yFactor = (scrollY * v) / bounds.height,
                    factor = u.average(xFactor, yFactor),
                    radius = s.radius,
                    rx = s.left,
                    ry = s.top;


                var gradient = ctx.createRadialGradient(rx, ry, radius, rx, ry, radius * (s.expansion - 1 + Math.abs(factor)));
                for (var i = 0; i < s.colors.length; i++) {
                    gradient.addColorStop(i / (s.colors.length - 1), s.colors[i]);
                }

                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.restore();
            }
        },
        new Texture({})
    );

    u.copy(Texture, CircleLightTexture);
    u.copy(
        /** @lends CircleLightTexture */
        {

        },
        CircleLightTexture);

    pr.textures.CircleLightTexture = CircleLightTexture;

})(window.parari = window.parari || {}, document);