// ######################################################
// MODEL: user
// ######################################################

let mongoose        = global.app.mongoose;
let Schema          = mongoose.Schema;
import md5          from 'md5';
import validator    from '../../core/modules/pvalidator';

// ################################

// model configurations
let modelName   = 'User';
let timestamps  = true;

const USERGROUP_ADMIN   = 'admin';
const USERGROUP_MOD     = 'moderator';
const USERGROUP_USER    = 'user';
const USERGROUP_GUEST   = 'guest';

// define schema
const modelSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,

        validate: [
            {
                validator: (value, cb) => {
                    _model.model(modelName).count({ username: _model.username }, (err, count) => {
                        if (err) {
                            return cb(err);
                        }

                        return cb(!count);
                    });
                },
                message: 'username is duplicated'
            },
            {
                validator: (value, cb) => {
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
            validator: (value, cb) => {
                cb(validator.length(value, 6, 20));
            },
            message: 'password is allowed to be between 6 - 20 characters'
        }
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        validate: {
            validator: (value, cb) => {
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
    usergroup: {
        type: String,
        validate: {
            validator: (value, cb) => {
                if (value != USERGROUP_ADMIN && value != USERGROUP_MOD && value != USERGROUP_USER && value != USERGROUP_GUEST) {
                    cb(false);
                } else {
                    cb(true);
                }
            },
            message: 'usergroup is invalid'
        }
    },

    status: Number,
    createdAt: Date,
    updatedAt: Date,
}, {
    collection: modelName,
    safe: true
});

// ################################
// PRE-EXECUTIONS
// ################################
modelSchema.pre('save', function (next) {
    if (timestamps) {
        let currentDate = new Date();

        this.createdAt = currentDate;
        this.updatedAt = currentDate;
    }

    if (!this.usergroup) {
        this.usergroup = USERGROUP_USER;
    }

    if (!this.status) {
        this.status = global.consts.STATUS_ACTIVE;
    }

    this.password = md5(this.password);

    next();
});

modelSchema.pre('update', function (next) {
    if (timestamps) {
        _model.updatedAt = new Date();
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

    this.model(modelName).findOne({ username: username, password: md5(password) }, (err, user) => {
        callback(err, user);
    });
};

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;