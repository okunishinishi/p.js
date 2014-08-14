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
                textures: []
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

        var textures = pr.start._createTextures(o.textures, {
            vLock: o.vLock,
            hLock: o.hLock
        });
        screen.registerTextures(textures);

        reload();
    };

    /**
     * Create textures.
     * @param {object} textures - Texture data.
     * @param {object} defaultOptions - Texture defaultOptions.
     * @returns {parari.textures.Texture} - Textures.
     * @private
     */
    pr.start._createTextures = function (textures, defaultOptions) {
        return Object.keys(textures)
            .map(function (name) {
                var Texture = pr.resolveTexture(name);
                if (!Texture) {
//                throw new Error('Invalid texture: ' + name);
                    return []; //FIXME
                }
                return [].concat(textures[name]).map(function (option) {
                    option = u.copy(option, u.copy(defaultOptions, {}))
                    return  new Texture(option);
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