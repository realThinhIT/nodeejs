// ######################################################
// MIDDLEWARE:
// ######################################################

var middleware = {};
var users = global.model.users;

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = function (req, res, done) {
    // insert middleware logic here

    done(true, {}, 200);
};

// ################################

module.exports = middleware;
