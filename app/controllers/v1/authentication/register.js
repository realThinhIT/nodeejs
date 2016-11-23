// ######################################################
// CONTROLLER: register
// ######################################################

let controller      = {};
const User            = global.model.User;
const LoginToken      = global.model.LoginToken;
const mge             = global.app.monerr;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'register';
controller.middlewares = [
    'api-key', 'authentication/register'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.register = (req, res, middleware) => {
    let newUser = new User(req.body);

    newUser.save((err, user) => {
        if (err) {
            return res.fail('there was some errors in user registering', null, null, mge(err));
        }

        // return res.success(user);

        // grant this user a new access token
        (new LoginToken()).saveNewToken(user._id, req.headers['user-agent'], req.headers['X-Device-Id'], ( (req.body.rememberMe === 1) ? true : false ), (err, token) => {
            if (err || !token) return res.fail('an error has occurred while granting access token', 500);

            // remove sensitive information
            obj.deleteKeys(user, ['_id', 'password', '__v', 'createdAt', 'updatedAt']);
            obj.deleteKeys(token, ['_id', 'userId', '__v', 'userAgent', 'createdAt', 'updatedAt']);

            return res.success({
                userInfo: user,
                accessToken: token
            }, 'user registered successfully');
        });
    });
};

// ################################

export default controller;
