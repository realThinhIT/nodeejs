// ############################################################################
// # API SERVER STARTER PACK FOR
// # NODEJS + EXPRESS + MONGOOSE
// #
// # Author: ThinhIT (thinhit.net)
// # Email:  thinhnd.ict@gmail.com
// # Github: https://github.com/realThinhIT/nodeejs
// ############################################################################

global.__DIR_BASE   = __dirname + '/';
global.__DIR_APP    = __dirname + '/app/';
global.__DIR_CORE   = global.__DIR_APP + 'node_modules/nodee/core/';

require('babel-node-modules')([
  'nodee',
  'nodee/nodee-model'
]);

require(__DIR_CORE + 'init');
