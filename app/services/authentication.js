module.exports = {
    getAuthorizationHeader: function (req, callback) {
        var authorization = (req.headers.authorization) ? req.headers.authorization : ' ';

        var parts = authorization.split(' '),
            authorizationType    = parts[0].toLowerCase(),
            authorizationContent = parts[1];

        if (authorizationType === 'basic') {
            if (authorizationContent) {
                authorizationContent = Buffer.from(authorizationContent, 'base64').toString('ascii');
            } else {
                authorizationContent = ':';
            }
            authorizationContent = authorizationContent.split(':');

            var username = authorizationContent[0],
                password = authorizationContent[1];

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
