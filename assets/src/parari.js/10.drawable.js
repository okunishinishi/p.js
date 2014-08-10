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
             * Load drawas.
             * @param object
             */
            load: function (object) {
                var s = this;
                s.add(object);
            },
            /**
             * Reload drawables.
             */
            reload: function () {
                var s = this;
                s.load(s.removeAll());
                s.invalidate();
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

        /**
         * Load a drawable.
         * @param {HTML element} elm - Element to draw.
         */
        drawable.load = function (elm) {
            var s = this;
            var style = window.getComputedStyle(elm, '');

            s.set({
                originX: 'left'
            })

            s.refs = {};
            s.refs.background = new f.Rect({
                fill: style.backgroundColor,
            });

            s.refs.text = new f.Text(elm.textContent, {
                fontSize: Number(style.fontSize.replace(/[^\d]/g, '')),
                fill: style.color,
                textAlign: style.textAlign
            });

            Object.keys(s.refs).forEach(function (name) {
                [].concat(s.refs[name]).forEach(function (ref) {
                    s.add(ref);
                });
            });

            s.invalidate();
        };

        drawable.invalidate = function () {
            var s = this,
                result = Drawable.prototype.invalidate.apply(s, arguments);

            var rect = pr.Rect.ofElement(elm, s.bounds);

            var w = rect.width,
                h = rect.height,
                center = rect.center;

            s.set({
                width: w,
                height: h,
                x: center.x,
                y: center.y
            });

            var background = s.refs.background;
            background.set({
                width: w,
                height: h,
                left: -w / 2,
                top: -h / 2,
            });

            console.log(w, h, center);

            var text = s.refs.text;
            text.set({
                width: w,
                height: h,
                left: center.x - w,
                top: center.y - h
            });

            return result;
        };

        drawable.load(elm);

        return drawable;
    }


    Drawable.textNodeFilter = function (node) {
        return node.nodeType === 3;
    }

    Drawable.textNodesForElm = function (elm) {
        return u.toArray(elm.childNodes).filter(Drawable.textNodeFilter);
    }


    pr.Drawable = Drawable;

})(
    window.parari = window.parari || {},
    window.fabric,
    document
);