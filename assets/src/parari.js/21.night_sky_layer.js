/**
 * Parari object.
 * @memberof layers
 * @constructor NightSkyLayer
 * @param {object} options
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends NightSkyLayer */
    function NightSkyLayer(data) {
        var s = this;
        u.copy(data || {}, s);
        s.invalidate();
    };

    NightSkyLayer.prototype = new pr.Object;

    u.copy(
        /** @lends NightSkyLayer.prototype */
        {
            load: function (callback) {
                var s = this;
                s.invalidate();
                callback && callback(s);
            },
            /**
             * Invalidate object rendering.
             */
            invalidate: function () {
                var s = this;
                s.x = (s.minX + s.maxX) / 2;
                s.y = (s.minY + s.maxY) / 2;
                s.width = s.maxX - s.minX;
                s.height = s.maxY - s.minY;
                if (!s.stars.length) {
                    s.stars = NightSkyLayer.stars(s.getBounds());
                }
            },
            reload: function (callback) {
                var s = this;
                s.stars = NightSkyLayer.stars(s.getBounds());
                s.load(callback);
            },
            stars: [],

            draw: function (ctx, scrollX, scrollY) {
                var s = this,
                    bounds = s.getBounds();
                ctx.save();

                for (var i = 0; i < s.stars.length; i++) {
                    var star = s.stars[i];
                    star.move(scrollX, scrollY, bounds);
                    star.draw(ctx);
                }

                ctx.restore();
            }
        },
        NightSkyLayer.prototype);

    NightSkyLayer.numberStartsForBounds = function (bounds) {
        return 400; //TODO
    };

    /**
     * Create stars.
     * @returns {Star[]} - Stars.
     */
    NightSkyLayer.stars = function (bounds) {
        var count = NightSkyLayer.numberStartsForBounds(bounds);
        var stars = [];
        for (var i = 0; i < count; i++) {
            var star = new Star({
                    baseX: u.randomInt(bounds.minX, bounds.maxX),
                    baseY: u.randomInt(bounds.minY, bounds.maxY),
                    color: u.hsv2rgbaString(u.randomInt(0, 360), 30, 50),
                    speed: u.randomInt(0, 3) / 2
                }
            );
            stars.push(star);
        }
        return stars;
    };

    /**
     * @memberof NightSkyLayer
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


    pr.layers.NightSkyLayer = NightSkyLayer;

    pr.layers.NightSkyLayer.Star = Star;

})
(window.parari = window.parari || {}, document);