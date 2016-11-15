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
    'api-key', 'auth/require-login'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.logout = function (req, res, middleware) {
    LoginToken.remove({
        userId: middleware['auth.require-login']._id,
        deviceId: req.headers['X-Device-Id'],
        userAgent: req.headers['user-agent']
    }, function (err) {
        if (err) return res.fail('an error has occurred while logging out', 500);

        return res.success('logged out successfully');
    });
};

// ################################

module.exports = controller;
