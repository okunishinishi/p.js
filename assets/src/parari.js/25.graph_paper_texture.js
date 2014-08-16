/**
 * Parari texture.
 * @memberof parari
 * @augments Texture
 * @constructore GraphPaperTexture
 * @param {object} options - Optional settings.
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        Texture = pr.textures.Texture;

    /** @lends GraphPaperTexture */
    function GraphPaperTexture(options) {
        var s = this;
        u.copy(options || {}, s);
    }


    GraphPaperTexture.prototype = u.copy(
        /** @lends GraphPaperTexture.prototype */
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

                ctx.strokeStyle = s.color;

                var grid = s.grid;

                var h = bounds.height,
                    w = bounds.width;

                var v = Number(s.velocity),
                    xFactor = (scrollX * v) / w % 1,
                    yFactor = (scrollY * v) / h % 1;


                var baseX = grid * xFactor,
                    baseY = grid * yFactor;
                for (var i = 0; i < h / grid; i++) {
                    var y = i * grid - baseY;
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                }

                for (var i = 0; i < w / grid; i++) {
                    var x = i * grid - baseX;
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                }

                ctx.stroke();

                ctx.restore();
            },
            velocity: 4,
            grid: 20,
            color: 'rgba(255,255,255,0.1)'
        },
        new Texture({})
    );

    u.copy(Texture, GraphPaperTexture);
    u.copy(
        /** @lends GraphPaperTexture */
        {

        },
        GraphPaperTexture);

    pr.textures.GraphPaperTexture = GraphPaperTexture;

})(window.parari = window.parari || {}, document);