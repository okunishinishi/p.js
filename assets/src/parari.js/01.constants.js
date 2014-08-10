/**
 * Constants for parari.
 * @membrerof parari
 * @member constants
 */
(function (pr) {
    "use strict";

    var prefix = 'pr',
        prefixed = function (name) {
            return [prefix, name].join('-');
        }

    /**
     * @lends para.constants
     */
    var c = {
        PREFIX: prefix,
        classNames: {
            SRC: prefixed('src'),
            SCREEN: prefixed('screen'),
            SCREEN_CONTAINER: prefixed('screen-container'),
        }
    };

    pr.constants = c;


})(window.parari = window.parari || {});