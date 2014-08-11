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
            style = window.getComputedStyle(elm, '');
        s.__proto__ = u.copy(Drawable.prototype, new f.Group());
        s.addAll([
            Drawable.background(style),
            Drawable.text(Drawable.textValue(elm), style),
        ].concat(Drawable.children(elm)));
        s.elm = elm;
    };

    Drawable.prototype = {
        /**
         * Resize drawable contents.
         */
        layoutDrawableContents: function () {
            var s = this,
                w = s.elm.offsetWidth,
                h = s.elm.offsetHeight;

            var bounds = {
                width: w,
                height: h,
                left: w / 2,
                top: h / 2,
                originX: 'center',
                originY: 'center'
            };

            var baseOffset = u.offsetSum(s.elm);
            s.getObjects().forEach(function (object) {
                if (object.layoutDrawableContents) {
                    var offset = u.offsetSum(object.elm);
                    object.set({
                        top: offset.top - baseOffset.top,
                        left: offset.left - baseOffset.left
                    })
                    object.layoutDrawableContents();
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
            objects = [].concat(objects).forEach(function (object) {
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
                    fontSize: u.extractNumber(style.fontSize),
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
                    .filter(Drawable._filters.textNodeFileter)
                    .map(Drawable._maps.nodeValueMap)
                    .join('');
            },
            _filters: {
                elementFilter: function (elm) {
                    return elm.nodeType === 1;
                },
                textNodeFileter: function (node) {
                    return node.nodeType === 3;
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