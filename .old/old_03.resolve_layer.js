/**
 * Resolve a layer by name.
 * @membrerof para
 * @function resolveLayer
 * @param {string} name - Name to resolve.
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
