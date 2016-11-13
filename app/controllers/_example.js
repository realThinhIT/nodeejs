// ######################################################
// CONTROLLER: register
// ######################################################

var controller      = {};
var User            = global.model.User;
var mge             = global.app.monerr;

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
    return res.success(null, 'all functioning properly');
};

// ################################

module.exports = controller;
