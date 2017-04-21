// ######################################################
// CONTROLLER: logout
// ######################################################

let controller = {};
import {LoginToken} from '../../../models';
import {MiddlewareConfig, ErrorCode, DetailCode} from '../../../config';

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'logout';
controller.middlewares = [
    MiddlewareConfig.auth.userLoginRequired
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.logout = (req, [res, pres], middleware) => {
    LoginToken.remove({
        userId: middleware['auth.require-login'].userId,
        deviceId: req.headers['X-Device-Id'],
        userAgent: req.headers['user-agent']
    }, err => {
        if (err) return pres.fail('an error has occurred while logging out', ErrorCode.http.INTERNAL_SERVER_ERROR);

        return pres.success('logged out successfully');
    });
};

// ################################

export default controller;
