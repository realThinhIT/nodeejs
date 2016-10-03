var db          = require('../core/db').getConnection(),
    crud        = require('../core/crud-common.js');

// ########################################
// POPULATE DATA AND VALIDATION
//
// - call from the controllers by:
//      var example = new _example(data);
// - validate the input by:
//      if (example.validate()) {}
// ########################################

var _example        = function() {};
var d               = {};
d.data              = {};

// Model configurations
d.collection        = "_example";
d.defaultValues     = {

};

// IMPLEMENT THIS!
// Data validation logic on _data
_example.validate = function () {

};

// Data population on _data (default values)
_example.populate = function (data) {
    d.data = data;
    d.data = crud.set(this[d.collection], db, d).populate();
};

// CRUD Operations
_example.insert = function (callback) {
    return crud.set(this[d.collection], db, d).insert(callback);
};

_example.delete = function (callback) {

};

// ########################################
// CUSTOM FUNCTIONS GOES HERE
// ########################################


module.exports = _example;
