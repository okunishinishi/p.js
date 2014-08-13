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

    var isSupported = pr.isSupported(window);


    var u = pr.utilities,
        c = pr.constants;


    /** @lends start */
    pr.start = function (root, options) {
        root = u.toElement(root);
        if (!root) {
            throw new Error('Root not found: "' + root + '"');
        }
        root.classList.add(c.classNames.ROOT);

        if (!isSupported) {
            pr.presentNotSupported(root);
            return;
        }


        var body = document.body,
            o = u.copy(options || {}, {
                vLock: false,
                hLock: false,
                scroller: pr.bodyScroller,
                sizer: root,
                screenContainer: body,
                layers: []
            });

        var src = new pr.Src(root),
            screen = new pr.Screen(o.screenContainer, {
                sizer: o.sizer,
                scroller: o.scroller
            });

        var redraw = screen.redraw.bind(screen),
            resize = screen.resize.bind(screen),
            reload = u.composite(redraw, resize);

        window.addEventListener('scroll', redraw, false);
        window.addEventListener('resize', resize, false);
        window.addEventListener('pr-img-load', function () {
            screen.reserve('reload', reload, 200);
        });


        var fragments = src.createFragments({
            vLock: o.vLock,
            hLock: o.hLock
        });
        screen.registerFragments(fragments);

        var layers = pr.start._createLayers(o.layers, {
            vLock: o.vLock,
            hLock: o.hLock
        });
        screen.registerLayers(layers);

        reload();
    };

    /**
     * Create layers.
     * @param {object} layers - Layer data.
     * @param {object} defaultOptions - Layer defaultOptions.
     * @returns {parari.layers.Layer} - Layers.
     * @private
     */
    pr.start._createLayers = function (layers, defaultOptions) {
        return Object.keys(layers)
            .map(function (name) {
                var Layer = pr.resolveLayer(name);
                if (!Layer) {
//                throw new Error('Invalid layer: ' + name);
                    return []; //FIXME
                }
                return [].concat(layers[name]).map(function (option) {
                    option = u.copy(option, u.copy(defaultOptions, {}))
                    return  new Layer(option);
                });
            })
            .reduce(function (prev, cur) {
                return prev.concat(cur);
            }, []);

    };


})(
    window.parari = window.parari || {},
    document,
    window);