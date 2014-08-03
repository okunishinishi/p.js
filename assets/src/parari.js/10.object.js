/**
 * Parari object.
 * @memberof parari
 * @constructor Object
 * @param {object} options
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
    }

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
                if (callback) {
                    callback(s);
                }
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
        dx: 0,
        dy: 0,
        /**
         * Draw object.
         * @param {CanvasRenderingContext2D} ctx
         * @param {number} scrollX
         * @param {number} scrollY
         */
        draw: function (ctx, scrollX, scrollY) {
            var s = this;
            if (!s.image) {
                return;
            }
            var left = s.getLeft(),
                top = s.getTop(),
                speed = s.speed;

            var dx = s.hLock ? 0 : s.dx * (1 - speed),
                dy = s.vLock ? 0 : s.dy * (1 - speed);

            var x = left - scrollX * speed - dx,
                y = top - scrollY * speed - dy,
                w = s.width,
                h = s.height;

            var valid = w > 0 && h > 0;
            if (!valid) {
                return;
            }
            var factor = s.factor(x, y);

            if (isNaN(factor)) {
                factor = 0;
            }
            ctx.drawImage(s.image, x, y, w, h);
        },
        /**
         * Transform factor value.
         * @param {number} x - X position.
         * @param {number} y - Y position.
         * @returns {number} - Factor value. -1 ~ +1.
         */
        factor: function (x, y) {
            var s = this;
            if (s.hLock) {
                return u.rate(s.minX, s.maxX, x) * 2 - 1;
            }
            if (s.vLock) {
                return u.rate(s.minY, s.maxY, y) * 2 - 1;
            }
            return 0;
        },
        /**
         * Set object bounds.
         * @param {number} minX - Minimum x vlaue.
         * @param {number} minY - Minimum y value.
         * @param {number} maxX - Maximum x value.
         * @param {number} maxY - Maximum y value.
         */
        setBounds: function (minX, minY, maxX, maxY) {
            var s = this;
            s.minX = minX;
            s.minY = minY;
            s.maxX = maxX;
            s.maxY = maxY;
        },
        /**
         * Get bound object.
         * @returns {object} - Boudns object.
         */
        getBounds: function () {
            var s = this;
            return {
                minX: s.minX,
                minY: s.minY,
                maxX: s.maxX,
                maxY: s.maxY,
            }
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

    PrObject.elmStyleString = function (elm) {
        var styles = u.getStyles(elm);
        return Object.keys(styles)
            .filter(PrObject.elmStyleString._keyFilter)
            .map(function (key) {
                var val = styles[key];
                return [key, val].join(':');
            })
            .join(';');
    };

    PrObject.elmStyleString._keyFilter = function (key) {
        var _keys = PrObject.elmStyleString._keys;
        for (var i = 0; i < _keys.length; i++) {
            var valid = key.match(_keys[i]);
            if (valid) {
                return true;
            }
        }
        return false;
    }

    PrObject.elmStyleString._keys = [
        'height',
        'width',
        'left',
        'top',
        'color',
        'position',
        'opacity',
        'float',
        'justify-content',
        'display',
        'letter-spacing',
        'font-size',
        'font-style',
        'vertical-align',
        'line-height',
        /^padding\-/,
        /^margin\-/,
        /^background\-/,
        /^text\-/,
        /^list\-/,
        /^outline\-/,
        /^justify\-/,
        /^white\-/,
        /^word\-/,
    ];


    /**
     * Create html from elm.
     * @param {HTMLElement} elm - Element to create form.
     * @returns {string}
     */
    PrObject.elmToHtml = function (elm) {
        var elmStyle = PrObject.elmStyleString(elm) || '';
        return  [
                '<div class="pr-object" style="' + elmStyle + '">',
            elm.innerHTML,
            '</div>'
        ].join('');
    };

    /**
     * Create a parari object from element.
     * @param {HTMLElement} elm - Element to create form.
     * @returns {PrObject}
     */
    PrObject.fromElement = function (elm) {
        var elmStyle = u.getStyleString(elm);
        var obj = new PrObject({
            elm: elm,
            html: PrObject.elmToHtml(elm)
        });


        u.toArray(elm.querySelectorAll('img')).forEach(function (img) {
            img.onload = function () {
                setTimeout(function () {
                    if (obj.onPrImgLoad) {
                        obj.onPrImgLoad(img);
                    }
                }, 10);
            }
        });

        return  obj;
    };

    pr.Object = PrObject;

})(window.parari = window.parari || {}, document);