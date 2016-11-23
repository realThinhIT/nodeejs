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

// define schema
const modelSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,

        validate: [
            {
                validator: (value, cb) => {
                    this.model(modelName).count({ username: this.username }, (err, count) => {
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

    status: Number,
    createdAt: Date,
    updatedAt: Date,
});

// ################################
// PRE-EXECUTIONS
// ################################
modelSchema.pre('save', next => {
    if (timestamps) {
        let currentDate = new Date();

        _model.createdAt = currentDate;
        _model.updatedAt = currentDate;
    }

    this.password = md5(this.password);

    next();
});

modelSchema.pre('update', next => {
    if (timestamps) {
        _model.updatedAt = new Date();
    }

    next();
});

modelSchema.pre('find', next => {

    next();
});

modelSchema.pre('delete', next => {

    next();
});

// ################################
// POST-EXECUTIONS
// ################################
modelSchema.post('save', () => {

});

modelSchema.post('update', () => {

});

modelSchema.post('find', () => {

});

modelSchema.post('delete', () => {

});

// ################################
// CUSTOM METHODS
// ################################
modelSchema.methods.findByUsernameAndPassword = (username, password, callback) => {
    if (!username || !password) {
        return callback(Error('username or password is not defined'));
    }

    _model.findOne({ username: username, password: md5(password) }, (err, user) => {
        callback(err, user);
    });
};

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;