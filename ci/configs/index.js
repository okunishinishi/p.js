/**
 * @file CI configuration.
 * @module parari.js/ci/configs
 */

"use strict";

module.exports = {
    
    get bowerConfig() { return require('./bower_config'); },
    get budConfig() { return require('./bud_config'); },
    get chmodConfig() { return require('./chmod_config'); },
    get cpConfig() { return require('./cp_config'); },
    get ghPagesConfig() { return require('./gh_pages_config'); },
    get indexConfig() { return require('./index_config'); },
    get jsdocConfig() { return require('./jsdoc_config'); },
    get minifyConfig() { return require('./minify_config'); },
    get mkdirConfig() { return require('./mkdir_config'); },
    get mochaConfig() { return require('./mocha_config'); },
    get nodeunitConfig() { return require('./nodeunit_config'); },
    get testScaffoldConfig() { return require('./test_scaffold_config'); }
};