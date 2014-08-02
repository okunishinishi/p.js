/**
 * Decode html.
 * @function _decodeHtml
 * @param {string} html - Html string to decode.
 * @param {string} - Decoded string.
 * @author Taka Okunishi
 */


var Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities();

module.exports = entities.decode.bind(entities);