/**
 * Sun light layer.
 * @memberof layers
 * @constructor SunLightLayer
 * @param {object} options
 */
(function (pr) {
    "use strict";

    var u = pr.utilities,
        Layer = pr.layers.Layer;

    /** @lends SunLightLayer */
    function SunLightLayer(options) {
        var s = this;
        u.copy(options || {}, s);
        s.invalidate();
    };

    SunLightLayer.prototype = new Layer({});

    u.copy(
        /** @lends SunLightLayer.prototype */
        {
            z: -11,
            velocity: 0.5,
            expansion: 3,
            colors: [
                '#8ED6FF', '#004CB3'
            ],
            draw: function (ctx, scrollX, scrollY) {
                var s = this,
                    bounds = s.getBounds();

                ctx.save();
                ctx.rect(bounds.left, bounds.top, bounds.width, bounds.height);

                var x = (scrollX * s.velocity) % bounds.right,
                    y = (scrollY * s.velocity) % bounds.bottom,
                    factor = s.factor(x, y),
                    radius = bounds.height / 3,
                    rx = radius * 0.8,
                    ry = rx;


                var gradient = ctx.createRadialGradient(rx, ry, radius, rx, ry, radius * (s.expansion - 1 + Math.abs(factor)));


                for (var i = 0; i < s.colors.length; i++) {
                    gradient.addColorStop(i / (s.colors.length - 1), s.colors[i]);
                }

                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.restore();
            }
        },
        SunLightLayer.prototype);

    pr.layers.SunLightLayer = SunLightLayer;

})(window.parari = window.parari || {});