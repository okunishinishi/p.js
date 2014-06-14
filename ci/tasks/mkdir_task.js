#!/usr/bin/env node

/**
 * @file Generate directory names.
 * @module mkdirTask
 * @author Taka Okunishi
 */

"use strict";

var mkdirp = require('mkdirp'),
    fs = require('fs'),
    async = require('async');

module.exports = function (config, callback) {
    async.reject([].concat(config), fs.exists, function (dirnames) {
        async.eachSeries(
            dirnames,
            function (dirname, callback) {
                async.series([
                    function (callback) {
                        mkdirp(dirname, callback);
                    },
                    function (callback) {
                        console.log('Generate directory:', dirname);
                        callback();
                    }
                ], callback);
            },
            callback
        )
    });
};