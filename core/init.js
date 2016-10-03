// clear the console
global.globalConfig = require('../config/global.js');
global.log          = require('../modules/plog.js')();

if (global.globalConfig.LOG_CLEAR_CONSOLE_ON_STARTUP) {
    log.clear();
}

log.put(global.globalConfig.APP_NAME.toUpperCase() + '', true);
log.endl();

// connect to database
global.db = require('./db');
global.db.init(function (err, db) {
    if (err) {
        global.log.putException(err);
    }

    // run the server
    require('./express');
});
