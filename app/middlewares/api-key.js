// ######################################################
// MIDDLEWARE: API KEY AUTHENTICATION
// ######################################################

import Nodee from '../nodee';
const { GlobalConfig, ErrorCode, DetailCode } = Nodee.Config;

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

export default (req, res, done) => {
    // insert middleware logic here
    if (req.get('X-Api-Key') !== GlobalConfig.API_KEY) {
        return done(false, 'invalid api key', ErrorCode.http.INVALID_CREDENTIALS, DetailCode.auth.INVALID_API_KEY);
    }

    return done(true, {}, 200);
};