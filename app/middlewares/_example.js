// ######################################################
// MIDDLEWARE:
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

    return done(true, {}, 200);
};

// ################################

module.exports = middleware;
