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

        },
        new Texture({})
    );

    u.copy(Texture, StarFlowTexture);
    u.copy(
        /** @lends StarFlowTexture */
        {

        },
        StarFlowTexture);

    pr.StarFlowTexture = StarFlowTexture;

})(window.parari = window.parari || {}, document);