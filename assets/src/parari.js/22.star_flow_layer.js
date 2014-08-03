/**
 * Parari object.
 * @memberof layers
 * @constructor StarFlowLayer
 * @param {object} options
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        Layer = pr.layers.Layer;

    /** @lends StarFlowLayer */
    function StarFlowLayer(options) {
        var s = this;
        u.copy(options || {}, s);
        s.invalidate();

    };

    StarFlowLayer.prototype = new Layer({});

    u.copy(
        /** @lends StarFlowLayer.prototype */
        {
            z: -10,
            saturation: 10,
            dense: 0.0025,
            setBounds: function () {
                var s = this;
                Layer.prototype.setBounds.apply(s, arguments);
                s.stars = s.createStars(s.getBounds(), s.saturation);
            },
            reload: function (callback) {
                var s = this;
                s.stars = s.createStars(s.getBounds(), s.saturation);
                s.load(callback);
            },
            stars: [],
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
            },
            /**
             * Create stars.
             * @param bounds
             * @param saturation
             * @returns {Array}
             */
            createStars: function (bounds, saturation) {
                var s = this,
                    count = s.numberStartsForBounds(bounds),
                    stars = [];
                for (var i = 0; i < count; i++) {
                    var radius = Math.random(),
                        star = new Star({
                                baseX: u.randomInt(bounds.minX, bounds.maxX),
                                baseY: u.randomInt(bounds.minY, bounds.maxY),
                                radius: radius,
                                color: s.randomColor(saturation),
                                speed: radius
                            }
                        );
                    stars.push(star);
                }
                return stars;
            },
            numberStartsForBounds: function (bounds) {
                var s = this,
                    w = bounds.maxX - bounds.minX,
                    h = bounds.maxY - bounds.minY;
                return w * h * s.dense;
            },
            randomColor: function (saturation) {
                var rgb = u.hsv2rgb(u.randomInt(0, 360), saturation, 100);
                return u.rgba2string(rgb.r, rgb.g, rgb.b, 0.8);
            },
        },
        StarFlowLayer.prototype);


    /**
     * @memberof StarFlowLayer
     * @constructor Star
     * @param {object} options
     * @private
     */
    function Star(data) {
        var s = this;
        u.copy(data, s);
    }

    Star.prototype = {
        radius: 1,
        speed: 1,
        baseX: 0,
        baseY: 0,
        x: 0,
        y: 0,
        color: '#FFF',
        /**
         * Change the coordinate.
         * @param {number} dx
         * @param {number} dy
         * @param {object} bounds
         */
        move: function (dx, dy, bounds) {
            var s = this;
            s.x = (dx * s.speed + s.baseX) % bounds.maxX;
            s.y = (dy * s.speed + s.baseY) % bounds.maxY;
            if (s.x < bounds.minX) {
                s.x += (bounds.maxX - bounds.minX);
            }
            if (s.y < bounds.minY) {
                s.y += (bounds.maxY - bounds.minY);
            }

        },
        /**
         * Draw a star.
         * @param ctx
         */
        draw: function (ctx) {
            var s = this;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    };


    pr.layers.StarFlowLayer = StarFlowLayer;

    pr.layers.StarFlowLayer.Star = Star;

})(window.parari = window.parari || {}, document);