/**
 * Parari drawable.
 * @memberof parari
 * @constructor Drawable
 * @param {fabric.Object[]} objects.
 * @requires fabric
 */
(function (pr, f, document) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends Drawable */
    function Drawable() {
    };

    var Prototype = f.Group;
    Drawable.prototype = u.copy(
        /** @lends Drawable.prototype */
        {
            addAll: function (objects) {
                var s = this;
                objects = [].concat(objects).forEach(function (object) {
                    s.add(object);
                });
            },
            /**
             * Remove all objects.
             */
            removeAll: function () {
                var s = this,
                    removed = [];
                var obj;
                while (obj = s.remove()) {
                    removed.push(obj);
                }
                return removed;
            },
        },
        new Prototype([], {})
    );

    pr.Drawable = Drawable;

})(
    window.parari = window.parari || {},
    window.fabric,
    document
);