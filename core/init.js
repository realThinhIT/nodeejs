// ######################################################
// CORE: INIT
// ######################################################
/*eslint no-unused-vars: ["error", { "args": "none" }]*/

import dbConfig     from '../app/config/database';
import glob         from 'glob';
import path         from 'path';
const log           = Nodee.module.plog;

// clear the console
if (Nodee.config.global.LOG_CLEAR_CONSOLE_ON_STARTUP) {
    log.clear();
}

log.put(Nodee.config.global.APP_NAME.toUpperCase() + '', true);

// connect to database
Nodee.db = require('./db').default;
Nodee.db.init((err) => {
    // load the models
    if (dbConfig.autoImportModels === true) {
        log.put('[model] model auto loading is enabled');

        glob.sync('./app/models/*.js').forEach(file => {
            const modelName = path.basename(file, '.js');

            if (modelName !== '_example') {
                log.put('[model] loading model: ' + modelName);

                Nodee.model[modelName] = require('../app/models/' + modelName).default;
            }
        });
    } else {
        log.put('[model] model auto loading is disabled');
    }

    // run the server
    require('./express');
});
