/**
 * @file Test for slide.js.
 * Runs with node unit.
 */

"use strict";

var slide = require('./../../lib/commands/slide.js'),
    h = require('../_helper');

exports.setUp = function (done) {
    h.injector.inject(console, 'log', h.doNothing);
    h.injector.inject(console, 'error', h.doNothing);
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

exports['Default fils.'] = function (test) {
    test.ok(h.fs.existsSync(slide._defaultTmpl));
    test.ok(h.fs.existsSync(slide._baseCss));
    test.ok(h.fs.existsSync(slide._baseJs));
    test.done();
};

exports['Sectionize html.'] = function (test) {
    var sectionized = slide._sectionaize('<h1>foo</h1><p>bar</p><h2>baz</h2><ul><li>123</li></ul>')
    test.ok(sectionized);
    test.done();
};

exports['Data.'] = function (test) {
    slide._data(__filename, [
        h.resolveMockFile('mock_js.js')
    ], [
        h.resolveMockFile('mock_css.css')
    ], {}, function (err, data) {
        test.ifError(err);
        test.ok(data.src);
        test.ok(data.js);
        test.ok(data.css);
        test.ok(data.now);

        slide._data._fileData(null, h.doNothing, function (err) {
            test.ifError(err);
            test.done();
        });
    });
};

exports['_done.'] = function (test) {
    slide._done(function () {
        slide._done()(new Error('foo'));
        test.done();
    })(null);
};

exports['Slide.'] = function (test) {
    test.ok(slide);
    test.done();
};