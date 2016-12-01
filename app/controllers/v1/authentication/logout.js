// ######################################################
// CONTROLLER: login
// ######################################################

let controller      = {};
const User            = global.model.User;
const LoginToken      = global.model.LoginToken;
const mge             = global.app.monerr;

import authenticationService from '../../../services/authentication';

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'login';
controller.middlewares = [
    global.middlewares.auth.userLoginRequired
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.logout = (req, res, middleware) => {
    LoginToken.remove({
        userId: middleware['auth.require-login']._id,
        deviceId: req.headers['X-Device-Id'],
        userAgent: req.headers['user-agent']
    }, err => {
        if (err) return res.fail('an error has occurred while logging out', global.errorCodes.http.INTERNAL_SERVER_ERROR);

        return res.success('logged out successfully');
    });
};

// ################################

export default controller;
