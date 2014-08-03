/**
 * @file Test for _generate_file.js.
 * Runs with node unit.
 */

"use strict";

var _generateFile = require('../../lib/commands/_generate_file'),
    h = require('../_helper');

exports['Generate a file.'] = function (test) {
    var filename = h.resolveWorkFile('work_generated.txt');
    _generateFile(filename, 'foo', function (err) {
        test.ifError(err);
        test.done();
    });
};