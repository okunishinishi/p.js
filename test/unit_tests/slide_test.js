/**
 * @file Test for slide.js.
 * Runs with node unit.
 */

"use strict";

var slide = require('./../../lib/commands/slide.js'),
    h = require('../_helper');

exports.setUp = function (done) {
    // h.injector.inject(console, 'log', h.doNothing);
    done();
};

exports.tearDown = function (done) {
    h.injector.restoreAllInjected();
    done();
};

exports['Default dest.'] = function (test) {
    test.equal(slide._defaultDest('foo.md'), 'foo-slide.html');
    test.done();
};

exports['Slide.'] = function (test) {
    test.ok(slide);
    test.done();
};