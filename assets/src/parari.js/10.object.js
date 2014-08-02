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
                callback(s);
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
        var w = elm.offsetWidth,
            h = elm.offsetHeight,
            point = u.centerPoint(elm);
        var data = elm.dataset,
            elmStyle = u.getStyleString(elm);
        return new PrObject({
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

        function reload() {

        }

        u.toArray(elm.querySelectorAll('img')).forEach(function (img) {
            img.onload = function () {
                //TODO replace image html.
                setTimeout(function () {
                    obj.html = PrObject.elmToHtml(elm, style);
                    obj.load();
                }, 5);

            };
        });

        return  obj;
    };

    pr.Object = PrObject;

})(window.parari = window.parari || {}, document);