/**
 * @file parari
 * @module parari/lib/themes
 * @property cosmic {object} - {@link module:parari/lib/themes/cosmic|cosmic module}.
 * @property fancy {object} - {@link module:parari/lib/themes/fancy|fancy module}.

 */

"use strict";

module.exports = {
    
    get cosmic() { return require('./cosmic'); },
    get fancy() { return require('./fancy'); }
};