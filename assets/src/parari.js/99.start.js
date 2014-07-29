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

        var style = u.getDocumentStyleString(),
            src = new pr.Src(root),
            objects = src.getObjects({
                vLock: !!options.vLock,
                hLock: !!options.hLock
            }),
            screen = new pr.Screen(canvas);

        screen.scroller = options.scroller || document.body;
        screen.sizer = options.sizer || window;


        var redraw = screen.redraw.bind(screen),
            resize = screen.resize.bind(screen);

        window.addEventListener('scroll', redraw, false);
        window.addEventListener('resize', resize, false);


        screen.loadObjects(objects, function () {
            resize();
            redraw();
        });


        resize();
        redraw();
    };

})(window.parari = window.parari || {}, document, window);