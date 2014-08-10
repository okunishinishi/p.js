/**
 * Screen.
 * @memberof parari
 * @constructor Screen
 * @param {HTMLElement} container - Element to contains screen.
 * @param {object} options - Optional settings.
 * @requires fabric
 */
(function (pr, document, f) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends Screen */
    function Screen(container, options) {
        var s = this;
        container = u.toElement(container);
        if (!container) {
            throw new Error('Screen container not found:', container);
        }
        container.classList.add(c.classNames.SCREEN_CONTAINER);

        u.copy(options || {}, s);

        var canvasId = Screen._newCanvasId(),
            elm = Screen._newScreenElement(canvasId);
        container.appendChild(elm);

        s.canvas = new f.Canvas(canvasId);
        s.fragments = [];

    }

    Screen.prototype = {
        /**
         * Fabirc canvas.
         * @type fabric.Canvas
         */
        canvas: null,
        /**
         * Fragment objects.
         * @type {parari.Fragment[]}
         */
        fragments: null,
        /**
         * Element to fit size with.
         */
        sizer: null,
        /**
         * Element to scroll with.
         */
        scroller: null,
        /**
         * Register a fragment object.
         * @param {parari.Fragment} fragment - Fragment.
         */
        register: function (fragment) {
            var s = this;
            s.fragments.push(fragment);
            s.canvas.add(fragment.drawable);
        },
        /**
         * Register fragment objects.
         * @param {parari.Fragment[]} fragments - Fragments.
         */
        registerAll: function (fragments) {
            var s = this;
            [].concat(fragments).forEach(function (fragment) {
                s.register(fragment);
            });
        },
        /**
         * Draw screen.
         */
        draw: function (scrollX, scrollY) {
            var s = this,
                canvas = s.canvas;

            for (var i = 0, len = s.fragments.length; i < len; i++) {
                var fragment = s.fragments[i];
                fragment.move(scrollX, scrollY);
            }
            canvas.renderAll();
        },
        /**
         * Redraw screen.
         */
        redraw: function () {
            var s = this,
                x = s.scroller.scrollLeft,
                y = s.scroller.scrollTop;
            s.draw(x, y);
        },
        /**
         * Set size.
         * @param {number} w - Screen width.
         * @param {number} h - Screen height.
         */
        size: function (w, h) {
            var s = this,
                canvas = s.canvas;
            canvas.setWidth(w);
            canvas.setHeight(h);

            var bounds = new pr.Rect.ofElement(canvas.getElement());
            s.syncAll(bounds);
            s.redraw();
        },
        /**
         * Resize screen.
         */
        resize: function () {
            var s = this,
                rect = Screen._visibleRect(s.sizer);
            s.size(rect.width, rect.height);
        },
        /**
         * @param {pr.Rect} bounds - Canvas bounds.
         * Sync all elements.
         */
        syncAll: function (bounds) {
            var s = this;
            for (var i = 0; i < s.fragments.length; i++) {
                var fragment = s.fragments[i];
                fragment.sync(bounds);
            }
        }

    };

    /**
     * New canvas id.
     * @returns {string} - Canvas id string.
     * @private
     */
    Screen._newCanvasId = function () {
        return pr.prefixed('canvas-' + new Date().getTime());
    };

    /**
     * Create a new screen element.
     * @param {string} canvasId - Id for canvas.
     * @returns {HTMLElement} - A screen element.
     * @private
     */
    Screen._newScreenElement = function (canvasId) {
        var div = document.createElement('div');
        div.classList.add(c.classNames.SCREEN);
        var canvas = document.createElement('canvas');
        canvas.id = canvasId;
        div.appendChild(canvas);
        return div;
    }

    /**
     * Get visible rect
     * @param {HTMLElement} elm - Elemnt to work with.
     * @returns {parari.Rect} - Visible rectangle.
     * @private
     */
    Screen._visibleRect = function (elm) {
        var offset = u.offsetSum(elm),
            rect = new pr.Rect(
                offset.left,
                offset.top,
                elm.offsetWidth,
                elm.offsetHeight
            ),
            bounds = new pr.Rect(
                0, 0, window.innerWidth, window.innerHeight
            );
        return rect.clip(bounds);
    }

    pr.Screen = Screen;

})(
    window.parari = window.parari || {},
    document,
    window.fabric
);