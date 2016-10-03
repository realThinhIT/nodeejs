// ######################################################
// CONTROLLER: register
// ######################################################

var register        = {};
var users           = require('../../../models/users');

register.register = function (req, res) {
    users.populate({
        'username': 'thinh',
        'password': '4t2z6z6u',
    });

    users.insert();

    res.success(null, 'ok');
};

module.exports = register;
