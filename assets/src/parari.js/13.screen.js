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


        var canvases = Screen.createCanvaseElements(2);

        var elm = Screen._newScreenElement(canvases);
        container.appendChild(elm);

        'click,mousedown,mouseup'.split(',').forEach(function (eventName) {
            elm.addEventListener(eventName, s.captureEvent.bind(s), false);
        });


        s.textureCanvas = Screen.newFabricCanvas(canvases[0].id, 'texture');
        s.fragmentsCanvas = Screen.newFabricCanvas(canvases[1].id, 'fragment');

        s.fragments = [];
        s.textures = [];

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
                x = u.eventOffsetX(e),
                y = u.eventOffsetY(e),
                fragment = s._hitFragment(x, y);
            if (fragment) {
                var shouldRender = fragment.handleEvent(e);
                if (shouldRender) {
                    s.fragmentsCanvas.renderAll();
                }
            }
        },
        /**
         * Fabirc canvas.
         * @type fabric.Canvas
         */
        fragmentsCanvas: null,
        /**
         * Fragment objects.
         * @type {parari.Fragment[]}
         */
        fragments: null,
        /**
         * Textures.
         * @type {parari.textures.Texture}
         */
        textures: null,
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
         * @param {parari.Fragment} fragment - Fragment to register.
         */
        registerFragment: function (fragment) {
            var s = this;
            s.fragments.push(fragment);
            s.fragmentsCanvas.add(fragment.drawable);
        },
        /**
         * Register a texture object.
         * @param {parari.textures.Texture} texture - Texture to register.
         */
        registerTexture: function (texture) {
            var s = this;
            s.textures.push(texture);
        },
        /**
         * Register fragment objects.
         * @param {parari.Fragment[]} fragments - Fragments to register.
         */
        registerFragments: function (fragments) {
            var s = this;
            [].concat(fragments).forEach(function (fragment) {
                s.registerFragment(fragment);
            });
        },
        /**
         * Register textures.
         * @param {parari.textures.Texture[]} textures - Textures to register.
         */
        registerTextures: function (textures) {
            var s = this;
            [].concat(textures).forEach(function (texture) {
                s.registerTexture(texture);
            });
            s.resortTextures();
        },
        /**
         * Resort textures.
         */
        resortTextures: function () {
            var s = this;
            s.textures = s.textures.sort(function (a, b) {
                return a.z - b.z;
            });
        },
        resort: function () {
            var s = this;
            s.resortTextures();
        },
        /**
         * Draw screen.
         * @param {number} scrollX
         * @param {number} scrollY
         */
        draw: function (scrollX, scrollY) {
            var s = this;
            s.drawTextures(scrollX, scrollY);
            s.drawFragments(scrollX, scrollY);
        },
        /**
         * Draw textures.
         * @param {number} scrollX
         * @param {number} scrollY
         */
        drawTextures: function (scrollX, scrollY) {
            var s = this,
                canvas = s.textureCanvas,
                ctx = canvas.getContext();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var j = 0; j < s.textures.length; j++) {
                var texture = s.textures[j];
                texture.render(ctx, scrollX, scrollY);
            }
        },
        /**
         * Draw fragmens.
         * @param {number} scrollX
         * @param {number} scrollY
         */
        drawFragments: function (scrollX, scrollY) {
            var s = this;
            for (var i = 0, len = s.fragments.length; i < len; i++) {
                var fragment = s.fragments[i];
                fragment.move(scrollX, scrollY);
            }
            s.fragmentsCanvas.renderAll();
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
            var s = this;
            Screen.changeCanvasSize(s.fragmentsCanvas, w, h);
            Screen.changeCanvasSize(s.textureCanvas, w, h);

            var bounds = s.getCanvasBounds();
            s.syncFragments(bounds);
            s.syncTextures(bounds);
            s.redraw();
        },
        /**
         * Get canvas bounds.
         * @returns {parari.Rect}
         */
        getCanvasBounds: function () {
            var s = this,
                elm = s.fragmentsCanvas.getElement();
            return new pr.Rect.ofElement(elm);
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
         * Sync all fragments.
         * @param {pr.Rect} bounds - Canvas bounds.
         */
        syncFragments: function (bounds) {
            var s = this;
            for (var i = 0, len = s.fragments.length; i < len; i++) {
                var fragment = s.fragments[i];
                fragment.sync(bounds);
            }
        },
        /**
         * Sync textures.
         * @param {pr.Rect} bounds - Canvas bounds.
         */
        syncTextures: function (bounds) {
            var s = this;
            for (var i = 0, len = s.textures.length; i < len; i++) {
                var texture = s.textures[i];
                texture.sync(bounds);
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
                s.fragmentsCanvas.renderAll()
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
             * Create multipe canvases.
             * @param {number} count - Number of canvases.
             * @returns {HTMLCanvasElemnt[]} - Canvas elementes.
             */
            createCanvaseElements: function (count) {
                var result = [];
                for (var i = 0; i < count; i++) {
                    var canvas = Screen._newCanvasElement();
                    result.push(canvas);
                }
                return result;
            },
            /**
             * Create a new canva element.
             * @returns {HTMLCanvasElement} - A canvas element.
             * @private
             */
            _newCanvasElement: function () {
                var id = ['canvas' , u.uuid().replace(/\-/g, '')].join('-'),
                    canvas = document.createElement('canvas');
                canvas.id = pr.prefixed(id);
                return canvas;
            },
            /**
             * Create a new screen element.
             * @param {HTMLCanvasElements[]} canvasElements - Canvas elements.
             * @returns {HTMLElement} - A screen element.
             * @private
             */
            _newScreenElement: function (canvasElements) {
                var div = document.createElement('div');
                div.classList.add(c.classNames.SCREEN);

                var canvasContainer = document.createElement('div');
                canvasContainer.classList.add(c.classNames.CANVAS_CONTINER);
                div.appendChild(canvasContainer);

                for (var i = 0; i < canvasElements.length; i++) {
                    canvasContainer.appendChild(canvasElements[i]);
                }
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
             * @param {string} canvasId - Canvas element id.
             * @param {string} name - Canvas name.
             * @returns {fabric.StaticCanvas}
             */
            newFabricCanvas: function (canvasId, name) {
                var canvas = new f.StaticCanvas(canvasId, {
                    renderOnAddRemove: false,
                    selection: false,
                });
                var elm = canvas.getElement();
                var className = pr.prefixed([name, 'canvas'].join('-'));
                elm.classList.add(className);
                return  canvas;
            },
            /**
             * Change canvas size.
             * @param {fabric.Canvas} canvas - Canvas to change.
             * @param {number} w - Canvas width.
             * @param {number} h - Canvas height.
             */
            changeCanvasSize: function (canvas, w, h) {
                canvas.setWidth(w);
                canvas.setHeight(h);

                var elm = canvas.getElement();
                u.optimizeCanvasRatio(elm);

                var container = elm.parentNode;
                container.style.width = w + 'px';
                container.style.height = h + 'px';
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