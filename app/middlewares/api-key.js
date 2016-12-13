// ######################################################
// MIDDLEWARE: API KEY AUTHENTICATION
// ######################################################

import $            from '../../core/$';
let middleware      = {};
const User          = $.model.User;

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = (req, res, done) => {
    // insert middleware logic here
    if (req.get('X-Api-Key') !== $.config.api.API_KEY) {
        return done(false, 'invalid api key', $.params.error.http.INVALID_CREDENTIALS, $.params.detail.auth.INVALID_API_KEY);
    }

    return done(true, {}, 200);
};

// ################################

export default middleware;
