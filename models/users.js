var db          = global.db.getConnection(),
    crud        = require('../core/crud-common.js'),
    log         = global.log;

var model           = {};
model.data          = {};

// Model configurations
model.collection        = "users";
model.defaultValues     = {
    'username': '',
    'password': '',
    'email': '',
};

// IMPLEMENT THIS!
// Data validation logic on _data
model.validate = function () {
    return true;
};

// Data population on _data (default values)
model.populate = function (data) {
    model.data = data;
    model.data = crud.set(model, db).populate();
};

// CRUD Operations
model.insert = function (callback) {
    return crud.set(model, db).insert(callback);
};

model.delete = function (callback) {

};

// ########################################
// CUSTOM FUNCTIONS GOES HERE
// ########################################


module.exports = model;
