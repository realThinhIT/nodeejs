// ######################################################
// CONTROLLER: login
// ######################################################

import Nodee from '../../../nodee';
const { User, LoginToken } = Nodee.Models;
const { PObject, PMongooserr } = Nodee.Utils;
const { AuthenticationHelper } = Nodee.Helpers;
const { MiddlewareConfig, ErrorCode, DetailCode } = Nodee.Config;

export default class LoginController extends Nodee.Core.Controller {
    middlewares(action) {
        switch (action) {
            case 'login': 
                return ['api-key'];
            case 'logout':
                return [ MiddlewareConfig.auth.userLoginRequired ];
            case 'register':
                return ['api-key', 'auth/register'];
        }
    }

    async login() {
        // authentication headers
        let loginInfo;
        try {
            loginInfo = await AuthenticationHelper.getAuthorizationHeader(this.req);

            if (loginInfo.type !== 'basic') {
                throw new Error();
            }
        } catch (e) {
            return this.send.fail(
                'invalid authentication type', 
                ErrorCode.http.BAD_REQUEST, 
                DetailCode.auth.INVALID_AUTH_TYPE
            );
        }

        // validate user
        let user;
        try {
            user = await (new User()).findByUsernameAndPassword(loginInfo.username, loginInfo.password);
        } catch (e) {
            return this.send.fail(
                'an error has occurred while authenticating', 
                ErrorCode.http.INTERNAL_SERVER_ERROR
            );
        }

        if (!user) {
            return this.send.fail(
                'user not found',
                ErrorCode.http.INVALID_CREDENTIALS, 
                'USER_NOT_FOUND'
            );
        }

        // grant this user a new access token
        let token;
        try {
            token = await (new LoginToken()).saveNewToken(
                user.userId, 
                this.req.headers['user-agent'], 
                this.req.headers['X-Device-Id'], 
                ( (this.req.body.rememberMe === 1) ? true : false )
            );

            if (!token) {
                throw new Error();
            }
        } catch (e) {
            return this.send.fail(
                'an error has occurred while granting access token', 
                ErrorCode.http.INTERNAL_SERVER_ERROR
            );
        }

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

        return this.send.success({
            userInfo: user,
            accessToken: token
        }, 'user authenticated');
    }

    async logout() {
        try {
            await LoginToken.remove({
                userId: this.middleware['auth.require-login'].userId,
                deviceId: this.req.headers['X-Device-Id'],
                userAgent: this.req.headers['user-agent']
            });
        } catch (e) {
            return this.send.fail(
                'an error has occurred while logging out', 
                ErrorCode.http.INTERNAL_SERVER_ERROR
            );
        }
    
        return this.send.success('logged out successfully');
    }

    async register() {
        // create new user in database
        let newUser = new User(this.req.body);
        let user;

        try {
            user = await newUser.save();
        } catch (e) {
            return this.send.fail(
                'there was some errors in user registering', 
                ErrorCode.http.BAD_REQUEST, 
                null, 
                PMongooserr(e)
            );
        }

        // grant this user a new access token
        let token;
        try {
            token = await (new LoginToken()).saveNewToken(                
                user.userId, 
                this.req.headers['user-agent'], 
                this.req.headers['X-Device-Id'], 
                ( (this.req.body.rememberMe === 1) ? true : false )
            );

            if (!token) {
                throw new Error();
            }
        } catch (e) {
            return this.send.fail('an error has occurred while granting access token', 500);
        }

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

        return this.send.success({
            userInfo: user,
            accessToken: token
        }, 'user registered successfully');
    }
}