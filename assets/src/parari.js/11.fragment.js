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

        elm.classList.add(c.classNames.FRAGMENT);

        s.reload();
    };

    Fragment.prototype = {
        /**
         * Drawable object.
         * @type fabric.Oect
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
         * Update drwable frame.
         * @param {number} x - X position.
         * @param {number} y - Y position.
         * @param {number} w - Horizontal size.
         * @param {number} h - Vertical size.
         */
        _updateDrawable: function (x, y, w, h) {
            var s = this;

            s.drawable.set({
                width: w,
                height: h,
                left: x - w,
                top: y - h
            });

            var bounds = {
                width: w,
                height: h,
                left: 0,
                top: 0,
            };

            s.parts.background.set(bounds);
            s.parts.text.set(bounds);
        },
        /**
         * Move to point.
         * @param {number} x - X position.
         * @param {number} y - Y position.
         */
        move: function (x, y) {
            var s = this,
                frame = s.frame;

            var center = frame.center,
                w = frame.width,
                h = frame.height;

            var v = s.velocity;
            console.log('frame, bounds, scroll',
                    s.frame && s.frame.center.y,
                y);

            s._updateDrawable(center.x, center.y, w, h);
        },
        /**
         * Synchorize with source element.
         * @param {pr.Rect} bounds - Canvas bounds.
         */
        sync: function (bounds) {
            var s = this;
            s.frame = pr.Rect.ofElement(s.elm, bounds);
        },
        /**
         * Frame of the element.
         */
        frame: pr.Rect.RectZero(),
        velocity: 1
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