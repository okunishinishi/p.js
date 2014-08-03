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

        var vLock = options.vLock,
            hLock = options.hLock;

        var style = u.getDocumentStyleString(),
            src = new pr.Src(root, style),
            objects = src.getObjects({
                vLock: !!vLock,
                hLock: !!hLock
            }),
            screen = new pr.Screen(canvas);

        screen.scroller = options.scroller || {
            _scrollValueForKey: function (key) {
                return document.documentElement[key] || document.body[key];
            },
            get scrollLeft() {
                var s = this;
                return s._scrollValueForKey('scrollLeft');
            },
            get scrollTop() {
                var s = this;
                return s._scrollValueForKey('scrollTop');
            }
        };
        screen.sizer = src.elm;


        var redraw = screen.redraw.bind(screen),
            resize = screen.resize.bind(screen);

        window.addEventListener('scroll', redraw, false);
        window.addEventListener('resize', resize, false);


        objects.push(new pr.layers.NightSkyLayer({

        }));
        screen.loadObjects(objects, function () {
            resize();
            redraw();
            canvas.classList.add(pr.prefixed('canvas-ready'))
        });


        var onload = window.onload && window.onload.bind(window);
        window.onload = function () {
            resize();
            screen.invalidate();
            screen.redraw();
            onload && onload();
        }


        resize();
        redraw();
    };

})(window.parari = window.parari || {}, document, window);