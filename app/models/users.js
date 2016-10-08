// ######################################################
// # MODEL: Users
// ######################################################

var db          = global.app.db.getConnection(),
    crud        = global.app.crud,
    crudFunc    = global.app.crudFunc,
    log         = global.app.log,
    cb          = global.app.cb,
    md5         = require('md5'),
    validator   = require('../../core/modules/pvalidator');

// ################################

var model           = function (userData) {
    // ================================
    this.data       = {};

    // ################################
    // Model configurations
    // ################################
    this.collection        = 'users';
    this.defaultValues     = {
        username:   '',
        password:   '',
        email:      '',
        info:   {
            firstName:    '',
            lastName:     '',
        },
        socials: {
            facebookId: '',
            googleId:   '',
        },
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
        if (!this.data.username || this.data.username === '' || typeof(this.data.username) !== 'string') {
            return cb(callback)(false, 'username invalid', 400, 'INVALID_USERNAME');
        }

        if (this.data.username.length <= 4) {
            return cb(callback)(false, 'username too short', 400, 'SHORT_USERNAME');
        }

        if (!this.data.password || this.data.password === '' || typeof(this.data.password) !== 'string') {
            return cb(callback)(false, 'password invalid', 400, 'INVALID_PASSWORD');
        }

        if (this.data.password.length <= 6) {
            return cb(callback)(false, 'password too short', 400, 'SHORT_PASSWORD');
        }

        if (!this.data.email || this.data.email === '' || typeof(this.data.email) !== 'string' || !validator.email(this.data.email)) {
            return cb(callback)(false, 'email invalid', 400, 'INVALID_EMAIL');
        }

        cb(callback)(true, 'all tests successfully', 200);
        return this;
    };

    this.transform = function (callback) {
        // custom transformations before inserting goes here

        if (this.data.password) {
            this.data.password = md5(this.data.password);
        }

        cb(callback)(model);
        return this;
    };

    // ################################
    // CUSTOM FUNCTIONS GOES HERE
    // ################################


};

// ################################

module.exports = model;
