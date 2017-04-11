// ######################################################
// CONTROLLER: login
// ######################################################

let controller      = {};
const User          = Nodee.model.User;
const LoginToken    = Nodee.model.LoginToken;
const obj           = Nodee.module.pobject;

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

controller.login = (req, [res, pres], middleware) => {
    // authentication headers
    authenticationService.getAuthorizationHeader(req, (err, login) => {
        if (err || login.type !== 'basic') return pres.fail('invalid authentication type', Nodee.param.error.http.BAD_REQUEST, Nodee.param.error.detail.INVALID_AUTH_TYPE);
        
        // validate user
        (new User()).findByUsernameAndPassword(login.username, login.password, (err, user) => {
            if (err) return pres.fail('an error has occurred while authenticating', Nodee.param.error.http.INTERNAL_SERVER_ERROR);

            if (!user) return pres.fail('user not found', Nodee.param.error.http.INVALID_CREDENTIALS, 'USER_NOT_FOUND');

            // grant this user a new access token
            (new LoginToken()).saveNewToken(user.userId, req.headers['user-agent'], req.headers['X-Device-Id'], ( (req.body.rememberMe === 1) ? true : false ), (err, token) => {
                if (err || !token) return pres.fail('an error has occurred while granting access token', Nodee.param.error.http.INTERNAL_SERVER_ERROR);

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

                return pres.success({
                    userInfo: user,
                    accessToken: token
                }, 'user authenticated');
            });
        });
    });
};

// ################################

export default controller;
