// ######################################################
// MIDDLEWARE: authentication/require-login
// ######################################################

import $            from '../../../core/$';
let middleware      = {};
const User          = $.model.User;
const LoginToken    = $.model.LoginToken;

import authenticationService from '../../services/authentication';

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = (req, res, done) => {
    // insert middleware logic here

    authenticationService.getAuthorizationHeader(req, (err, login) => {
        if (err || login.type !== 'bearer') return done(false, 'invalid authentication type', $.param.error.http.BAD_REQUEST, $.param.detail.auth.INVALID_AUTH_TYPE);

        let logIn = new LoginToken();

        return logIn.findUserByLoginToken(login.token, (err, isValidated, user) => {
            if (err || !user || !isValidated) return done(false, 'invalid access token, token has been disabled or token has expired', $.param.error.http.INVALID_CREDENTIALS, $.param.detail.auth.INVALID_ACCESS_TOKEN);

            if (user.usergroup !== 'admin') {
                return done(false, 'you must be an admin to get access to this functionality', $.param.error.http.INVALID_CREDENTIALS, $.param.detail.auth.INVALID_ACCESS_TOKEN);
            }

            return done(true, user, 200);
        });
    });
};

// ################################

export default middleware;
