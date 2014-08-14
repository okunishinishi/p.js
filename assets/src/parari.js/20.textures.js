/**
 * Parari textures.
 * @memberof parari
 * @member textures
 */
(function (pr, document) {
    "use strict";

    /** @lends textures */
    pr.textures = {
        /** Short names for textures. */
        get _textureNameMap() {
            return {
			    resolve: pr.textures.ResolveTexture,
			    starFlow: pr.textures.StarFlowTexture,
			    rainbowColor: pr.textures.RainbowColorTexture,
			    circleLight: pr.textures.CircleLightTexture
			};
        }
    };


})(window.parari = window.parari || {}, document);