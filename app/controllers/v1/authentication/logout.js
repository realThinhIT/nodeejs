// ######################################################
// CONTROLLER: logout
// ######################################################
;
let controller      = {};
const LoginToken    = Nodee.model.LoginToken;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'logout';
controller.middlewares = [
    Nodee.middleware.auth.userLoginRequired
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.logout = (req, res, pres, middleware) => {
    LoginToken.remove({
        userId: middleware['auth.require-login'].userId,
        deviceId: req.headers['X-Device-Id'],
        userAgent: req.headers['user-agent']
    }, err => {
        if (err) return pres.fail('an error has occurred while logging out', Nodee.param.error.http.INTERNAL_SERVER_ERROR);

        return pres.success('logged out successfully');
    });
};

// ################################

export default controller;
