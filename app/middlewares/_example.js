// ######################################################
// MIDDLEWARE: _example
// ######################################################

let middleware = {};
import {ErrorCode, DetailCode} from '../config';

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = (req, res, done) => {
    // insert middleware logic here

    return done(true, {}, 200);
};

// ################################

export default middleware;