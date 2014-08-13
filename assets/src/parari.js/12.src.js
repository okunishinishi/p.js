/**
 * Data source.
 * @memberof parari
 * @constructor Src
 * @param {HTMLElement} elm - Element which contains the slide data source.
 */
(function (pr, document) {
    "use strict";

    var u = pr.utilities,
        c = pr.constants;

    /** @lends Src */
    function Src(elm) {
        var s = this;
        s.loadElement(elm);
    };

    Src.prototype = {
        /**
         * Source element.
         */
        elm: null,
        /**
         * Load element.
         * @param {HTMLElement} elm - Element to load.
         */
        loadElement: function (elm) {
            var s = this;
            elm.classList.add(c.classNames.SRC);
            Src.wrapTextNodesRecursive(elm);
            s.elm = elm;
        },
        _findObjectElements: function () {
            var s = this,
                selector = c.FRAGMENT_SELECOTR,
                elements = s.elm.querySelectorAll(selector);
            return u.toArray(elements);
        },
        /**
         * Create fragments from src.
         * @param {object} properties - Fragment properties.
         * @returns {pr.Fragment[]}
         */
        createFragments: function (properties) {
            var s = this;
            return s._findObjectElements()
                .map(function (elm) {
                    return new pr.Fragment(elm,properties);
                });
        }
    }

    u.copy(
        /** @lends Src */
        {
            /**
             * Wrap all text nodes with span recursively.
             * @param {HTMLElement} elm - Element to work with.
             */
            wrapTextNodesRecursive: function (elm) {
                if (!elm) {
                    return;
                }
                var nodes = elm.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    if (u.isTextNode(node)) {
                        var wrapper = document.createElement('span');
                        wrapper.innerHTML = Src._convertTextNode(node);
                        node.parentNode.insertBefore(wrapper, node)
                        node.parentNode.removeChild(node);
                    }
                    if (u.isElementNode(node)) {
                        Src.wrapTextNodesRecursive(node);
                    }
                }
            },
            _convertTextNode: function (node) {
                var text = (node.nodeValue || ''),
                    onSpan = false,
                    result = '';
                for (var i = 0; i < text.length; i++) {
                    var isTrimmable = !!text[i].match(/[\s\n\t]/);
                    var shouldStartSpan = !isTrimmable && !onSpan;
                    if (shouldStartSpan) {
                        result += '<span>';
                        onSpan = true;
                    }
                    var shouldEndSpan = isTrimmable && onSpan;
                    if (shouldEndSpan) {
                        result += '</span>';
                        onSpan = false;
                    }
                    result += text[i];
                }
                if (onSpan) {
                    result += '</span>';
                }
                return result;
            },
        }
        , Src
    );

    pr.Src = Src;

})(window.parari = window.parari || {}, document);