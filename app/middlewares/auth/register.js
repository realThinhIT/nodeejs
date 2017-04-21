// ######################################################
// MIDDLEWARE: authentication/register
// ######################################################

let middleware = {};
import {ErrorCode} from '../../config';

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = (req, res, done) => {
    // insert middleware logic here
    if (!req.body) {
        return done(false, 'user registration info is empty', ErrorCode.http.BAD_REQUEST, 'INFO_EMPTY');
    }

    return done(true, {}, 200);
};

// ################################

export default middleware;
