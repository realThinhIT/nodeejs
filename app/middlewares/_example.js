// ######################################################
// MIDDLEWARE:
// ######################################################

var middleware = {};
var User = global.model.user;

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = function (req, res, done) {
    // insert middleware logic here

    return done(true, {}, 200);
};

// ################################

module.exports = middleware;
