// ######################################################
// # MODEL: Users
// ######################################################

var db          = global.app.db.getConnection(),
    crud        = global.app.crud,
    crudFunc    = global.app.crudFunc,
    log         = global.app.log,
    cb          = global.app.cb;
    md5         = require('md5');

// ################################

var model           = function (userData) {
    // ================================
    this.data       = {};

    // ################################
    // Model configurations
    // ################################
    this.collection        = '_example';
    this.defaultValues     = {

    };

    // ################################
    // DEFAULT FUNCTIONS
    // ################################

    // Data population on _data (default values)
    this.populate = (new crudFunc(this, crud, db)).populate;
    this.populate(userData);

    // CRUD Operations
    this.create   = (new crudFunc(this, crud, db)).create;
    this.read     = (new crudFunc(this, crud, db)).read;
    this.update   = (new crudFunc(this, crud, db)).update;
    this.delete   = (new crudFunc(this, crud, db)).delete;

    // ################################
    // MODIFY THESE FUNCTIONS
    // ################################

    // Data validation logic on _data
    this.validate = function (callback) {
        // custom validations goes here

        cb(callback)(true, 'all tests successfully', 200);
        return this;
    };

    this.transform = function (callback) {
        // custom transformations before inserting goes here

        cb(callback)(model);
        return this;
    };

    // ################################
    // CUSTOM FUNCTIONS GOES HERE
    // ################################


};

// ################################

module.exports = model;
