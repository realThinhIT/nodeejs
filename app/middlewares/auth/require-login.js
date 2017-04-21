// ######################################################
// MIDDLEWARE: authentication/require-login
// ######################################################

let middleware = {};
import {LoginToken} from '../../models';
import {ErrorCode, DetailCode} from '../../config';
import {AuthenticationService} from '../../services';

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = (req, res, done) => {
    // insert middleware logic here

    AuthenticationService.getAuthorizationHeader(req, (err, login) => {
        if (err || login.type !== 'bearer') return done(false, 'invalid authentication type', ErrorCode.http.BAD_REQUEST, DetailCode.auth.INVALID_AUTH_TYPE);

        let logIn = new LoginToken();

        return logIn.findUserByLoginToken(login.token, (err, isValidated, user) => {
            if (err || !user || !isValidated) return done(false, 'invalid access token, token has been disabled or token has expired', ErrorCode.http.INVALID_CREDENTIALS, DetailCode.auth.INVALID_ACCESS_TOKEN);

            return done(true, user, 200);
        });
    });
};

// ################################

export default middleware;
