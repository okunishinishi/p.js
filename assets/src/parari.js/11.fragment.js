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

            s.drawable = new pr.Drawable(elm);

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
         * Move to point.
         * @param {number} scrollX - X position.
         * @param {number} scrollY - Y position.
         */
        move: function (scrollX, scrollY) {
            var s = this;

            var w = s.frame.width,
                h = s.frame.height;

            var amount = s._moveAmount(scrollX, scrollY),
                x = amount.x,
                y = amount.y;

            s.drawable.set({
                width: w,
                height: h,
                left: x - w,
                top: y - h
            });
        },
        /**
         * Get move amount.
         * @param {number} scrollX - Horizontal Scroll amount.
         * @param {number} scrollY - Vertical scroll amount.
         * @returns {{x: number, y: number}}
         * @private
         */
        _moveAmount: function (scrollX, scrollY) {
            var s = this,
                center = s.frame.center,
                v = s.velocity;

            var dx = s.hLock ? 0 : s.dx * (1 - v),
                dy = s.vLock ? 0 : s.dy * (1 - v);
            return {
                x: center.x - scrollX * v - dx,
                y: center.y - scrollY * v - dy
            }
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
            s.drawable.layoutDrawableContents();
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