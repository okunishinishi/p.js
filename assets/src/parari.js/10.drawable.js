/**
 * Parari drawable.
 * @memberof parari
 * @constructor Drawable
 * @param {fabric.Object[]} objects.
 * @requires fabric
 */
(function (pr, f, document) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends Drawable */
    function Drawable(elm) {
        var s = this,
            style = u.getComputedStyle(elm);
        s.__proto__ = u.copy(Drawable.prototype, new f.Group([], {
            selectable: false,
            hasRotatingPoint: false,
        }));
        s.__isPrDrawable = true;
        s.addAll(
            [
                Drawable.background(style),
                Drawable.text(Drawable.textValue(elm), style),
            ]
                .filter(Drawable._filters.emptyRejecter)
                .concat(Drawable.children(elm))
        );
        s.elm = elm;
        if (elm.src) {
            f.Image.fromURL(elm.src, function (image) {
                s.add(image);
                s.layout();
                u.triggerEvent(elm, 'pr-img-load');
            });
        }
    };

    Drawable.prototype = {
        /**
         * Layout drawable contents.
         */
        layout: function () {
            var s = this,
                w = s.elm.offsetWidth,
                h = s.elm.offsetHeight;

            var round = Math.round;
            var bounds = {
                width: round(w),
                height: round(h),
                left: round(w / 2),
                top: round(h / 2),
                originX: 'center',
                originY: 'center'
            };

            var baseOffset = u.offsetSum(s.elm);
            s.getObjects().forEach(function (object) {
                var isDrawable = object.__isPrDrawable;
                if (isDrawable) {
                    var offset = u.offsetSum(object.elm);
                    object.set({
                        top: round(offset.top - baseOffset.top),
                        left: round(offset.left - baseOffset.left)
                    });
                    object.layout();
                } else {
                    object.set(bounds);
                }
            });
        },
        /**
         * Add all objects.
         * @param {fabric.Object[]} objects - Objects add.
         */
        addAll: function (objects) {
            var s = this;
            objects = [].concat(objects)
                .forEach(function (object) {
                    s.add(object);
                });
        },
        /**
         * Remove all objects.
         * @returns {fabric.Object[]} - Removed objects.
         */
        removeAll: function () {
            var s = this,
                removed = [];
            var obj;
            while (obj = s.remove()) {
                removed.push(obj);
            }
            return removed;
        },
        _frameRect: null,
        getFrame: function () {
            var s = this,
                rect = s._frameRect;
            if (!rect) {
                rect = s._frameRect = pr.Rect.RectZero();//Reuse rect instance for performance reason.
            }
            var h = s.getHeight(),
                w = s.getWidth();
            rect.top = s.getTop() + h / 2;
            rect.left = s.getLeft() + w / 2;
            rect.width = w;
            rect.height = h;
            return rect;
        }

    };

    u.copy(
        /** @lends Drawable */
        {
            /**
             * Create a background.
             * @param {CSSStyleDeclaration} style - Style object.
             * @returns {fabric.Rect} - Rect object.
             */
            background: function (style) {
                return new f.Rect({
                    selectable: false,
                    hasRotatingPoint: false,
                    fill: style.backgroundColor
                });
            },
            /**
             * Create a text.
             * @param {string} text - Text
             * @param {CSSStyleDeclaration} style - Style object.
             * @returns {fabric.Text} - Rect object.
             */
            text: function (text, style) {
                return new f.Text(text, {
                    selectable: false,
                    hasRotatingPoint: false,
                    fontSize: Math.round(u.extractNumber(style.fontSize)),
                    fill: style.color,
                    fontFamily: style.fontFamily,
                    fontStyle: style.fontStyle,
                    fontWeight: style.fontWeight,
                    textAlign: Drawable._styleDictionary.textAlign[style.textAlign],
                });
            },
            /**
             * Style dictionary.
             * Some of css style values is not supported in fabric.js and
             * needs to be altenated with another value.
             */
            _styleDictionary: {
                textAlign: {
                    start: 'left',
                    left: 'left',
                    center: 'center',
                    right: 'right',
                    justify: 'center',
                    initial: 'left',
                    inherit: 'left'
                }
            },
            /**
             * Create children.
             * @param {HTMLElement} elm - Elmeent
             * @returns {*}
             */
            children: function (elm) {
                return u.toArray(elm.childNodes)
                    .filter(Drawable._filters.elementFilter)
                    .map(Drawable._maps.drawableMap)
                    .reduce(u.concatReduce, []);
            },
            /**
             * Get text value of a elmenet.
             * @param {HTMLElement} elm - An html element.
             * @returns {string} - Elment text value.
             */
            textValue: function (elm) {
                return u.toArray(elm.childNodes)
                    .map(function (node) {
                        var isText = u.isTextNode(node),
                            nodeValue = node.nodeValue || node.textContent || ''
                        if (isText) {
                            return nodeValue;
                        } else {
                            return node.textContent.replace(/./g, " ");
                        }
                    })
                    .join('');
            },
            _filters: {
                emptyRejecter: function (value) {
                    return !!value;
                },
                elementFilter: function (elm) {
                    return u.isElementNode(elm);
                },
                textNodeFileter: function (node) {
                    return u.isTextNode(node);
                }
            },
            _maps: {
                drawableMap: function (elm) {
                    return new Drawable(elm);
                },
                nodeValueMap: function (node) {
                    return node.nodeValue;
                }
            }
        }, Drawable);


    pr.Drawable = Drawable;

})(
    window.parari = window.parari || {},
    window.fabric,
    document
);