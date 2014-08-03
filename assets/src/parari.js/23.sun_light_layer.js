/**
 * Parari object.
 * @memberof layers
 * @constructor SunLightLayer
 * @param {object} options
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        Layer = pr.layers.Layer;

    /** @lends SunLightLayer */
    function SunLightLayer(data) {
        var s = this;
        u.copy(data || {}, s);
        s.invalidate();
    };

    SunLightLayer.prototype = new Layer({});

    u.copy(
        /** @lends SunLightLayer.prototype */
        {
            z: -11,
            setBounds: function () {
                var s = this;
                Layer.prototype.setBounds.apply(s, arguments);
            },
            reload: function (callback) {
                var s = this;
                s.load(callback);
            },
            draw: function (ctx, scrollX, scrollY) {
                var s = this,
                    bounds = s.getBounds();

                var minX = bounds.minX,
                    minY = bounds.minY,
                    maxX = bounds.maxX,
                    maxY = bounds.maxY;

                ctx.save();

                ctx.rect(minX, minY, maxX, maxY);

                var x = scrollX % maxX, y = scrollY % maxY,
                    factor = s.factor(x, y),
                    radius = (maxY - minY) / 3,
                    rx = radius * 0.8,
                    ry = rx;

                var gradient = ctx.createRadialGradient(rx, ry, radius, rx, ry, radius * (2 + Math.abs(factor)));

                gradient.addColorStop(0, '#8ED6FF');
                gradient.addColorStop(1, '#004CB3');

                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.restore();
            }
        },
        SunLightLayer.prototype);

    pr.layers.SunLightLayer = SunLightLayer;
})
(window.parari = window.parari || {}, document);