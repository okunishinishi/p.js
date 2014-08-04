/**
 * Parari layers.
 * @memberof layers
 * @constructor Layer
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities;

    /** @lends Layer*/
    function Layer() {

    };

    Layer.prototype = new pr.Object({});

    u.copy(
        /** @lends Layer.prototype */
        {
            load: function (callback) {
                var s = this;
                s.invalidate();
                callback && callback(s);
            },
            reload: function (callback) {
                var s = this;
                s.load(callback);
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
            },
        },
        Layer.prototype
    )

    pr.layers.Layer = Layer;


})(window.parari = window.parari || {}, document);