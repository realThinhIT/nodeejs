// ######################################################
// CONTROLLER: login
// ######################################################

let controller      = {};
const User            = global.model.User;
const LoginToken      = global.model.LoginToken;
const mge             = global.app.monerr;
const obj             = global.app.pobj;

import authenticationService from '../../../services/authentication';

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

controller.login = (req, res, middleware) => {
    // authentication headers
    authenticationService.getAuthorizationHeader(req, (err, login) => {
        if (err || login.type !== 'basic') return res.fail('invalid authentication type', 400, 'INVALID_AUTH_TYPE');
        
        // validate user
        (new User()).findByUsernameAndPassword(login.username, login.password, (err, user) => {
            if (err) return res.fail('an error has occurred while authenticating', 500);

            if (!user) return res.fail('user not found', 401, 'USER_NOT_FOUND');

            // grant this user a new access token
            (new LoginToken()).saveNewToken(user._id, req.headers['user-agent'], req.headers['X-Device-Id'], ( (req.body.rememberMe === 1) ? true : false ), (err, token) => {
                if (err || !token) return res.fail('an error has occurred while granting access token', 500);

                // remove sensitive information
                obj.deleteKeys(user, ['_id', 'password', '__v', 'createdAt', 'updatedAt']);
                obj.deleteKeys(token, ['_id', 'userId', '__v', 'userAgent', 'createdAt', 'updatedAt']);

                return res.success({
                    userInfo: user,
                    accessToken: token
                }, 'user authenticated');
            });
        });
    });
};

// ################################

export default controller;
