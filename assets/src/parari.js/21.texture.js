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

    };

    u.copy(
        /** @lends Texture */
        {
        },
        Texture
    );

    pr.textures.Texture = Texture;

})(window.parari = window.parari || {}, document);