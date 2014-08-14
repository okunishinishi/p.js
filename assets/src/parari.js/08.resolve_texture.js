/**
 * Resolve a texture by name.
 * @membrerof parari
 * @function resolveTexture
 * @param {string} name - Name to resolve.
 * @returns {parari.textures.Texture} - Resolve texture.
 */
(function (pr) {
    "use strict";

    var u = pr.utilities;

    /** @lends resolveTexture */
    function resolveTexture(name) {
        name = u.camelize(name);
        return pr.textures._textureNameMap[name] || pr.textures[name];
    }

    pr.resolveTexture = resolveTexture;

})(window.parari = window.parari || {});
