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
        elm.classList.add(c.classNames.FRAGMENT);

        var s = this;
        s.load(elm);
    };

    Fragment.prototype = {

        /**
         * Drawable object.
         * @type fabric.Oect
         */
        drawable: null,
        /**
         * Load data from fragment elment.
         * @param {HTMLElement} elm
         */
        load: function (elm) {
            var s = this;

            s.elm = elm;
            s.elm.addEventListener('pr-img-load', function () {
                s.invalidate();
                setTimeout(function () {
                    s.refresh();
                }, 10);
            });

            s.drawable = new pr.Drawable(elm);

            var properties = Fragment.fromDataset(elm.dataset);
            u.copy(properties, s);


        },
        /**
         *  Unload fragment element data.
         */
        unload: function () {
            var s = this;
            if (s.drawable) {
                s.drawable.removeAll();
                s.drawable = null;
            }
            if (s.elm) {
                s.elm.removeEventListener('pr-img-load');
                s.elm = null;
            }
        },
        /**
         * Reload element.
         */
        reload: function () {
            var s = this;
            s.unload();
            s.load(s.elm);
        },
        /**
         * Invalidate this fragment.
         */
        invalidate: function () {
            var s = this;
            s._needsSync = true;
            s._needsLayout = true;
        },
        /**
         * Refresh fragments.
         */
        refresh: function () {
            var s = this;
            if (s._needsSync) {
                s.resync();
                s._needsSync = false;
            }
            if (s._needsLayout) {
                s.drawable.layout();
                s._needsLayout = false;
            }
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
            s.refresh();
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
            s._bounds = bounds;
            s.drawable.layout();
        },
        resync: function () {
            var s = this;
            s.sync(s._bounds);
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
        var values = {},
            keys = Object.keys(dataset).filter(Fragment.fromDataset._keyFilter);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            values[pr.unprefixed(key)] = dataset[key];
        }
        return values;
    };
    Fragment.fromDataset._keyFilter = function (key) {
        return !!key.match(c.PREFIX_PATTERN);
    }


    pr.Fragment = Fragment;

})(
    window.parari = window.parari || {},
    window.fabric,
    document
);