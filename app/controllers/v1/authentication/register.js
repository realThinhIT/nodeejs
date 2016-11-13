// ######################################################
// CONTROLLER: register
// ######################################################

var controller      = {};
var User            = global.model.User;
var mge             = global.app.monerr;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'register';
controller.middlewares = [
    'api-key', 'authentication/register'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.register = function (req, res, middleware) {
    var newUser = new User(req.body);

    newUser.save(function (err, user) {
        if (err) {
            return res.fail('there was some errors in user registering', null, null, mge(err));
        }

        return res.success(user);
    });
};

// ################################

module.exports = controller;
