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
        var s = this;

        s.__proto__ = u.copy(Drawable.prototype, new f.Group([], {
            selectable: false,
            hasRotatingPoint: false,
        }));
        s.__isPrDrawable = true;

        s.loadElement(elm);


    };

    Drawable.prototype = {
        /**
         * Load html element.
         * @param {HTMLElement} elm - An element to load.
         */
        loadElement: function (elm) {
            var s = this,
                style = u.getComputedStyle(elm);
            s.addAll(
                [
                    Drawable.background(style),
                    Drawable.text(Drawable.textValue(elm), style),
                ]
                    .filter(Drawable._filters.emptyRejecter)
                    .concat(Drawable.children(elm))
            );
            if (elm.src) {
                f.Image.fromURL(elm.src, function (image) {
                    s.add(image);
                    s.layout();
                    u.triggerEvent(elm, 'pr-img-load');
                });
            }
            if (elm.href) {
                s._highlightable = true;
                s.onclick = function () {
                    elm.click();
                    return true;
                }
            }
            s.elm = elm;
        },
        /**
         * Layout drawable contents.
         */
        layout: function () {
            var s = this,
                w = s.elm.offsetWidth,
                h = s.elm.offsetHeight;
            s.set({
                width: w,
                height: h,
                originX: 'center',
                originY: 'center'
            });
            var bounds = {
                width: u.round(w),
                height: u.round(h),
                left: 0,
                top: 0,
            };
            var baseOffset = u.offsetSum(s.elm);
            s.getObjects().forEach(function (object) {
                var isDrawable = Drawable.isDrawable(object);
                if (isDrawable) {
                    var offset = u.offsetSum(object.elm);
                    object.set({
                        top: u.round(offset.top - baseOffset.top),
                        left: u.round(offset.left - baseOffset.left)
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
            rect.top = s.getTop();
            rect.left = s.getLeft();
            rect.width = w;
            rect.height = h;
            return rect;
        },
        /**
         * Handle an event.
         * @param {event} e - Event to handle.
         * @returns {boolean} - Consumed or not.
         */
        handleEvent: function (e) {
            var s = this;
            var child = s._hitChild(e);
            if (child) {
                return child.handleEvent(e);
            }
            var handler = 'on' + e.type;
            if (s[handler]) {
                return s[handler](e);
            }
            return false;
        },
        _hitChild: function (e) {
            var s = this,
                x = u.eventOffsetX(e) - s.getLeft(),
                y = u.eventOffsetY(e) - s.getTop(),
                children = s.getDrawableChildren();
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i],
                    hit = child.getFrame().contains(x, y);
                if (hit) {
                    return child;
                }
            }
            return null;
        },
        /**
         * Get drawable children.
         * @returns {Drawable[]} - Children.
         */
        getDrawableChildren: function () {
            var s = this;
            return s.getObjects().filter(Drawable.isDrawable);
        },
        /**
         * Handle mouse down event.
         * @param {Event} e - Mousedown event.
         */
        onmousedown: function (e) {
            var s = this;
            s.toggleHighlighted(true);
            return true;
        },
        /**
         * Handle mouse up event.
         * @param {Event} e - Mouseup event.
         */
        onmouseup: function (e) {
            var s = this;
            s.toggleHighlighted(false);
            return true;
        },
        /**
         * Toggle highlighted state.
         * @param {boolean} highlighted
         */
        toggleHighlighted: function (highlighted) {
            var s = this;
            if (s._highlightable) {
                var opacity = Drawable.getHighlightOpacity(highlighted);
                s.setOpacity(opacity);
            }
        },
        /**
         * Handle click event.
         * @param {Event} e - Click event.
         */
        onclick: function (e) {
            var s = this;
            s.toggleHighlighted(false);
            return true;
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
            },
            /**
             * Is drawable or not.
             * @param object
             * @returns {boolean} - Is a drawable or not.
             */
            isDrawable: function (object) {
                return !!(object && object.__isPrDrawable);
            },
            /**
             * Get highligted opacity
             * @param {boolean} highlighted - Highlighted or not.
             * @returns {number} - Highlight opacity.
             */
            getHighlightOpacity: function (highlighted) {
                return highlighted ? 0.75 : 1;
            }
        }, Drawable);


    pr.Drawable = Drawable;

})(
    window.parari = window.parari || {},
    window.fabric,
    document
);