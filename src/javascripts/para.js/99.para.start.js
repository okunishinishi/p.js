/**
 * Start para.
 * @function start
 */

(function (para, document) {
    "use strict";

    var u = para.util;


    function createSrc(root) {
        var src = u.ensureElement(root);
        if (!src) {
            throw new Error('Root not found: "' + root + '"');
        }
        src.classList.add('pr-src');
        src.findPrObjects = function () {
            return u.toArray(src.querySelectorAll('[data-pr-object]'));
        };
        return src;
    }

    function createScreen() {
        var id = ['pr', 'screen', new Date().getTime()].join('-');
        var canvas = u.newCanvas(id, 300, 300);
        canvas.classList.add('pr-screen');
        return  new para.Screen(canvas);
    }


    function createObject(elm, style) {
        var w = elm.offsetWidth,
            h = elm.offsetHeight,
            point = u.centerPoint(elm);
        var data = elm.dataset;
        var elmStyle = u.getStyleString(elm);
        return new para.Object({
            width: w,
            height: h,
            x: point.x,
            y: point.y,
            z: Number(data.prZ || 1),
            speed: Number(data.prSpeed || 1),
            html: [
                    '<div class="pr-object" style="' + elmStyle + '">',
                    '<style type="text/css">' + style + '</style>',
                elm.innerHTML,
                '</div>'
            ].join('')
        });
    }


    para.start = function (root, options) {

        var style = u.getDocumentStyleString();

        var body = document.body,
            src = createSrc(root),
            screen = createScreen(),
            objects = src.findPrObjects()
                .map(function (src) {
                    var object = createObject(src, style);
                    object.vLock = options.vLock;
                    object.hLock = options.hLock;
                    return  object;
                })
                .sort(function (a, b) {
                    return a.z - b.z;
                });

        function redraw() {
            var x = body.scrollLeft,
                y = body.scrollTop;
            screen.draw(x, y);
        }

        function resize() {
            screen.resize(window.innerWidth, window.innerHeight);
        }

        screen.insertAfter(src);
        screen.loadObjects(objects, function () {
            resize();
            redraw();
        });

        window.addEventListener('scroll', redraw, false);
        window.addEventListener('resize', resize, false);

    };
})(window.para = window.para || {}, document);

