export default {
    getAuthorizationHeader(req, callback) {
        let authorization = (req.headers.authorization) ? req.headers.authorization : ' ';

        let parts = authorization.split(' ');
        let authorizationType    = parts[0].toLowerCase();
        let authorizationContent = parts[1];

        if (authorizationType === 'basic') {
            if (authorizationContent) {
                authorizationContent = Buffer.from(authorizationContent, 'base64').toString('ascii');
            } else {
                authorizationContent = ':';
            }
            authorizationContent = authorizationContent.split(':');

            let username = authorizationContent[0];
            let password = authorizationContent[1];

            return callback(undefined, {
                type: 'basic',
                username: (username) ? username : '',
                password: (password) ? password : ''
            });
        } else if (authorizationType === 'bearer') {
            return callback(undefined, {
                type: 'bearer',
                token: (authorizationContent) ? authorizationContent : ''
            });
        } else {
            return callback(new Error('authorization type is invalid'));
        }
    }
};
