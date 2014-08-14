/**
 * Parari texture
 * @memberof parari
 * @augments Texture
 * @constructore StarFlowTexture
 * @param {object} options - Optional settings.
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        Texture = pr.textures.Texture;

    /** @lends StarFlowTexture */
    function StarFlowTexture(options) {
        var s = this;
        u.copy(options || {}, s);

        s.starLayers = [].concat(options.layers || {}).map(function (options, i, array) {
            options.velocity = options.velocity || ((array.length - i) / (array.length + 1));
            return new StarFlowTexture.StarLayer(options);
        });
    }

    StarFlowTexture.prototype = u.copy(
        /** @lends StarFlowTexture.prototype */
        {
            starLayers: null,
            backgroundColor: '#36A',
            /**
             * Star pattern image.
             */
            _patternImage: null,
            /**
             * Render texture.
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
                s.renderBackground(ctx, bounds);
                var xFactor = scrollX / bounds.width,
                    yFactor = scrollY / bounds.height;
                for (var i = 0; i < s.starLayers.length; i++) {
                    var layer = s.starLayers[i];
                    layer.move(xFactor, yFactor);
                    s.renderLayer(ctx, bounds, layer);
                }
                ctx.restore();
            },
            renderBackground: function (ctx, bounds) {
                var s = this;
                ctx.fillStyle = s.backgroundColor;
                ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
            },
            /**
             * Fill image.
             * @param ctx
             */
            renderLayer: function (ctx, bounds, layer) {
                var s = this,
                    img = layer.img;
                if (!bounds) {
                    return;
                }
                var w = img.width,
                    h = img.height;
                var baseX = u.round(bounds.left - layer.x),
                    baseY = u.round(bounds.top - layer.y);

                var rows = u.round(parseInt(bounds.height / h, 10)) + 2,
                    cols = u.round(parseInt(bounds.width / w, 10)) + 2;

                for (var row = 0; row < rows; row++) {
                    for (var col = 0; col < cols; col++) {
                        var x = baseX + w * col,
                            y = baseY + h * row;
                        ctx.drawImage(img, x, y, w, h);
                    }
                }

            }

        },
        new Texture({})
    );

    u.copy(Texture, StarFlowTexture);
    u.copy(
        /** @lends StarFlowTexture */
        {
            /**
             * @constructor StarLayer
             */
            StarLayer: (function () {
                /** @lends StarLayer */
                function StarLayer(options) {
                    var s = this;
                    u.copy(options || {}, s);
                    var size = s.patternSize;
                    s.img = s.createImage(size, size);
                }

                StarLayer.prototype = {
                    x: 0,
                    y: 0,
                    patternSize: 150,
                    countPerPattern: 20,
                    radius: 0.5,
                    color: '#FFF',
                    velocity: 1,
                    move: function (x, y) {
                        var s = this,
                            v = s.velocity,
                            img = s.img;
                        var w = img.width,
                            h = img.height;
                        s.x = w * (x * v % 1);
                        s.y = h * (y * v % 1);
                    },
                    createImage: function (w, h) {
                        var s = this;

                        var canvas = Texture.newCanvas(w, h),
                            ctx = canvas.getContext('2d');

                        var count = s.countPerPattern,
                            radius = s.radius,
                            color = s.color;

                        ctx.fillStyle = color;

                        for (var i = 0; i < count; i++) {
                            var x = u.randomInt(radius, w - radius),
                                y = u.randomInt(radius, w - radius);
                            ctx.beginPath();
                            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
                            ctx.closePath();
                            ctx.fill();
                        }
                        canvas.velocity = s.velocity;
                        return canvas;
                    }
                };
                return StarLayer;
            })()
        },
        StarFlowTexture);

    pr.textures.StarFlowTexture = StarFlowTexture;

})(window.parari = window.parari || {}, document);