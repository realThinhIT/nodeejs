var db          = global.db.getConnection(),
    crud        = require('../core/crud-common'),
    log         = global.log,
    cb          = require('../modules/pcallback');

var model           = {};
model.data          = {};

// Model configurations
model.collection        = "users";
model.defaultValues     = {
    'username': '',
    'password': '',
    'email': '',
};

// ########################################
// MODIFY THESE FUNCTIONS TO FIT YOUR APP
// ########################################

// IMPLEMENT THIS!
// Data validation logic on _data
model.validate = function (callback) {
    callback = cb(callback);
    // custom validations goes here

    callback(true, 'all tests successfully');
    return model;
};

model.transform = function (callback) {
    callback = cb(callback);
    // custom transformations goes here

    callback(model);
    return model;
};

// ########################################

// Data population on _data (default values)
model.populate = function (data) {
    model.data = data;
    crud.set(model, db).populate(function (newData) {
        model.data = newData;
    });
};

// CRUD Operations
model.create = function (callback) {
    return crud.set(model, db).insert(callback);
};

model.read = function (conditions, callback, multiple) {
    multiple = multiple || false;
    return crud.set(model, db).find(conditions, callback, multiple);
};

model.update = function (conditions, callback, multiple) {
    multiple = multiple || false;
    return crud.set(model, db).update(conditions, callback, multiple);
};

model.delete = function (conditions, callback, multiple) {
    multiple = multiple || false;
    return crud.set(model, db).delete(conditions, callback, multiple);
};

// ########################################
// CUSTOM FUNCTIONS GOES HERE
// ########################################


// ########################################

module.exports = model;
