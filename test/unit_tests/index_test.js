/**
 * @file Test for index.js.
 * Runs with node unit.
 */

"use strict";

var lib = require('../../lib');

exports['Get properties.'] = function(test){
    test.ok(lib.commands);
    test.ok(lib.commands.slide);
    test.ok(lib.themes);
    test.ok(lib.themes.cosmic);
  test.done();
};