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
            s.drawable = new pr.Drawable(elm);

            var properties = Fragment.fromDataset(elm.dataset);
            u.copy(properties, s);

            s.refresh();
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
         * Refresh fragments.
         */
        refresh: function () {
            var s = this;
            s.toggleVisibility(s.isVisible());
        },
        /**
         * Move to point.
         * @param {number} scrollX - X position.
         * @param {number} scrollY - Y position.
         */
        move: function (scrollX, scrollY) {
            var s = this,
                amount = s._moveAmount(scrollX, scrollY);
            var frame = s.frame,
                w = frame.width, h = frame.height;

            s.drawable.set({
                width: u.round(w),
                height: u.round(h),
                left: u.round(frame.left + amount.x),
                top: u.round(frame.top + amount.y),
                originX: 'center',
                originY: 'center'
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
                v = Number(s.velocity);
            var dx = u.round(s.hLock ? 0 : s.dx * (1 - v)),
                dy = u.round(s.vLock ? 0 : s.dy * (1 - v));
            return {
                x: -(scrollX * v + dx),
                y: -(scrollY * v + dy)
            }
        },
        /**
         * Synchorize with source element.
         * @param {pr.Rect} bounds - Canvas bounds.
         */
        sync: function (bounds) {
            var s = this;
            var frame = pr.Rect.ofElement(s.elm, bounds);
            s.dx = u.round(frame.center.x - bounds.width / 2);
            s.dy = u.round(frame.center.y - bounds.height / 2);
            s.frame = frame;
            s.bounds = bounds;
            s.drawable.layout();
        },
        isVisible: function (bounds) {
            var s = this;
            return s.isVisibleInBounds(s.bounds);
        },
        /**
         * Detect that the drawable visible or not.
         * @param {parari.Rect} bounds - Bounds to work with.
         */
        isVisibleInBounds: function (bounds) {
            if (!bounds) {
                return false;
            }
            var s = this,
                f = s.drawable.getFrame();
            console.log(bounds.left, f.left)
            return   (bounds.top < f.bottom)
                && (f.top < bounds.bottom)
                && (bounds.left < f.right)
                && (f.left < bounds.right);
        },
        /**
         * Hits a point or not.
         * @param {number} x
         * @param {number} y
         * @param {boolean} - Hit or not.
         */
        hits: function (x, y) {
            var s = this,
                f = s.drawable.getFrame();
            return f.contains(x, y);
        },
        /**
         * Handle an event.
         * @param {event} e - Event to handle.
         * @returns {boolean} - Consumed or not.
         */
        handleEvent: function (e) {
            var s = this;
            return s.drawable.handleEvent(e);
        },
        /**
         * Toggle drawable visibility.
         * @param {boolean} visible - Is visible or not.
         */
        toggleVisibility: function (visible) {
            var s = this,
                d = s.drawable;
            var needsChange = d.getVisible() !== visible;
            if (needsChange) {
                d.setVisible(visible);
            }
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