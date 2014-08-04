/**
 * Rainbow layer.
 * @memberof layers
 * @constructor RippleCircleLayer
 * @param {object} options
 *
 */
(function (pr) {
    "use strict";

    var u = pr.utilities,
        Layer = pr.layers.Layer;

    /** @lends RippleCircleLayer */
    function RippleCircleLayer(options) {
        var s = this;
        u.copy(options || {}, s);
        s.invalidate();
    };

    RippleCircleLayer.prototype = new Layer({});
    u.copy(
        /** @lends RippleCircleLayer.prototype */
        {
            z: -9,
            velocity: 0.5,
            strokeStyle: '#FFF',
            fillStyle: 'rgba(255,255,255,0.2)',
            centerX: -80,
            centerY: -80,
            lingWidth: 2,
            maxRadiusRate: 2,
            draw: function (ctx, scrollX, scrollY) {
                var s = this,
                    bounds = s.getBounds();

                var minX = bounds.left,
                    minY = bounds.top,
                    maxX = bounds.right,
                    maxY = bounds.bottom;

                ctx.save();

                var x = (scrollX * s.velocity + s.vx) % maxX,
                    y = (scrollY * s.velocity + s.vy) % maxY,
                    centerX = bounds.center.x - s.centerX,
                    centerY = bounds.center.y - s.centerY,
                    factor = s.factor(x, y);

                var width = bounds.width,
                    radius = (width * (factor + 2)) % (width * s.maxRadiusRate);

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
                ctx.strokeStyle = s.strokeStyle;
                ctx.fillStyle = s.fillStyle;
                ctx.lineWidth = s.lineWidth;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            },
            vx: 0,
            vy: 0
        },
        RippleCircleLayer.prototype);

    pr.layers.RippleCircleLayer = RippleCircleLayer;


})(window.parari = window.parari || {});