// ######################################################
// CONTROLLER: register
// ######################################################

let controller      = {};
const User            = global.model.User;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'index';
controller.middlewares = [
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.homepage = (req, res, middleware) => {
    res.success(null, 'server is listening');
};

// ################################

export default controller;
