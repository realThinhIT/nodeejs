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
        if (err || login.type !== 'basic') return res.fail('invalid authentication type', global.errorCodes.http.BAD_REQUEST, 'INVALID_AUTH_TYPE');
        
        // validate user
        (new User()).findByUsernameAndPassword(login.username, login.password, (err, user) => {
            if (err) return res.fail('an error has occurred while authenticating', global.errorCodes.http.INTERNAL_SERVER_ERROR);

            if (!user) return res.fail('user not found', global.errorCodes.http.INVALID_CREDENTIALS, 'USER_NOT_FOUND');

            // grant this user a new access token
            (new LoginToken()).saveNewToken(user._id, req.headers['user-agent'], req.headers['X-Device-Id'], ( (req.body.rememberMe === 1) ? true : false ), (err, token) => {
                if (err || !token) return res.fail('an error has occurred while granting access token', global.errorCodes.http.INTERNAL_SERVER_ERROR);

                user = obj.selectKeys(user, [
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
