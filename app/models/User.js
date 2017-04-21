// ######################################################
// MODEL: User
// ######################################################

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {PValidator} from '../modules/nodee';
import TableCounter from './TableCounter';
import {Const} from '../config';
import md5 from 'md5';

// ################################

// model configurations
let modelName   = 'User';
let timestamps  = true;

const USERGROUP_ADMIN   = 1;
const USERGROUP_MOD     = 2;
const USERGROUP_USER    = 3;
const USERGROUP_GUEST   = 4;

// define schema
const modelSchema = new Schema({
    userId: Number,
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
                    cb(PValidator.length(value, 6, 20));
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
                cb(PValidator.length(value, 6, 20));
            },
            message: 'password is allowed to be between 6 - 20 characters'
        }
    },
    usergroup: {
        type: Number,
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
    var _self = this;

    if (timestamps) {
        let currentDate = new Date();

        this.createdAt = currentDate;
        this.updatedAt = currentDate;
    }

    if (!this.usergroup) {
        this.usergroup = USERGROUP_USER;
    }

    if (!this.status) {
        this.status = Const.STATUS_ACTIVE;
    }

    this.password = md5(this.password);

    TableCounter.autoIncrement('userId', function (err, id) {
        _self.userId = id;

        next();
    });

    // next();
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