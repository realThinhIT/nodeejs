// ######################################################
// # MODEL: Users
// ######################################################

var db          = global.app.db.getConnection(),
    crud        = global.app.crud,
    crudFunc    = global.app.crudFunc,
    log         = global.app.log,
    cb          = global.app.cb;

// ################################

var model           = {};
model.data          = {};

// Model configurations
model.collection        = 'users';
model.defaultValues     = {
    'username': '',
    'password': '',
    'email': '',
};

// ################################
// MODIFY THESE FUNCTIONS
// ################################

// IMPLEMENT THIS!
// Data validation logic on _data
model.validate = function (callback) {
    // custom validations goes here

    cb(callback)(true, 'all tests successfully');
    return model;
};

model.transform = function (callback) {
    // custom transformations goes here

    cb(callback)(model);
    return model;
};

// ################################

// Data population on _data (default values)
model.populate = function (data) {
    model.data = data;
    crud.set(model, db).populate(function (data) {
        model.data = data;
    });
};

// CRUD Operations
model.create = crudFunc.set(crud, model, db).create;
model.read = crudFunc.set(crud, model, db).read;
model.update = crudFunc.set(crud, model, db).update;
model.delete = crudFunc.set(crud, model, db).delete;

// ################################
// CUSTOM FUNCTIONS GOES HERE
// ################################


// ################################

module.exports = model;
