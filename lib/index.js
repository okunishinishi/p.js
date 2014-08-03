/**
 * @file parari
 * @module parari/lib
 * @property commands {object} - {@link module:parari/lib/commands|commands module}.
 * @property themes {object} - {@link module:parari/lib/themes|themes module}.

 */

"use strict";

module.exports = {
    
    get commands() { return require('./commands'); },
    get themes() { return require('./themes'); }
};