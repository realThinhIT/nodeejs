var db          = require('../core/db').getConnection(),
    populate    = require('../modules/populate')[populate];

// ########################################
// POPULATE DATA AND VALIDATION
//
// - call from the controllers by:
//      var example = new _example(data);
// - validate the input by:
//      if (example.validate()) {}
// ########################################
var _data = {};

var _example = function (data) {
    _data = data;

    _example.populate();
};

// Data population on _data (default values)
_example.populate = function () {
    var defaultValues = {

    };

    data = populate(data, defaultValues);
};

// Data validation logic on _data
_example.validate = function () {

};

// ########################################
// CUSTOM FUNCTIONS GOES HERE
// ########################################


module.exports = _example;
