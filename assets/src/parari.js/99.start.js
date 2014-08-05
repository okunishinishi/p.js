/**
 * Start para.
 * @function start
 */

(function (pr, document, window) {
    "use strict";

    var u = pr.utilities;


    /**
     * @lends start
     * @param {HTMLElement|string} root - Root element.
     * @param {object} options - OPtional settings.
     * @param {HTMLElement} [options.scroller=document.body] - Elemnt to scroll with.
     * @param {Window|HTMLElement} - [options.sizer=window] - Element to size fit.
     */
    pr.start = function (root, options) {
        root = u.ensureElement(root);
        if (!root) {
            throw new Error('Root not found: "' + root + '"');
        }
        options = options || {};

        var canvas = document.createElement('canvas');
        u.insertAfter(canvas, root);

        var vLock = !!options.vLock,
            hLock = !!options.hLock;

        var style = u.getDocumentStyleString(),
            src = new pr.Src(root, style),
            objects = src.getObjects({
                vLock: vLock,
                hLock: hLock
            }),
            screen = new pr.Screen(canvas);

        screen.scroller = options.scroller || pr.bodyScroller;
        screen.sizer = src.elm;


        var redraw = screen.redraw.bind(screen),
            resize = screen.resize.bind(screen);

        window.addEventListener('scroll', redraw, false);
        window.addEventListener('resize', resize, false);
        window.addEventListener('click', function () {

        }, false);


        Object.keys(options.layers || {})
            .forEach(function (name) {
                var option = options.layers[name],
                    layers = pr.start._newLayers(name, option, vLock, hLock);
                layers.forEach(function (layer) {
                    objects.push(layer);
                });
            });


        screen.loadObjects(objects, function () {
            resize();
            redraw();
            canvas.classList.add(pr.prefixed('canvas-ready'));
            screen.resort();
        });


        window.addEventListener('load', function () {
            resize();
            screen.invalidate();
            screen.redraw();
        }, false);


        resize();
        redraw();
    };

    /**
     * Create new layers.
     * @param {string} name - Layer name.
     * @param {object|object[]} option - Layer options.
     * @param {boolean} vLock - Should lock vertically.
     * @param {boolean} hLock - Should lock horizontaly.
     * @private
     */
    pr.start._newLayers = function (name, option, vLock, hLock) {
        var Layer = pr.resolveLayer(name);
        if (!Layer) {
            throw new Error('Unknwon layer: ' + name)
        }
        return [].concat(option).map(function (option) {
            u.copy({
                vLock: vLock,
                hLock: hLock
            }, option);
            return new Layer(option);
        });
    };

})(window.parari = window.parari || {}, document, window);