/**
 * Parari texture
 * @memberof parari
 * @constructore Texture
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities;

    /** @lends Texture */
    function Texture() {

    }

    Texture.prototype = {
        /**
         * Render texture.
         * @param {number} scrollX
         * @param {number} scrollY
         */
        render: function (scrollX, scrollY) {

        },
        sync: function (canvasBounds) {
            var s = this,
                w = canvasBounds.width,
                h = canvasBounds.height;
            s.bounds = new pr.Rect(0, 0, w, h);
            console.log('bounds', s.bounds);
        }
    };

    u.copy(
        /** @lends Texture */
        {
        },
        Texture
    );

    pr.textures.Texture = Texture;

})(window.parari = window.parari || {}, document);