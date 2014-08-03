/**
 * @file Test for slide.js.
 * Runs with node unit.
 */

"use strict";

var slide = require('./../../lib/commands/slide.js'),
    h = require('../_helper');

exports.setUp = function (done) {
//    h.injector.inject(console, 'log', h.doNothing);
    h.injector.inject(console, 'error', h.doNothing);
    done();
};

exports.tearDown = function (done) {
    h.injector.restoreAllInjected();
    done();
};

exports['Is header.'] = function (test) {
    test.ok(slide._html._isHeader({name: 'h1'}));
    test.ok(slide._html._isHeader({name: 'h2'}));
    test.ok(slide._html._isHeader({name: 'h3'}));
    test.ok(!slide._html._isHeader({name: 'span'}));
    test.done();
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

exports['Format html.'] = function (test) {
    var sectionized = slide._html('<h1>foo</h1><p>bar</p><h2>baz</h2><ul><li>123</li></ul>')
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

exports['Layer data.'] = function (test) {
    var data = slide._layerData({
        layers: {
            foo: 'bar',
            baz: 0,
            quz: [1, 2, 3]
        }
    });
    test.ok(data);
    test.done();
};

exports['Render.'] = function (test) {
    var tmpl = h.resolveMockFile('mock_tmpl.hbs');
    slide._render(tmpl, {}, h.resolveWorkFile('work_rendered.txt'), function (err) {
        test.ifError(err);
        test.done();
    });
};

exports['Invalid theme.'] = function (test) {
    test.throws(function () {
        slide(null, null, {theme: '__invalid_theme__'}, function (err) {

        });
    });
    test.done();
};