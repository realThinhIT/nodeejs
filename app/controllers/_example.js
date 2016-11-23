// ######################################################
// CONTROLLER: register
// ######################################################

let controller      = {};
const User            = global.model.User;
const LoginToken      = global.model.LoginToken;
const mge             = global.app.monerr;

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

controller.index = (req, res, middleware) => {
    // insert controller logic here

    res.success(null, 'all functioning properly');
};

// ################################

export default controller;
