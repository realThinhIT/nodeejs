// ############################################################################
// # API SERVER STARTER PACK FOR
// # NODEJS + EXPRESS + MONGOOSE
// #
// # Author: ThinhIT (thinhit.net)
// # Email:  thinhnd.ict@gmail.com
// # Github: https://github.com/realThinhIT/es6-node-express-mongoose-rest-api
// ############################################################################

global.__DIR_BASE   = __dirname + '/';
global.__DIR_APP    = __dirname + '/app/';
global.__DIR_CORE   = __dirname + '/core/';

import Nodee from './app/Nodee';
global.Nodee = Nodee;

require('./core/init');
