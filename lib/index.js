/**
 * @file parari
 * @module parari/lib
 * @property commands {object} - {@link module:parari/lib/commands|commands module}.

 */

"use strict";

module.exports = {
    
    get commands() { return require('./commands'); }
};