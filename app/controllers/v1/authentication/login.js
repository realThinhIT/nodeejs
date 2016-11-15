// ######################################################
// CONTROLLER: login
// ######################################################

var controller      = {};
var User            = global.model.User;
var LoginToken      = global.model.LoginToken;
var mge             = global.app.monerr;

var authenticationService = require('../../../services/authentication');

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'login';
controller.middlewares = [
    'api-key'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.login = function (req, res, middleware) {
    var loginIn = new User();

    // authentication headers
    authenticationService.getAuthorizationHeader(req, function (err, login) {
        if (err || login.type !== 'basic') return res.fail('invalid authentication type', 400, 'INVALID_AUTH_TYPE');

        // validate user
        loginIn.findByUsernameAndPassword(login.username, login.password, function (err, user) {
            if (err) return res.fail('an error has occurred while authenticating', 500);

            if (!user) return res.fail('user not found', 401, 'USER_NOT_FOUND');

            // grant this user a new access token
            (new LoginToken()).saveNewToken(user._id, req.headers['user-agent'], req.headers['X-Device-Id'], ( (req.body.rememberMe === 1) ? true : false ), function (err, token) {
                if (err || !token) return res.fail('an error has occurred while granting access token', 500);

                // remove sensitive information
                user._id = user.__v = user.password = undefined;
                token._id = token.userId = token.__v = token.userAgent = undefined;
                user.createdAt = user.updatedAt = token.createdAt = token.updatedAt = undefined;

                return res.success({
                    userInfo: user,
                    accessToken: token
                }, 'user authenticated');
            });
        });
    });
};

// ################################

module.exports = controller;
