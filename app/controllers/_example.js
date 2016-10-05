// ######################################################
// CONTROLLER: register
// ######################################################

var controller      = {};
var users           = global.model.users;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'register';
controller.middlewares = [
    'api-key'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.index = function (req, res, middleware) {
    res.success(null, 'all functioning properly');
};

// ################################

module.exports = controller;
