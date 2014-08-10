/**
 * Start parari.
 * @memberof parari
 * @function start
 * @param {HTMLElement|string} root - Root element.
 * @param {object} options - Optional settings.
 * @param {boolean} [options.vLock] - Should lock vertical scroll.
 * @param {boolean} [options.hLock] - Should lock horizontal scroll.
 * @param {HTMLElement} [options.scroller=parari.bodyScroller] - Elemnt to scroll with.
 * @param {Window|HTMLElement} - [options.sizer=root] - Element to size fit.
 * @param {HTMLElement} [options.screenContainer=document.body] - Element to contains screen.
 */

(function (pr, document, window) {
    "use strict";
    var u = pr.utilities;

    /** @lends start */
    pr.start = function (root, options) {
        root = u.toElement(root);
        if (!root) {
            throw new Error('Root not found: "' + root + '"');
        }
        var body = document.body,
            o = u.copy(options || {}, {
                vLock: false,
                hLock: false,
                scroller: pr.bodyScroller,
                sizer: root,
                screenContainer: body
            });

        var src = new pr.Src(root),
            screen = new pr.Screen(o.screenContainer, {
                sizer: o.sizer,
                scroller: o.scroller
            });

        var redraw = screen.redraw.bind(screen),
            resize = screen.resize.bind(screen),
            reload = function () {
                var fragments = src.createFragments();
                screen.registerAll(fragments);
                redraw();
                resize();
            };

        window.addEventListener('scroll', redraw, false);
        window.addEventListener('resize', resize, false);


        reload();
    };


})(
    window.parari = window.parari || {},
    document,
    window);