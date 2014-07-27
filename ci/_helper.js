#!/usr/bin/env

/**
 * @file Helper for ci.
 */

"use strict";

var u = require('apeman-util'),
    TaskHelper = u.tasking.TaskHelper,
    async = u.ext.async,
    tasks = require('apeman-tasks');

var h = new TaskHelper(__dirname + '/..');
h.tasks = tasks;

h.generateFile = function (filename, content, callback) {
    async.series([
        function (callback) {
            u.file.writeReadonlyFile(filename, content, callback);
        },
        function (callback) {
            console.log('File generated:', filename);
            callback(null);
        }
    ], callback);
}


module.exports = h;
