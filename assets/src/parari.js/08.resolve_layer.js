/**
 * Resolve a layer by name.
 * @membrerof parari
 * @function resolveLayer
 * @param {string} name - Name to resolve.
 * @returns {parari.layers.Layer} - Resolve layer.
 */
(function (pr) {
    "use strict";

    var u = pr.utilities;

    /** @lends resolveLayer */
    function resolveLayer(name) {
        return pr.layers._layerNameMap[name] || pr.layers[name];
    }

    pr.resolveLayer = resolveLayer;

})(window.parari = window.parari || {});
