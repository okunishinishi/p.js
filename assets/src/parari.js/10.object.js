/**
 * Parari object.
 * @memberof parari
 * @constructor Object
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends Object */
    function PrObject(data) {
        var s = this;
        u.copy(data || {}, s);
        s.invalidate();

    };

    PrObject.prototype = {
        /**
         * Load object data as image.
         * @param {function} callback - Callback when done.
         */
        load: function (callback) {
            var s = this;
            u.htmlToImage(s.html, s.width, s.height, function (image) {
                s.image = image;
                s.invalidate();
                callback && callback(s);
            });
        },
        /**
         * Get left position.
         * @returns {*}
         */
        getLeft: function () {
            var s = this;
            return s.x - s.width / 2;
        },
        /**
         * Get right position.
         * @returns {*}
         */
        getRight: function () {
            var s = this;
            return s.x + s.width / 2;
        },
        /**
         * Get top position.
         * @returns {*}
         */
        getTop: function () {
            var s = this;
            return s.y - s.height / 2;
        },
        /**
         * Get bottom position.
         * @returns {*}
         */
        getBottom: function () {
            var s = this;
            return s.y + s.height / 2;
        },
        /**
         * Draw object.
         * @param {CanvasRenderingContext2D} ctx
         * @param {number} x
         * @param {number} y
         */
        draw: function (ctx, x, y) {
            var s = this;
            if (!s.image) {
                return;
            }
            var left = s.getLeft(),
                top = s.getTop(),
                speed = s.speed;
            var dx = s.hLock ? 0 : s.dx * (1 - speed),
                dy = s.vLock ? 0 : s.dy * (1 - speed);
            ctx.drawImage(s.image,
                    left - x * speed - dx,
                    top - y * speed - dy);
        },
        /**
         * Invalidate object rendering.
         */
        invalidate: function () {
            var s = this,
                elm = s.elm;
            if (!elm) {
                return;
            }
            var data = elm.dataset,
                point = u.centerPoint(elm),
                w = elm.offsetWidth,
                h = elm.offsetHeight;
            s.x = point.x;
            s.y = point.y;
            s.z = Number(data.prZ || 1);
            s.speed = Number(data.prSpeed || 1);
            s.width = w;
            s.height = h;
        },
        /**
         * Reload element.
         */
        reload: function (callback) {
            var s = this;
            s.html = PrObject.elmToHtml(s.elm, s.style);
            s.load(callback);
        }
    };

    /**
     * Create html from elm.
     * @param {HTMLElement} elm - Element to create form.
     * @param {string} style - Style string.
     * @returns {string}
     */
    PrObject.elmToHtml = function (elm, style) {
        var elmStyle = u.getStyleString(elm) || '';
        style = style || '';
        return  [
                '<div class="pr-object" style="' + elmStyle + '">',
            ('<style type="text/css">' + style + '</style>'),
            elm.innerHTML,
            '</div>'
        ].join('');
    };

    /**
     * Create a parari object from element.
     * @param {HTMLElement} elm - Element to create form.
     * @param {string} style - Style string.
     * @returns {PrObject}
     */
    PrObject.fromElement = function (elm, style) {

        var elmStyle = u.getStyleString(elm);
        var obj = new PrObject({
            elm: elm,
            style: style,
            html: PrObject.elmToHtml(elm, style)
        });

        var imgLoad = function (img) {
            obj.reload(function () {
                obj.invalidate();
                obj.onPrImgLoad && obj.onPrImgLoad(img);
            });
        };
        imgLoad._timer = null;

        u.toArray(elm.querySelectorAll('img')).forEach(function (img) {
            img.onload = function () {
                imgLoad(img);
            }
        });

        return  obj;
    };

    pr.Object = PrObject;

})(window.parari = window.parari || {}, document);