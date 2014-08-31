/**
 * Parari texture.
 * @memberof parari
 * @augments Texture
 * @constructore RainfallTexture
 * @param {object} options - Optional settings.
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        Texture = pr.textures.Texture;

    /** @lends RainfallTexture */
    function RainfallTexture(options) {
        var s = this;
        u.copy(options || {}, s);
    }


    RainfallTexture.prototype = u.copy(
        /** @lends RainfallTexture.prototype */
        {
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

                var w = bounds.width,
                    h = bounds.height;


                ctx.strokeStyle = s.color;
                ctx.lineWidth = s.width;

                var v = Number(s.velocity),
                    xFactor = (scrollX * v) / w / 2 % 1,
                    yFactor = (scrollY * v) / h / 2 % 1;

                var margin = 20;

                var baseY = h * yFactor / 3;
                for (var i = 0; i < w / margin; i++) {
                    var x = i * margin,
                        y = (-2 * h + baseY + i * 100) % ( h * 2);
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + s.height);
                }

                ctx.stroke();

                ctx.restore();
            },
            velocity: 4,
            color: '#FFF',
            width: 1,
            height: 120,
        },
        new Texture({})
    );

    u.copy(Texture, RainfallTexture);
    u.copy(
        /** @lends RainfallTexture */
        {

        },
        RainfallTexture);

    pr.textures.RainfallTexture = RainfallTexture;

})(window.parari = window.parari || {}, document);