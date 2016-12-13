// ######################################################
// CONTROLLER: register
// ######################################################

import $            from '../../../../core/$';
let controller      = {};
const User          = $.model.User;
const LoginToken    = $.model.LoginToken;
const mge           = $.module.monerr;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'register';
controller.middlewares = [
    'api-key', 'auth/require-admin-login', 'pagination'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.readAll = (req, res, middleware) => {
    // insert controller logic here

    User.count(middleware.pagination.search(['username']), function (err, count) {
        User.find(middleware.pagination.search(['username']), null, middleware.pagination.select, function (err, data) {
            res.success(data, 'users retrieved successfully', null, null, {
                totalItems: count
            });
        });
    });
};

// ################################

export default controller;
