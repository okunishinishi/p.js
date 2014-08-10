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
    function Drawable(objects) {
        var s = this;
        (objects || []).forEach(function (object) {
            s.add(object);
        });
    };

    var Prototype = f.Group;
    Drawable.prototype = u.copy(
        /** @lends Drawable.prototype */
        {
            /**
             * Invalidate object.
             */
            invalidate: function () {
                var s = this;
                var result;
                if (Prototype.invalidate) {
                    result = Prototype.invalidate.apply(s, arguments);
                }
                return result;
            },
            /**
             * Bounds of the element.
             */
            bounds: pr.Rect.RectZero()
        },
        new Prototype([], {})
    );

    /**
     * Create a drawable from element.
     * @returns {Drawable}
     */
    Drawable.fromElement = function (elm) {
        var drawable = new Drawable([]);
        drawable.invalidate = function () {
            var s = this,
                result = Drawable.prototype.invalidate.apply(s, arguments);

            var sytle = window.getComputedStyle(elm, ''),
                rect = pr.Rect.ofElement(elm, s.bounds);

            s.setWidth(rect.width);
            s.setHeight(rect.height);
            s.setPositionByOrigin(rect.center, 'center', 'center');


            s.add(new f.Rect({
                fill: sytle.backgroundColor,
                width: rect.width,
                height: rect.height,
                x: rect.center.x,
                y: rect.center.y,
                originX: 'center',
                originY: 'center'
            }));

            s.add(new fabric.Circle({
                radius: 100,
                fill: '#eef',
                originX: 'center',
                originY: 'center'
            }));

            s.add(new fabric.Text('hello world', {
                fontSize: 30,
                originX: 'center',
                originY: 'center',
                x: 10,
                y: 10,
            }));
            return result;
        };
        drawable.invalidate();
        return drawable;
    }


    pr.Drawable = Drawable;

})(
    window.parari = window.parari || {},
    window.fabric,
    document
);