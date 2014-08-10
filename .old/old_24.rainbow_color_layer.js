/**
 * Rainbow layer.
 * @memberof layers
 * @constructor RainbowColorLayer
 * @param {object} options
 *
 */
(function (pr) {
    "use strict";

    var u = pr.utilities,
        Layer = pr.layers.Layer;

    /** @lends RainbowColorLayer */
    function RainbowColorLayer(options) {
        var s = this;
        u.copy(options || {}, s);
        s.invalidate();
    };

    RainbowColorLayer.prototype = new Layer({});
    u.copy(
        /** @lends RainbowColorLayer.prototype */
        {
            z: -9,
            velocity: 0.15,
            value: 100,
            saturation: 70,
            alpha: 0.8,
            hue: 30,
            draw: function (ctx, scrollX, scrollY) {
                var s = this,
                    bounds = s.getBounds();

                ctx.save();


                var x = (scrollX * s.velocity) % bounds.right,
                    y = (scrollY * s.velocity) % bounds.bottom,
                    factor = s.factor(x, y);

                ctx.beginPath();
                ctx.rect(bounds.left, bounds.top, bounds.width, bounds.height);
                ctx.fillStyle = s.fillColor(factor);
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            },
            fillColor: function (factor) {
                var s = this,
                    hue = (s.hue + (factor + 1) * 360) % 360;
                var rgb = u.hsv2rgb(hue, s.saturation, s.value);
                return u.rgba2string(rgb.r, rgb.g, rgb.b, s.alpha);
            }
        },
        RainbowColorLayer.prototype);

    pr.layers.RainbowColorLayer = RainbowColorLayer;


})(window.parari = window.parari || {});