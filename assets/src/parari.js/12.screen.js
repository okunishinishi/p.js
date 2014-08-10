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

        var canvasId = Screen._newCanvasId();
        var elm = Screen._newScreenElement(canvasId);
        container.appendChild(elm);

        s.canvas = new f.Canvas(canvasId);
        s.drawables = [];

    }

    Screen.prototype = {
        /**
         * Fabirc canvas.
         * @type fabric.Canvas
         */
        canvas: null,
        /**
         * Drawable object.
         * @type {parari.Drawables}
         */
        drawables: null,
        /**
         * Element to fit size with.
         */
        sizer: null,
        /**
         * Element to scroll with.
         */
        scroller: null,
        /**
         * Add a drawable object.
         * @param {parari.Drawable} drawable - Drawable.
         */
        add: function (drawable) {
            var s = this;
            s.drawables.push(drawable);
            s.canvas.add(drawable);
        },
        /**
         * Add drawable objects.
         * @param {parari.Drawable[]} drawables - Drawables.
         */
        addAll: function (drawables) {
            var s = this;
            [].concat(drawables).forEach(function (drawable) {
                s.add(drawable);
            });
        },
        /**
         * Draw screen.
         */
        draw: function () {
            var s = this,
                canvas = s.canvas;
            canvas.renderAll();
        },
        /**
         * Redraw screen.
         */
        redraw: function () {
            var s = this;
            s.draw();
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

            var rect = new pr.Rect.ofElement(canvas.getElement());

            for (var i = 0; i < s.drawables.length; i++) {
                var drawable = s.drawables[i];
                drawable.bounds = rect;
            }
            s.invalidate();
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
         * Invalidate drawables.
         */
        invalidate: function () {
            var s = this;
            for (var i = 0; i < s.drawables.length; i++) {
                var drawable = s.drawables[i];
                drawable.invalidate();
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