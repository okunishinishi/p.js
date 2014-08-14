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
     * @lends constants
     */
    var c = {
        PREFIX: prefix,
        PREFIX_PATTERN: new RegExp("^" + prefix),
        classNames: {
            SRC: prefixed('src'),
            SCREEN: prefixed('screen'),
            SCREEN_CONTAINER: prefixed('screen-container'),
            FRAGMENT: prefixed('fragment'),
            ROOT: prefixed('root')
        },
        FRAGMENT_SELECOTR: '[data-' + prefixed('fragment') + ']'
    };

    pr.constants = c;


})(window.parari = window.parari || {});