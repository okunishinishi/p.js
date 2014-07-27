/**
 * @file Slide comnad.
 * @memberof module:parari/lib/commands
 * @function slide
 * @param {string} src - Source file name.
 * @param {string} [dest] - Destination file name.
 * @param {object} options - Optional settings.
 * @author Taka Okunishi
 */

"use strict";

var u = require('apeman-util'),
    pathname = u.pathname;

/** @lends slide */
function slide(src, dest) {
    if (!dest) {
    }
    console.log(arguments);
};

/**
 * Default destination file name.
 * @param {string} src - Source file name.
 * @private
 */
slide._defaultDest = function (src) {
    var filename = pathname.stripExt(src);
    return [filename, 'slide'].join('-') + '.html';
};

module.exports = slide;