// ######################################################
// CONTROLLER: login
// ######################################################

var controller      = {};
var User            = global.model.User;
var LoginToken      = global.model.LoginToken;
var mge             = global.app.monerr;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'register';
controller.middlewares = [
    'api-key'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.login = function (req, res, middleware) {
    var loginIn = new User();

    loginIn.findByUsernameAndPassword(req.body.username, req.body.password, function (err, user) {
        if (err) return res.fail('an error has occurred while authenticating', 500);

        if (!user) return res.fail('user not found', 401, 'USER_NOT_FOUND');

        (new LoginToken()).saveNewToken(user._id, req.headers['user-agent'], req.headers['X-Device-Id'], function (err, token) {
            if (err || !token) return res.fail('an error has occurred while granting access token', 500);

            return res.success({
                userInfo: user,
                accessToken: token
            }, 'user authenticated');
        });
    });
};

// ################################

module.exports = controller;
