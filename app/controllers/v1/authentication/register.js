// ######################################################
// CONTROLLER: register
// ######################################################

import $            from '../../../../core/$';
let controller      = {};
const User            = $.model.User;
const LoginToken      = $.model.LoginToken;
const mge             = $.module.monerr;
const obj             = $.module.pobj;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'register';
controller.middlewares = [
    'api-key', 'auth/register'
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
        (new LoginToken()).saveNewToken(user.userId, req.headers['user-agent'], req.headers['X-Device-Id'], ( (req.body.rememberMe === 1) ? true : false ), (err, token) => {
            if (err || !token) return res.fail('an error has occurred while granting access token', 500);

            // remove sensitive information
            user = obj.selectKeys(user, [
                'userId',
                'username',
                'email',
                'name',
                'socialIds',
                'usergroup'
            ]);

            token = obj.selectKeys(token, [
                'loginToken',
                'updatedAt',
                'expiredAt',
                'status'
            ]);

            return res.success({
                userInfo: user,
                accessToken: token
            }, 'user registered successfully');
        });
    });
};

// ################################

export default controller;
