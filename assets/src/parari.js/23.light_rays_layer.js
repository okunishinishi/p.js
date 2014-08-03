/**
 * Parari object.
 * @memberof layers
 * @constructor LightRaysLayer
 * @param {object} options
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        Layer = pr.layers.Layer;

    /** @lends LightRaysLayer */
    function LightRaysLayer(data) {
        var s = this;
        u.copy(data || {}, s);
        s.invalidate();
    };

    LightRaysLayer.prototype = new Layer({});

    u.copy(
        /** @lends LightRaysLayer.prototype */
        {
            z: -10,
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
                ctx.save();
                for (var i = 0; i < s.stars.length; i++) {
                    var star = s.stars[i];
                    star.move(-scrollX, -scrollY, bounds);
                    star.draw(ctx);
                }
                ctx.restore();
            }
        },
        LightRaysLayer.prototype);

    pr.layers.LightRaysLayer = LightRaysLayer;
})
(window.parari = window.parari || {}, document);