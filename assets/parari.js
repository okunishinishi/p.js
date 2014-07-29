/**
 * @file Generate parallax page from html.
 * @namespace parari
 * @version 0.0.0
 * @require fabric.js 
 * @require one-color.js 
 */
window.parari = (function (parari) {
    "use strict";
    
    /**
	 * Utilitis for parari.
	 * @membrerof para
	 * @namespace utilities
	 */
	(function (pr, document) {
	    "use strict";
	    var u = {
	        URL: window.URL || window.webkitURL || window.mozURL || window,
	        /**
	         * Create an object url.
	         * @returns {string} - Object url
	         */
	        createObjectURL: function () {
	            return u.URL.createObjectURL.apply(u.URL, arguments);
	        },
	        /**
	         * Revoke an object url.
	         * @returns {*}
	         */
	        revokeObjectURL: function () {
	            return u.URL.revokeObjectURL.apply(u.URL, arguments);
	        },
	        /**
	         * Device pixel ratio.
	         */
	        devicePixelRatio: window.devicePixelRatio,
	        /**
	         * Insert element
	         * @param {HTMLElement} newElement
	         * @param {HTMLElement} targetElement
	         */
	        insertAfter: function (newElement, targetElement) {
	            var parent = targetElement.parentNode;
	            var isLast = parent.lastchild == targetElement;
	            if (isLast) {
	                parent.appendChild(newElement);
	            } else {
	                parent.insertBefore(newElement, targetElement.nextSibling);
	            }
	        },
	        /**
	         * Optimize canvas pixel rate.
	         * @param {HTMLElement} canvas
	         * @param ctx
	         */
	
	        optimizeCanvasRatio: function (canvas, ctx) {
	            var ratio = u.devicePixelRatio;
	            if (!ratio) {
	                return;
	            }
	            var w = canvas.width,
	                h = canvas.height;
	            canvas.style.width = w + 'px';
	            canvas.style.height = h + 'px';
	            canvas.width = w * ratio;
	            canvas.height = h * ratio;
	            ctx.scale(ratio, ratio);
	        },
	        /**
	         * Make sure that element is a HTML element.
	         * @param {HTMLElement|string} elm - Html element or element id.
	         * @returns {HTMLElement}
	         */
	        ensureElement: function (elm) {
	            if (typeof(elm) === 'string') {
	                return document.getElementById(elm);
	            }
	            return elm;
	        },
	        /**
	         * Convert an iteratable object to array.
	         * @param iteratable
	         * @returns {Array}
	         */
	        toArray: function (iteratable) {
	            return Array.prototype.slice.call(iteratable, 0);
	        },
	        /**
	         * Copy a object.
	         * @param {object} src - Object to copy from.
	         * @param {object} dest - Object to copy to.
	         * @returns {object} - Destination object.
	         */
	        copy: function (src, dest) {
	            for (var key in src) {
	                if (src.hasOwnProperty(key)) {
	                    dest[key] = src[key];
	                }
	            }
	            return dest;
	        },
	        /**
	         * Get css texts
	         * @returns {string} css string.
	         */
	        getDocumentStyleString: function () {
	            var result = '';
	            var styleSheets = document.styleSheets;
	            for (var i = 0; i < styleSheets.length; i++) {
	                var rules = styleSheets[i].cssRules;
	                for (var j = 0; j < rules.length; j++) {
	                    result += rules[j].cssText + ' ';
	                }
	            }
	            return result;
	        },
	        getStyleString: function (elm) {
	            var style = window.getComputedStyle(elm, ''),
	                result = '';
	            for (var i = 0, len = style.length; i < len; i++) {
	                var key = style[i],
	                    val = style.getPropertyValue(key);
	                result += [key, val].join(':') + ';';
	            }
	            return result;
	        },
	        /**
	         * Center point for a element.
	         * @param {HTMLElement} elm
	         * @returns {{x: *, y: *}}
	         */
	        centerPoint: function (elm) {
	            var w = elm.offsetWidth,
	                h = elm.offsetHeight;
	            return {
	                x: elm.offsetLeft + (w / 2),
	                y: elm.offsetTop + (h / 2)
	            };
	        },
	
	        /**
	         * Convert an html to a image.
	         * @param {string} html -  Html string.
	         * @param {number} width - Render width.
	         * @param {number} height - Render height.
	         * @param {function} callback - Callback when done.
	         */
	        htmlToImage: function (html, width, height, callback) {
	            console.log(html);
	            var svgString = [
	                        '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">',
	                    '<foreignObject width="100%" height="100%">',
	                        '<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%">' + html + '</div>',
	                    '</foreignObject>' ,
	                    '</svg>'
	                ].join(''),
	                svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'}),
	                src = u.createObjectURL(svg),
	                image = new Image();
	            image.onload = function () {
	                callback(image);
	            };
	            image.onerror = function (err) {
	                console.error(err.stack || err);
	                callback(null);
	            };
	            image.src = src;
	        }
	    };
	
	    pr.utilities = u;
	
	})(window.parari = window.parari || {}, document);
    
    /**
	 * Constants for parari.
	 * @membrerof para
	 * @namespace constants
	 */
	(function (pr) {
	    "use strict";
	
	    var u = pr.utilities;
	
	    /**
	     * @lends para.constants
	     */
	    var c = {
	        PREFIX: 'pr'
	    };
	
	    pr.constants = c;
	
	
	})(window.parari = window.parari || {});
    
    /**
	 * Append prefix.
	 * @membrerof para
	 * @function prefixed
	 */
	(function (pr) {
	    "use strict";
	
	    var u = pr.utilities,
	        c = pr.constants;
	
	    /** @lends prefixed */
	    function prefixed(value) {
	        return [c.PREFIX, value].join('-');
	    }
	
	    pr.prefixed = prefixed;
	
	
	})(window.parari = window.parari || {});
    
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
	    };
	
	    pr.Object = PrObject;
	
	})(window.parari = window.parari || {}, document);
    
    /**
	 * Create src element, which holds src markuped elements.
	 * @memberof parari
	 * @constructor Src
	 */
	(function (pr, document) {
	    "use strict";
	
	    var u = pr.utilities,
	        c = pr.constants;
	
	    /** @lends Src */
	    function Src(elm, style) {
	        var s = this;
	        s.style = style;
	        s.elm = elm;
	        s.elm.classList.add(Src._className);
	    }
	
	    Src.prototype = {
	        /**
	         * Find pr objects included in the src.
	         * @returns {*}
	         */
	        _findElements: function () {
	            var s = this,
	                selector = Src._objectSelector,
	                objects = s.elm.querySelectorAll(selector);
	            return u.toArray(objects);
	        },
	        /**
	         * Get parari objects.
	         * @param options
	         * @returns {*}
	         */
	        getObjects: function (options) {
	            var s = this;
	            return s._findElements().map(function (elm) {
	                var object = pr.Object.fromElement(elm, s.style);
	                u.copy(options || {}, object);
	                return object;
	            });
	        }
	    }
	
	    Src._objectSelector = '[data-' + pr.prefixed('object') + ']';
	    Src._className = pr.prefixed('src');
	
	    pr.Src = Src;
	
	})(window.parari = window.parari || {}, document);
    
    /**
	 * Screen element.
	 * @memberof parari
	 * @constructor Screen
	 */
	(function (pr, document) {
	    "use strict";
	
	    var u = pr.utilities;
	
	
	    /**
	     * @lends Screen
	     * @param {HTMLElement} canvas - Canvas element
	     */
	    function Screen(canvas) {
	        var s = this;
	        s.canvas = canvas;
	        s.objects = [];
	        s.canvas.classList.add(Screen._className);
	    };
	
	    Screen.prototype = {
	        /**
	         * Get canvas context.
	         * @returns {CanvasRenderingContext2D}
	         */
	        getContext: function () {
	            var s = this,
	                ctx = s._ctx;
	            if (!ctx) {
	                ctx = s._ctx = s.canvas.getContext('2d');
	                u.optimizeCanvasRatio(s.canvas, ctx);
	            }
	            return ctx;
	        },
	
	        /**
	         * Load objects.
	         * @param {para.Object[]} objects - Objects to load.
	         * @param {function} callback - Callback when done.
	         */
	        loadObjects: function (objects, callback) {
	            var s = this;
	            var queue = [].concat(objects);
	            var object = queue.shift();
	            if (!object) {
	                callback(s);
	                return;
	            }
	            object.load(function (object) {
	                var center = u.centerPoint(s.canvas);
	                object.dx = object.x - center.x;
	                object.dy = object.y - center.y;
	                s.objects.push(object);
	                s.loadObjects(queue, callback);
	            });
	        },
	
	        /**
	         * Draw screen.
	         */
	        draw: function (scrollX, scrollY) {
	            var s = this,
	                ctx = s.getContext();
	            ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);
	
	            for (var i = 0, len = s.objects.length; i < len; i++) {
	                s.objects[i].draw(ctx, scrollX, scrollY);
	            }
	        },
	
	        /**
	         * Set screen size.
	         * @param {number} w - Screen width.
	         * @param {number} h - Screen height.
	         */
	        size: function (w, h) {
	            var s = this;
	            s.canvas.width = w;
	            s.canvas.height = h;
	            u.optimizeCanvasRatio(s.canvas, s.getContext());
	        },
	        /**
	         * Element to tell the scroll position.
	         */
	        scroller: null,
	        /**
	         * Element to toll the sieze.
	         */
	        sizer: null,
	        /**
	         * Redraw screen with scroller position.
	         */
	        redraw: function () {
	            var s = this,
	                x = s.scroller.scrollLeft,
	                y = s.scroller.scrollTop;
	            s.draw(x, y);
	        },
	        /**
	         * Resize screen with sizer size.
	         */
	        resize: function () {
	            var s = this,
	                w = s.sizer.innerWidth,
	                h = s.sizer.innerHeight;
	            s.size(w, h);
	        }
	    };
	
	    Screen._className = pr.prefixed('screen');
	
	    pr.Screen = Screen;
	
	})(window.parari = window.parari || {}, document);
    
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
	
	        var style = u.getDocumentStyleString(),
	            src = new pr.Src(root),
	            objects = src.getObjects({
	                vLock: !!options.vLock,
	                hLock: !!options.hLock
	            }),
	            screen = new pr.Screen(canvas);
	
	        screen.scroller = options.scroller || document.body;
	        screen.sizer = options.sizer || window;
	
	
	        var redraw = screen.redraw.bind(screen),
	            resize = screen.resize.bind(screen);
	
	        window.addEventListener('scroll', redraw, false);
	        window.addEventListener('resize', resize, false);
	
	
	        screen.loadObjects(objects, function () {
	            resize();
	            redraw();
	        });
	
	
	        resize();
	        redraw();
	    };
	
	})(window.parari = window.parari || {}, document, window);
    

    return parari;
})(window.parari = window.parari || {});



