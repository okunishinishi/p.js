/**
 * Present not supported message.
 * @function presentNotSupported
 * @param {HTMLElement} - Root element
 */
(function (pr, document) {
    "use strict";

    /** @lends presentNotSupported */
    function presentNotSupported(root) {
        var lang = 'en';
        var div = presentNotSupported._createMessageDiv(lang);
        if (root.firstChild) {
            root.insertBefore(div, root.firstChild);
        } else {
            root.append(div);
        }
    }

    presentNotSupported._createMessageDiv = function (lang) {
        var div = document.createElement('div');
        div.className = pr.prefixed('message-div');
        div.innerHTML = presentNotSupported._msg[lang || 'en'];
        return div;
    };

    presentNotSupported._msg = {
        'en': [
            '<span class="pr-caution">&#9888;</span>Your browser is not supported!.',
            'Please try modern browser like <a href="https://www.google.com/intl/en/chrome/browser/"><i>chrome</i></a>.'
        ].join('<br />')
    };

    pr.presentNotSupported = presentNotSupported;
})(
    window.parari = window.parari || {},
    document);
