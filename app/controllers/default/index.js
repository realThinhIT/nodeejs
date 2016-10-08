// ######################################################
// CONTROLLER: register
// ######################################################

var controller      = {};
var users           = global.model.users;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'index';
controller.middlewares = [
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.homepage = function (req, res, middleware) {
    res.success(null, 'server is listening');
};

// ################################

module.exports = controller;
