/**
 * Start para.
 * @function start
 */

(function (para, document) {
    "use strict";




    para.start = function (elm, options) {
        if (typeof(elm) === 'string') {
            elm = document.getElementById(elm);
        }


    };
})(window.para = window.para || {}, document);