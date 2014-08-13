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


        'click,mousedown,mouseup'.split(',').forEach(function (eventName) {
            elm.addEventListener(eventName, s.captureEvent.bind(s), false);
        })

        s.canvas = Screen.newCanvas(canvasId);

        s.fragments = [];

        s.startLooping(s._renderInterval);

    }

    Screen.prototype = {
        _renderInterval: 5000,
        _renderTimer: null,
        _needsSync: false,
        /**
         * Find a fragment to hit the point.
         * @param {number} x - X position.
         * @param {number} y - Y potision.
         * @returns {parari.Fragment}
         * @private
         */
        _hitFragment: function (x, y) {
            var s = this;
            for (var i = s.fragments.length - 1; i >= 0; i--) {
                var fragment = s.fragments[i];
                var hit = fragment.hits(x, y);
                if (hit) {
                    return fragment;
                }
            }
            return null;
        },
        captureEvent: function (e) {
            var s = this,
                x = (e.offsetX == undefined) ? e.layerX : e.offsetX,
                y = (e.offsetY == undefined) ? e.layerY : e.offsetY,
                fragment = s._hitFragment(x, y);
            if (fragment) {
                var shouldRender = fragment.handleEvent(e);
                if (shouldRender) {
                    s.canvas.renderAll();
                }
            }
        },
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

            var canvasElement = canvas.getElement();
            u.optimizeCanvasRatio(canvasElement);

            var bounds = new pr.Rect.ofElement(canvasElement);
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
        },
        /**
         * Start render loop.
         * @param {number} interval - Time interval to run render method.
         */
        startLooping: function (interval) {
            var s = this;
            s.stopLooping();
            s._renderTimer = setInterval(function () {
                s.canvas.renderAll()
            }, interval);
        },
        /**
         * Stop render loop.
         */
        stopLooping: function () {
            var s = this;
            clearInterval(s._renderTimer);
        },
        _reservations: null,
        /**
         * Reserve an action.
         * @param {string} name
         */
        reserve: function (name, action, timeout) {
            var s = this;
            if (!s._reservations) {
                s._reservations = {};
            }
            s._reservations[name] = action;
            setTimeout(function () {
                var action = s._reservations[name];
                if (action) {
                    action.call(s);
                }
                s._reservations[name] = null;
            }, timeout || 500);
        }
    };

    u.copy(
        /** @lends Screen */
        {

            /**
             * New canvas id.
             * @returns {string} - Canvas id string.
             * @private
             */
            _newCanvasId: function () {
                return pr.prefixed('canvas-' + new Date().getTime());
            },

            /**
             * Create a new screen element.
             * @param {string} canvasId - Id for canvas.
             * @returns {HTMLElement} - A screen element.
             * @private
             */
            _newScreenElement: function (canvasId) {
                var div = document.createElement('div');
                div.classList.add(c.classNames.SCREEN);
                var canvas = document.createElement('canvas');
                canvas.id = canvasId;
                div.appendChild(canvas);
                return div;
            },

            /**
             * Get visible rect
             * @param {HTMLElement} elm - Elemnt to work with.
             * @returns {parari.Rect} - Visible rectangle.
             * @private
             */
            _visibleRect: function (elm) {
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
            },
            /**
             * Create a new canvas.
             * @param canvasId
             * @returns {fabric.StaticCanvas}
             */
            newCanvas: function (canvasId) {
                return new f.StaticCanvas(canvasId, {
                    renderOnAddRemove: false,
                    selection: false,
                });
            }
        },
        Screen
    );

    pr.Screen = Screen;

})(
    window.parari = window.parari || {},
    document,
    window.fabric
);