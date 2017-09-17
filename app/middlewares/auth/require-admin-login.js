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
export default async (req, res, done) => {
    // insert middleware logic here
    let loginInfo;
    try {
        loginInfo = await AuthenticationHelper.getAuthorizationHeader(this.req);

        if (loginInfo.type !== 'bearer') {
            throw new Error();
        }
    } catch (e) {
        return this.send.fail(
            'invalid authentication type', 
            ErrorCode.http.BAD_REQUEST, 
            DetailCode.auth.INVALID_AUTH_TYPE
        );
    }

    let user;
    try {
        user = await (new LoginToken()).findUserByLoginToken(loginInfo.token);
    } catch (e) {
        return done(
            false, 
            'invalid access token, token has been disabled or token has expired', 
            ErrorCode.http.INVALID_CREDENTIALS, 
            e.code
        );
    }

    if (user.usergroup !== 1) {
        return done(
            false, 
            'you must be an admin to get access to this functionality', 
            ErrorCode.http.INVALID_CREDENTIALS, 
            DetailCode.auth.PERMISSION_DENIED
        );
    }

    return done(true, user, 200);
};