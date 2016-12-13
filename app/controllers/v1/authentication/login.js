// ######################################################
// CONTROLLER: login
// ######################################################

import $            from '../../../../core/$';
let controller      = {};
const User          = $.model.User;
const LoginToken    = $.model.LoginToken;
const mge           = $.module.monerr;
const obj           = $.module.pobj;

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
        if (err || login.type !== 'basic') return res.fail('invalid authentication type', $.params.error.http.BAD_REQUEST, $.params.error.detail.INVALID_AUTH_TYPE);
        
        // validate user
        (new User()).findByUsernameAndPassword(login.username, login.password, (err, user) => {
            if (err) return res.fail('an error has occurred while authenticating', $.params.error.http.INTERNAL_SERVER_ERROR);

            if (!user) return res.fail('user not found', $.params.error.http.INVALID_CREDENTIALS, 'USER_NOT_FOUND');

            // grant this user a new access token
            (new LoginToken()).saveNewToken(user.userId, req.headers['user-agent'], req.headers['X-Device-Id'], ( (req.body.rememberMe === 1) ? true : false ), (err, token) => {
                if (err || !token) return res.fail('an error has occurred while granting access token', $.params.error.http.INTERNAL_SERVER_ERROR);

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
                }, 'user authenticated');
            });
        });
    });
};

// ################################

export default controller;
