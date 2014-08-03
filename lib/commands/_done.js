/**
 * @memberof module:parari/lib/commands
 * @function _done
 * @param {function} callback - Callback when done.
 * @private
 */

"use strict";

/** @lends _done */
module.exports = function _done(callback) {
    return function (err) {
        if (err) {
            console.error(err);
        }
        if (callback) {
            callback(err);
        }
    };
}
