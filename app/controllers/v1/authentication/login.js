// ######################################################
// CONTROLLER: login
// ######################################################

let controller = {};
import {User, LoginToken} from '../../../models';
import {PObject} from '../../../modules/nodee';
import {AuthenticationService} from '../../../services';
import {ErrorCode, DetailCode} from '../../../config';

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
    AuthenticationService.getAuthorizationHeader(req, (err, login) => {
        if (err || login.type !== 'basic') return pres.fail('invalid authentication type', ErrorCode.http.BAD_REQUEST, DetailCode.INVALID_AUTH_TYPE);
        
        // validate user
        (new User()).findByUsernameAndPassword(login.username, login.password, (err, user) => {
            if (err) return pres.fail('an error has occurred while authenticating', ErrorCode.http.INTERNAL_SERVER_ERROR);

            if (!user) return pres.fail('user not found', ErrorCode.http.INVALID_CREDENTIALS, 'USER_NOT_FOUND');

            // grant this user a new access token
            (new LoginToken()).saveNewToken(user.userId, req.headers['user-agent'], req.headers['X-Device-Id'], ( (req.body.rememberMe === 1) ? true : false ), (err, token) => {
                if (err || !token) return pres.fail('an error has occurred while granting access token', ErrorCode.http.INTERNAL_SERVER_ERROR);

                user = PObject.selectKeys(user, [
                    'userId',
                    'username',
                    'email',
                    'name',
                    'socialIds',
                    'usergroup'
                ]);

                token = PObject.selectKeys(token, [
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
