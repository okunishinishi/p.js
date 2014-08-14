/**
 * Parari texture
 * @memberof parari
 * @augments Texture
 * @constructore StarFlowTexture
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        Texture = pr.textures.Texture;

    /** @lends StarFlowTexture */
    function StarFlowTexture() {

    }


    StarFlowTexture.prototype = u.copy(
        /** @lends StarFlowTexture.prototype */
        {
            /**
             * Render texture.
             * @param {number} scrollX
             * @param {number} scrollY
             */
            render: function (scrollX, scrollY) {

            }
        },
        new Texture({})
    );

    u.copy(Texture, StarFlowTexture);
    u.copy(
        /** @lends StarFlowTexture */
        {

        },
        StarFlowTexture);

    pr.textures.StarFlowTexture = StarFlowTexture;

})(window.parari = window.parari || {}, document);