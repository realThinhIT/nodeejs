// ######################################################
// MIDDLEWARE: authentication/require-login
// ######################################################

import Nodee from '../../nodee';
const { LoginToken } = Nodee.Models;
const { ErrorCode, DetailCode } = Nodee.Config;
const { AuthenticationHelper } = Nodee.Helpers;

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
export default (req, res, done) => {
    // insert middleware logic here

    AuthenticationHelper.getAuthorizationHeader(req, (err, login) => {
        if (err || login.type !== 'bearer') return done(false, 'invalid authentication type', ErrorCode.http.BAD_REQUEST, DetailCode.auth.INVALID_AUTH_TYPE);

        let logIn = new LoginToken();

        return logIn.findUserByLoginToken(login.token, (err, isValidated, user) => {
            if (err || !user || !isValidated) return done(false, 'invalid access token, token has been disabled or token has expired', ErrorCode.http.INVALID_CREDENTIALS, DetailCode.auth.INVALID_ACCESS_TOKEN);

            if (user.usergroup !== 1) {
                return done(false, 'you must be an admin to get access to this functionality', ErrorCode.http.INVALID_CREDENTIALS, DetailCode.auth.INVALID_ACCESS_TOKEN);
            }

            return done(true, user, 200);
        });
    });
};