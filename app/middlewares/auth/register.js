// ######################################################
// MIDDLEWARE: authentication/register
// ######################################################

let middleware      = {};
const User          = global.model.User;

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
        return done(false, 'user registration info is empty', 400, 'INFO_EMPTY');
    }

    return done(true, {}, 200);
};

// ################################

export default middleware;