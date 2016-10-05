// ######################################################
// CORE: INIT
// ######################################################

// make global variables
global.app              = {}; // app namespace
global.model            = {}; // model namespace

global.app.globalConfig = require('../config/global');
global.app.apiConfig    = require('../config/api-config');
global.app.log          = require('./modules/plog')();
global.app.cb           = require('./modules/pcallback');
global.app.crud         = require('./crud/crud');
global.app.crudFunc     = require('./crud/crud-functions');
global.app.presponse    = require('./modules/presponse');

var glob                = require('glob'),
    path                = require('path');

// clear the console
if (global.app.globalConfig.LOG_CLEAR_CONSOLE_ON_STARTUP) {
    global.app.log.clear();
}

global.app.log.put(global.app.globalConfig.APP_NAME.toUpperCase() + '', true);
global.app.log.endl();

// connect to database
global.app.db = require('./db');
global.app.db.init(function (err, db) {
    if (err) {
        global.app.log.putException(err);
    }

    // load the models
    glob.sync('./app/models/*.js').forEach(function (file) {
        var modelName = path.basename(file, '.js');
        global.app.log.put('[model] loading model: ' + modelName);

        global.model[modelName] = require('../app/models/' + modelName);
    });

    // run the server
    require('./express');
});
