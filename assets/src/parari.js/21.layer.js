/**
 * Parari layer.
 * @memberof parari.layers
 * @constructor Layer
 * @param {object} options - Layer options.
 */
(function (pr, f, document) {
    "use strict";

    var u = pr.utilities;

    var Drawable = pr.Drawable;

    /** @lends Layer */
    function Layer(options) {
        var s = this;
        s.init.apply(s, arguments);
    }


    Layer.prototype = {
        init: function (options) {
            var s = this;
            s.__proto__ = u.copy(Layer.prototype, new f.Group([], {
                selectable: false,
                hasRotatingPoint: false,
            }));
            s.__isPrLayer = true;
            u.copy(options || {}, s);
        },
        /**
         * Move to scroll point.
         * @param {number} scrollX - Scroll x position.
         * @param {number} scrollY - Scroll y position.
         */
        move: function (scrollX, scrollY) {
            var s = this,
                factor = s.factor(scrollX, scrollY);

        },
        factor: function (scrollX, scrollY) {
            var s = this,
                w = s.getWidth,
                h = s.getHeight();
            if (s.vLock) {
                if (!w) {
                    return 0;
                }
            }
            if (s.hLock) {
                if (!h) {
                    return 0;
                }
                var value = scrollY % h;
                console.log('value', value, scrollY, h);
            }
            return 0;
        },
        /**
         * Sync layer.
         * @param {parari.Rect} bounds - Bounds size.
         */
        sync: function (bounds) {
            var s = this;
            s.set({
                originX: 'center',
                originY: 'center',
                left: bounds.center.x,
                top: bounds.center.y,
                width: bounds.width,
                height: bounds.height
            });
            s.layout();
        },
        /**
         * Layout object.
         */
        layout: function () {

        }
    };


    pr.layers.Layer = Layer;


})(window.parari = window.parari || {}, window.fabric, document);