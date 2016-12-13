// ######################################################
// CONTROLLER: register
// ######################################################

import $            from '../../../core/$';
let controller      = {};
const User          = $.model.User;

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
