// ######################################################
// CORE: INIT
// ######################################################

import {PLog, PCallback} from '../modules/nodee';
import {GlobalConfig} from '../config';

// clear the console
if (GlobalConfig.PLog_CLEAR_CONSOLE_ON_STARTUP) {
    PLog.clear();
}

PLog.put(GlobalConfig.APP_NAME.toUpperCase(), true);

// connect to database
require('./db').default.init((err) => {
    // run the server
    require('./express');
});
