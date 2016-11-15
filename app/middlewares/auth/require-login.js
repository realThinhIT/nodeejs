// ######################################################
// MIDDLEWARE: authentication/require-login
// ######################################################

var middleware = {};
var User = global.model.User;
var LoginToken = global.model.LoginToken;

var authenticationService = require('../../services/authentication');

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = function (req, res, done) {
    // insert middleware logic here

    authenticationService.getAuthorizationHeader(req, function (err, login) {
        if (err || login.type !== 'bearer') return done(false, 'invalid authentication type', 400, 'INVALID_AUTH_TYPE');

        var logIn = new LoginToken();

        return logIn.findUserByLoginToken(login.token, function (err, isValidated, user) {
            if (err || !user || !isValidated) return done(false, 'invalid access token or token has expired', 401, 'INVALID_ACCESS_TOKEN');

            return done(true, user, 200);
        });
    });
};

// ################################

module.exports = middleware;
