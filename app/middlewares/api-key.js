// ######################################################
// MIDDLEWARE: API KEY AUTHENTICATION
// ######################################################

var middleware = {};
var users = global.model.users;

// ################################
// MODIFY THIS!
// after finish verifying, send
// the done(isValidated, data, status, detailCode)
// to pass to the controller.
// ################################

// execute before controller
middleware.beforeAction = function (req, res, done) {
    // insert middleware logic here
    if (req.get('X-Api-Key') !== global.app.apiConfig.API_KEY) {
        done(false, 'invalid api key', 401, "INVALID_API_KEY");
    }

    done(true, {}, 200);
};

// ################################

module.exports = middleware;
