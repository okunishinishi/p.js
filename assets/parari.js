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
	 * @namespace para.utilities
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
	         * Create a new canvas.
	         * @param {string} id - Canvas element id.
	         * @param {number} width - Canvas width.
	         * @param {number} height - Canvas height.
	         * @returns {HTMLElement}
	         */
	        newCanvas: function (id, width, height) {
	            var canvas = document.createElement('canvas');
	            canvas.width = width;
	            canvas.height = height;
	            canvas.id = id;
	            return canvas;
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
	    };
	
	    pr.utilities = u;
	
	})(window.parari = window.parari || {}, document);
    
    /**
	 * Start para.
	 * @function start
	 */
	
	(function (pr, document) {
	    "use strict";
	
	    var u = pr.utilities;
	
	    pr.start = function (elm) {
	        elm = u.ensureElement(elm);
	        console.log(this, elm);
	    };
	
	})(window.parari = window.parari || {}, document);
    

    return parari;
})(window.parari = window.parari || {});



