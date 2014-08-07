/**
 * Create a base 64 image.
 * @function _base64img
 * @param {string} src - Source file name.
 * @param {function} callback - Callback when done.
 * @private
 */
"use strict";

var u = require('apeman-util'),
    async = u.ext.async,
    fs = u.core.fs;

/** @lends _base64img */
module.exports = function _base64img(src, callback) {
    async.waterfall([
        function (callback) {
            fs.readFile(src, 'binary', callback);
        },
        function (data, callback) {
            var base64 = new Buffer(data, 'binary').toString('base64');
            callback(null, base64);
        }
    ], callback);
};