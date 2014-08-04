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
    filtering = u.filtering,
    file = u.file,
    object = u.object,
    minify = u.minify,
    themes = require('../themes'),
    _done = require('./_done'),
    pathname = u.pathname,
    _decodeHtml = require('./_decode_html'),
    _generateFile = require('./_generate_file');

/** @lends slide */
function slide(src, dest, options, callback) {
    if (!dest) {
        dest = slide._defaultDest(src);
    }
    var js = (options.js || '').split(','),
        css = (options.css || '').split(','),
        theme = themes[options.theme || 'cosmic'],
        title = options.title || path.basename(src),
        tmpl = slide._defaultTmpl;

    if (!theme) {
        throw new Error('Unknown theme:' + options.theme);
        return;
    }

    async.waterfall([
        function (callback) {
            async.waterfall([
                function (callback) {
                    slide._data(src, js, css, {
                        title: title,
                        layers: slide._layerData(theme.layers)
                    }, callback);
                },
                function (data, callback) {
                    slide._render(tmpl, data, dest, callback);
                }
            ], callback);
        }
    ], _done(callback));
};

slide._render = function (tmpl, data, dest, callback) {
    async.waterfall([
        function (callback) {
            u.rendering.loadHbsTmpl(tmpl, callback);
        },
        function (tmpl, callback) {
            var content = tmpl(data);
            _generateFile(dest, content, callback);
        }
    ], callback);
};

slide._debug = false;
slide._debug = true;

slide._layerData = function (layers) {
    return Object.keys(layers).map(function (name) {
        var values = layers[name];
        return {
            name: name,
            options: [].concat(values).map(function (values) {
                return Object.keys(values).map(function (key) {
                    var val = values[key];
                    switch (typeof(val)) {
                        case 'number':
                            break;
                        case 'string':
                            val = '"' + val + '"';
                            break;
                        default:
                            val = JSON.stringify(val, null, 0);
                            break;
                    }
                    return {
                        key: key,
                        val: val
                    }
                })
            })
        }
    });
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
                            html = slide._html(html);
                            callback(null, html);
                        },
                    ], callback);
                },
                function (callback) {
                    var filenames = [].concat(slide._baseJs).concat(js),
                        converter = minify.minifyJsString;
                    slide._data._fileData._concat(filenames, converter, callback);
                },
                function (callback) {
                    var filenames = [].concat(slide._baseCss).concat(css),
                        converter = minify.minifyCssString;
                    slide._data._fileData._concat(filenames, converter, callback);
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
}
;

/**
 * Formt html.
 * @param html
 * @returns {*}
 * @private
 */
slide._html = function (html) {
    var id = ['parari-working-div', new Date().getTime()].join('-');
    html = util.format('<div id="%s">%s</div>', id, html)
    var $ = cheerio.load(html);

    var sections = [
        []
    ];
    $('#' + id).children().toArray().map(function (elm) {
        var isHeader = slide._html._isHeader(elm);
        if (isHeader) {
            sections.push([]);
        }
        $(elm).attr({
            'data-pr-object': true,
            'data-pr-speed': isHeader ? '0.5' : '0.8'
        });
        var html = $.html(elm);
        sections[sections.length - 1].push(html);
    });

    var pageHtml = '<section class="pr-page"><div class="pr-page-background" data-pr-z="-100"' +
        ' data-pr-object="true"></div>%s</section>';

    html = sections
        .filter(function (section) {
            return section.length > 0;
        })
        .map(function (section) {
            return util.format(pageHtml, section.join(''));
        }).join('');
    html = _decodeHtml(html);
    return  html;
};

slide._html._headerElmNames = 'h1,h2,h3'.split(',');
slide._html._isHeader = function (elm) {
    return slide._html._headerElmNames.indexOf(elm.name) !== -1;
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
    if (slide._debug) {
        converter = function (value, callback) {
            callback(null, value);
        }
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

/**
 * Concat file data.
 * @param {string} filenames
 * @param {function} converter - Data converter.
 * @param {function} callback - Callback when done.
 * @private
 */
slide._data._fileData._concat = function (filenames, converter, callback) {
    filenames = filenames.filter(filtering.duplicateRejectFilter());
    async.concat(filenames, function (filename, callback) {
        slide._data._fileData(filename, converter, callback);
    }, callback);
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