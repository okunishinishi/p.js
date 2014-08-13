/**
 * Parari layers.
 * @memberof parari
 * @member layers
 */
(function (pr, document) {
    "use strict";

    /** @lends layers */
    pr.layers = {
        /** Short names for layers. */
        get _layerNameMap() {
            return {
			    resolve: pr.layers.ResolveLayer,
			    starFlow: pr.layers.StarFlowLayer
			};
        }
    };


})(window.parari = window.parari || {}, document);