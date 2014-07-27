/**
 * @file Convenience functions for test.
 */

"use strict";

var u = require('apeman-util'),
    TestHelper = u.testing.TestHelper,
    path = u.core.path;

var basedir = path.resolve(__dirname, '..');

var h = new TestHelper({
    mockDir: path.resolve(basedir, 'test/mocks'),
    workDir: path.resolve(basedir, 'test/.work')
});
h.test = require('assert');
h.path = require('path');

module.exports = h;





