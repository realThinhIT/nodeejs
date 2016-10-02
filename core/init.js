// clear the console
var globalConfig    = require('../config/global.js');
var log             = require('../modules/plog.js')();

if (globalConfig.LOG_CLEAR_CONSOLE_ON_STARTUP) {
    log.clear();
}

log.put(globalConfig.APP_NAME.toUpperCase() + '', true);
log.endl();

// connect to database
require('./db').init();

// run the server
require('./express');
