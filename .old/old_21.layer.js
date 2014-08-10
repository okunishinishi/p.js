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
                var s = this,
                    center = s.bounds.center;
                s.x = center.x;
                s.y = center.y;
                s.width = s.bounds.width;
                s.height = s.bounds.height;
            },
        },
        Layer.prototype
    )

    pr.layers.Layer = Layer;


})(window.parari = window.parari || {}, document);