// ######################################################
// CONTROLLER: register
// ######################################################

import $            from '../../core/$';
let controller      = {};
const User          = $.model.User;
const LoginToken    = $.model.LoginToken;
const mge           = $.module.mongooserr;

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
