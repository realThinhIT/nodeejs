// ######################################################
// CONTROLLER: register
// ######################################################

let controller = {};
import {User, LoginToken} from '../../../models';
import {PMongooserr, PObject} from '../../../modules/nodee';

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

controller.register = (req, [res, pres], middleware) => {
    let newUser = new User(req.body);

    newUser.save((err, user) => {
        if (err) {
            return pres.fail('there was some errors in user registering', null, null, PMongooserr(err));
        }

        // return pres.success(user);

        // grant this user a new access token
        (new LoginToken()).saveNewToken(user.userId, req.headers['user-agent'], req.headers['X-Device-Id'], ( (req.body.rememberMe === 1) ? true : false ), (err, token) => {
            if (err || !token) return pres.fail('an error has occurred while granting access token', 500);

            // remove sensitive information
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
            }, 'user registered successfully');
        });
    });
};

// ################################

export default controller;
