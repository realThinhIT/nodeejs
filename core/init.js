// ######################################################
// CORE: INIT
// ######################################################

// make global variables
global.app              = {}; // app namespace
global.model            = {}; // model namespace

import glob             from 'glob';
import path             from 'path';
import globalConfig     from '../config/global';
global.app.globalConfig = globalConfig;
import apiConfig        from '../config/api-config';
global.app.apiConfig    = apiConfig;
import log              from './modules/plog';
global.app.log          = log();
import cb               from './modules/pcallback';
global.app.cb           = cb;
import presponse        from './modules/presponse';
global.app.presponse    = presponse;
import monerr           from './modules/pmongooserr';
global.app.monerr       = monerr;
import pobj             from './modules/pobject';
global.app.pobj         = pobj;

// clear the console
if (global.app.globalConfig.LOG_CLEAR_CONSOLE_ON_STARTUP) {
    global.app.log.clear();
}

global.app.log.put(global.app.globalConfig.APP_NAME.toUpperCase() + '', true);

// connect to database
import mongoose         from 'mongoose';
global.app.mongoose     = mongoose;

global.app.db           = require('./db').default;
global.app.db.init((err, db) => {
    if (err) {
        global.app.log.putException(err);
    }

    // load the models
    glob.sync('./app/models/*.js').forEach(file => {
        const modelName = path.basename(file, '.js');
        global.app.log.put('[model] loading model: ' + modelName);

        global.model[modelName] = require('../app/models/' + modelName).default;
    });

    // run the server
    require('./express');
});
