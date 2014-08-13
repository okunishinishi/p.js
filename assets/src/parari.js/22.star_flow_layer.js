/**
 * Layer with star flow effect.
 * @memberof parari.layers
 * @constructor StarFlowLayer
 */
(function (pr, document) {
    "use strict";

    var Layer = pr.layers.Layer;

    /** @lends Layer */
    function StarFlowLayer() {
        var s = this;
        s.init.apply(s, arguments);
    }

    StarFlowLayer.prototype = new Layer({});


    pr.layers.StarFlowLayer = StarFlowLayer;


})(window.parari = window.parari || {}, document);