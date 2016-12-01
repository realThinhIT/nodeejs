// ######################################################
// MIDDLEWARE: authentication/require-login
// ######################################################

let middleware      = {};
const User          = global.model.User;
const LoginToken    = global.model.LoginToken;

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
        if (err || login.type !== 'bearer') return done(false, 'invalid authentication type', global.errorCodes.http.BAD_REQUEST, global.detailCodes.auth.INVALID_AUTH_TYPE);

        let logIn = new LoginToken();

        return logIn.findUserByLoginToken(login.token, (err, isValidated, user) => {
            if (err || !user || !isValidated) return done(false, 'invalid access token, token has been disabled or token has expired', global.errorCodes.http.INVALID_CREDENTIALS, global.detailCodes.auth.INVALID_ACCESS_TOKEN);

            return done(true, user, 200);
        });
    });
};

// ################################

export default middleware;
