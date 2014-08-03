/**
 * Decode html.
 * @memberof module:parari/lib/commands
 * @function _decodeHtml
 * @param {string} html - Html string to decode.
 * @param {string} - Decoded string.
 * @private
 * @author Taka Okunishi
 */

"use strict";

var Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities();

/** @lends _decodeHtml */
module.exports = entities.decode.bind(entities);