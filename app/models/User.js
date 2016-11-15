// ######################################################
// MODEL: user
// ######################################################

var mongoose    = global.app.mongoose,
    Schema      = mongoose.Schema,
    md5         = require('md5'),
    validator   = require('../../core/modules/pvalidator');

// ################################

// model configurations
var modelName   = 'User';
var timestamps  = true;

// define schema
var modelSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,

        validate: [
            {
                validator: function (value, cb) {
                    this.model(modelName).count({ username: this.username }, function (err, count) {
                        if (err) {
                            return cb(err);
                        }

                        return cb(!count);
                    });
                },
                message: 'username is duplicated'
            },
            {
                validator: function (value, cb) {
                    cb(validator.length(value, 6, 20));
                },
                message: 'username is allowed to be between 6 - 20 characters'
            }
        ]
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        validate: {
            validator: function (value, cb) {
                cb(validator.length(value, 6, 20));
            },
            message: 'password is allowed to be between 6 - 20 characters'
        }
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        validate: {
            validator: function (value, cb) {
                cb(validator.email(value));
            },
            message: 'email is invalid'
        }
    },
    name: String,
    socialIds: {
        facebook: String,
        googlePlus: String
    },
    createdAt: Date,
    updatedAt: Date,
});

// ################################
// PRE-EXECUTIONS
// ################################
modelSchema.pre('save', function (next) {
    if (timestamps) {
        var currentDate = new Date();

        this.createdAt = currentDate;
        this.updatedAt = currentDate;
    }

    this.password = md5(this.password);

    next();
});

modelSchema.pre('update', function (next) {
    if (timestamps) {
        this.updatedAt = new Date();
    }

    next();
});

modelSchema.pre('find', function (next) {

    next();
});

modelSchema.pre('delete', function (next) {

    next();
});

// ################################
// POST-EXECUTIONS
// ################################
modelSchema.post('save', function () {

});

modelSchema.post('update', function () {

});

modelSchema.post('find', function () {

});

modelSchema.post('delete', function () {

});

// ################################
// CUSTOM METHODS
// ################################
modelSchema.methods.findByUsernameAndPassword = function (username, password, callback) {
    if (!username || !password) {
        return callback(Error('username or password is not defined'));
    }

    this.model(modelName).findOne({ username: username, password: md5(password) }, function (err, user) {
        callback(err, user);
    });
};

// ################################

var model = mongoose.model(modelName, modelSchema);
module.exports = model;
