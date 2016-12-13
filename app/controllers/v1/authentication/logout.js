// ######################################################
// CONTROLLER: login
// ######################################################

import $            from '../../../../core/$';
let controller      = {};
const User          = $.model.User;
const LoginToken    = $.model.LoginToken;
const mge           = $.module.monerr;

import authenticationService from '../../../services/authentication';

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'login';
controller.middlewares = [
    $.config.middleware.auth.userLoginRequired
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.logout = (req, res, middleware) => {
    LoginToken.remove({
        userId: middleware['auth.require-login'].userId,
        deviceId: req.headers['X-Device-Id'],
        userAgent: req.headers['user-agent']
    }, err => {
        if (err) return res.fail('an error has occurred while logging out', $.params.error.http.INTERNAL_SERVER_ERROR);

        return res.success('logged out successfully');
    });
};

// ################################

export default controller;
