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

            var properties = Fragment.fromDataset(elm.dataset);
            u.copy(properties, s);
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
         * Layout parts.
         * @param {pr.Rect} rect - Frame rectangle.
         */
        layout: function (frame) {
            var s = this,
                w = frame.width,
                h = frame.height;

            var bounds = {
                width: w,
                height: h,
                left: w / 2,
                top: h / 2,
                originX: 'center',
                originY: 'center'
            };


            s.parts.background.set(bounds);
            s.parts.text.set(bounds);
        },
        /**
         * Re layout.
         */
        relayout: function () {
            var s = this;
            s.layout(s.frame);
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


        },
        /**
         * Move to point.
         * @param {number} scrollX - X position.
         * @param {number} scrollY - Y position.
         */
        move: function (scrollX, scrollY) {
            var s = this,
                frame = s.frame;

            var center = frame.center,
                w = frame.width,
                h = frame.height;

            var v = s.velocity;

            var dx = s.hLock ? 0 : s.dx * (1 - v),
                dy = s.vLock ? 0 : s.dy * (1 - v);

            var x = center.x - scrollX * v - dx,
                y = center.y - scrollY * v - dy;

            s._updateDrawable(x, y, w, h);
        },
        /**
         * Synchorize with source element.
         * @param {pr.Rect} bounds - Canvas bounds.
         */
        sync: function (bounds) {
            var s = this;
            var frame = pr.Rect.ofElement(s.elm, bounds);
            s.dx = frame.center.x - bounds.width / 2;
            s.dy = frame.center.y - bounds.height / 2;
            s.frame = frame;
            s.relayout();
        },
        /**
         * Frame of the element.
         */
        frame: pr.Rect.RectZero(),
        velocity: 1,
        /** Horizontal distance from bounds center. */
        dx: 0,
        /** Vertical distance from bounds center. */
        dy: 0,
        /** Should lock horizontaly. */
        hLock: true,
        /** Should lock verticaly. */
        vLock: false
    };

    /**
     * Parse elment into fabric object.
     * @param {HTMLElement} elm - Element to parse.
     * @returns {{}}
     */
    Fragment.parseElement = function (elm) {
        var style = window.getComputedStyle(elm, '');
        var lineHeight = u.extractNumber(style.lineHeight);
        return {
            background: new f.Rect({
                fill: style.backgroundColor
            }),
            text: new f.Text(elm.textContent, {
                fontSize: u.extractNumber(style.fontSize),
                fill: style.color,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                textBackgroundColor: 'rgb(0,200,0)',
                textAlign: Fragment.parseElement._textAlign[style.textAlign],
            })
        }
    };

    Fragment.parseElement._textAlign = {
        start: 'left',
        left: 'left',
        center: 'center',
        right: 'right',
        justify: 'center',
        initial: 'left',
        inherit: 'left'
    }

    /**
     * Get proeprty data from dataset.
     * @param {DOMStringMap} dataset - Element data set.
     * @returns {object} - Parari property values.
     */
    Fragment.fromDataset = function (dataset) {
        var pattern = Fragment.fromDataset._prefixPattern;
        var values = {};
        for (var key in dataset) {
            if (dataset.hasOwnProperty(key)) {
                var matches = key.match(pattern);
                if (matches) {
                    var unPrefixedKey = Fragment.fromDataset._unPrefix(key)
                    values[unPrefixedKey] = dataset[key];
                }
            }
        }
        return values;
    };
    Fragment.fromDataset._prefixPattern = new RegExp("^" + pr.constants.PREFIX);
    Fragment.fromDataset._unPrefix = function (key) {
        var pattern = Fragment.fromDataset._prefixPattern;
        key = key.replace(pattern, '');
        return  key.substr(0, 1).toLowerCase() + key.substr(1);
    }


    pr.Fragment = Fragment;

})(
    window.parari = window.parari || {},
    window.fabric,
    document
);