// ######################################################
// MIDDLEWARE: API KEY AUTHENTICATION
// ######################################################

import Nodee from '../Nodee';
let middleware = {};
const User = Nodee.model.User;

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = (req, res, done) => {
    // insert middleware logic here
    if (req.get('X-Api-Key') !== Nodee.config.api.API_KEY) {
        return done(false, 'invalid api key', Nodee.param.error.http.INVALID_CREDENTIALS, Nodee.param.detail.auth.INVALID_API_KEY);
    }

    return done(true, {}, 200);
};

// ################################

export default middleware;
