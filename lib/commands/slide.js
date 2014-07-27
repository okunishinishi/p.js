/**
 * @file Slide comnad.
 * @memberof module:parari/lib/commands
 * @function slide
 * @param {string} src - Source file name.
 * @param {string} [dest] - Destination file name.
 * @param {object} options - Optional settings.
 * @param {string} options.css - Css file name to include.
 * @param {string} options.js - Javascript file name to include.
 * @parma {function} [callback] - Callback when done.
 * @author Taka Okunishi
 */

"use strict";

var u = require('apeman-util'),
    pkg = require('../../package'),
    marked = require('marked'),
    cheerio = require('cheerio'),
    path = u.core.path,
    fs = u.core.fs,
    util = u.core.util,
    async = u.ext.async,
    mkdirp = u.ext.mkdirp,
    filtering = u.filtering,
    file = u.file,
    object = u.object,
    minify = u.minify,
    _done = require('./_done'),
    pathname = u.pathname;

/** @lends slide */
function slide(src, dest, options, callback) {
    if (!dest) {
        dest = slide._defaultDest(src);
    }
    var js = (options.js || '').split(','),
        css = (options.css || '').split(','),
        theme = options.theme || 'rainbow',
        title = options.title || path.basename(src),
        tmpl = slide._defaultTmpl;
    async.waterfall([
        function (callback) {
            async.series([
                function (callback) {
                    u.rendering.loadHbsTmpl(tmpl, callback);
                },
                function (callback) {
                    slide._data(src, js, css, {
                        title: title,
                        theme: theme
                    }, callback);
                }
            ], callback);
        },
        function (data, callback) {
            var tmpl = data[0],
                content = tmpl(data[1]);
            async.series([
                function (callback) {
                    mkdirp(path.dirname(dest), callback);
                },
                function (callback) {
                    file.writeReadonlyFile(dest, content, callback);
                },
                function (callback) {
                    console.log('File generated:', dest);
                    callback(null);
                }
            ], callback);
        },
    ], _done(callback));
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

slide._data = function (src, js, css, data, callback) {
    async.waterfall([
        function (callback) {
            async.series([
                function (callback) {
                    async.waterfall([
                        function (callback) {
                            fs.readFile(src, callback);
                        },
                        function (content, callback) {
                            marked(content.toString(), {}, callback);
                        },
                        function (html, callback) {
                            html = slide._sectionaize(html);
                            callback(null, html);
                        },
                    ], callback);
                },
                function (callback) {
                    js = [].concat(slide._baseJs).concat(js).filter(filtering.duplicateRejectFilter())
                    async.concat(js, function (js, callback) {
                        var converter = minify.minifyJsString;
                        slide._data._fileData(js, converter, callback);
                    }, callback);
                },
                function (callback) {
                    css = [].concat(slide._baseCss).concat(css).filter(filtering.duplicateRejectFilter())
                    async.concat(css, function (css, callback) {
                        var converter = minify.minifyCssString;
                        slide._data._fileData(css, converter, callback);
                    }, callback);
                }
            ], callback);
        },
        function (fileData, callback) {
            var result = object.copy({
                src: fileData[0].toString(),
                js: fileData[1],
                css: fileData[2],
                now: new Date().toString()
            }, data || {});
            callback(null, result)
        }
    ], callback);
};

/**
 * Splide html into sections.
 * @param html
 * @returns {*}
 * @private
 */
slide._sectionaize = function (html) {
    var id = ['parari-working-div', new Date().getTime()].join('-');
    html = util.format('<div id="%s">%s</div>', id, html)
    var $ = cheerio.load(html);

    var sections = [
        []
    ];
    $('#' + id).children().toArray().map(function (elm) {
        var isHeader = slide._sectionaize._isHeader(elm);
        if (isHeader) {
            sections.push([]);
        }
        var html = $.html(elm);
        sections[sections.length - 1].push(html);
    });
    return sections
        .filter(function (section) {
            return section.length > 0;
        })
        .map(function (section) {
            return util.format('<section class="pr-page">%s</section>', section.join(''));
        }).join('');
};

slide._sectionaize._isHeader = function (elm) {
    switch (elm.name) {
        case 'h1':
        case 'h2':
        case 'h3':
            return true;
    }
    return false;
};


/**
 * Get file data.
 * @param {string} filename - Filen name.
 * @param {function} converter - Data converter.
 * @param {function} callback - Callback when done.
 * @private
 */
slide._data._fileData = function (filename, converter, callback) {
    if (!filename) {
        callback(null);
        return;
    }
    async.waterfall([
        function (callback) {
            fs.readFile(filename, callback);
        },
        function (content, callback) {
            async.waterfall([
                function (callback) {
                    converter(content.toString(), callback);
                },
                function (content, callback) {
                    callback(null, {
                        filename: path.basename(filename),
                        content: content
                    });
                }
            ], callback);
        }
    ], callback);
};

var basedir = path.resolve(__dirname, '../../');

/**
 * Default template path.
 */
slide._defaultTmpl = path.resolve(basedir, 'tmpl/hbs/slide.html.hbs');
/** Base css file. */
slide._baseCss = path.resolve(basedir, 'assets/parari.css');
/** Base js file. */
slide._baseJs = path.resolve(basedir, 'assets/parari.js');


slide._done = _done;

module.exports = slide;