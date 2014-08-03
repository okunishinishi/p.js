/**
 * Generate a file.
 * @function _generateFile
 * @param {string} filename - File name to write.
 * @param {string} content - File content to write.
 * @param {function} callback - Callback when done.
 * @private
 */

"use strict";

var u = require('apeman-util'),
    path = u.core.path,
    mkdirp = u.ext.mkdirp,
    async = u.ext.async,
    file = u.file;

/** @lends _generateFile */
function _generateFile(filename, content, callback) {
    async.series([
        function (callback) {
            mkdirp(path.dirname(filename), callback);
        },
        function (callback) {
            file.writeReadonlyFile(filename, content, callback);
        },
        function (callback) {
            callback(null);
        }
    ], callback);
};

module.exports = _generateFile;