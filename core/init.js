// ######################################################
// CORE: INIT
// ######################################################

import $            from './$';
import glob         from 'glob';
import path         from 'path';

// clear the console
if ($.config.global.LOG_CLEAR_CONSOLE_ON_STARTUP) {
    $.module.plog.clear();
}

$.module.plog.put($.config.global.APP_NAME.toUpperCase() + '', true);

// connect to database
$.db = require('./db').default;
$.db.init((err, db) => {
    if (err) {
        $.module.plog.putException(err);
    }

    // load the models
    glob.sync('./app/models/*.js').forEach(file => {
        const modelName = path.basename(file, '.js');
        $.module.plog.put('[model] loading model: ' + modelName);

        $.model[modelName] = require('../app/models/' + modelName).default;
    });

    // run the server
    require('./express');
});
