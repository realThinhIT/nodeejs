// ######################################################
// CONTROLLER: register
// ######################################################

var controller      = {};
var users           = global.model.users;

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'register';
controller.middlewares = [
    'api-key',
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.register = function (req, res, middleware) {
    var newUser = new users(req.body);

    newUser.validate(function (pass, msg, code, detail) {
        if (!pass) {
            return res.fail(msg, code, detail);
        }

        newUser.create(function (err, row) {
            if (err) {
                return res.fail('there was something wrong registering new user');
            }

            return res.success(row, 'user registered');
        });
    });
};

// ################################

module.exports = controller;
