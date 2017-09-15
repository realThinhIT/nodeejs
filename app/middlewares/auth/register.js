// ######################################################
// MIDDLEWARE: authentication/register
// ######################################################

import Nodee from '../nodee';
const { ErrorCode } = Nodee.Config;

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
export default (req, res, done) => {
    // insert middleware logic here
    if (!req.body) {
        return done(false, 'user registration info is empty', ErrorCode.http.BAD_REQUEST, 'INFO_EMPTY');
    }

    return done(true, {}, 200);
};
