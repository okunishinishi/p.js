/**
 * Parari fragment.
 * @memberof parari
 * @constructor Fragment
 * @param {HTMLElement} elm - Html element.
 * @requires fabric
 */
(function (pr, f, document) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends Fragment */
    function Fragment(elm) {
        var s = this;
        s.elm = elm;
        s.reload();
    };

    Fragment.prototype = {
        /**
         * Drawable object.
         * @type fabric.Object
         */
        drawable: null,
        /**
         * Load a element
         * @param {HTMLElement} elm
         */
        load: function (elm) {
            var s = this;
            s.parts = Fragment.parseElement(elm);
            s.drawable = new pr.Drawable([], {});
            s.drawable.addAll([
                s.parts.background,
                s.parts.text
            ]);
            s.invalidate();
        },
        /**
         * Reload element.
         */
        reload: function () {
            var s = this;
            if (s.drawable) {
                s.drawable.removeAll();
            }
            s.load(s.elm);
        },
        /**
         * Mark as needing to be drawn.
         */
        invalidate: function () {
            var s = this,
                rect = pr.Rect.ofElement(s.elm, s.bounds);

            var w = rect.width,
                h = rect.height,
                center = rect.center;

            s.drawable.set({
                width: w,
                height: h,
                x: center.x,
                y: center.y
            });


            var background = s.parts.background;
            background.set({
                width: w,
                height: h,
                left: -w / 2,
                top: -h / 2,
            });

            var text = s.parts.text;
            text.set({
                width: w,
                height: h,
                left: center.x - w,
                top: center.y - h
            });
        },
        /**
         * Bounds of the element.
         */
        bounds: pr.Rect.RectZero()
    };

    /**
     * Parse elment into fabric object.
     * @param {HTMLElement} elm - Element to parse.
     * @returns {{}}
     */
    Fragment.parseElement = function (elm) {
        var style = window.getComputedStyle(elm, '');
        return {
            background: new f.Rect({
                fill: style.backgroundColor
            }),
            text: new f.Text(elm.textContent, {
                fontSize: Number(style.fontSize.replace(/[^\d]/g, '')),
                fill: style.color,
                textAlign: style.textAlign
            })
        }
    };

    pr.Fragment = Fragment;

})(
    window.parari = window.parari || {},
    window.fabric,
    document
);