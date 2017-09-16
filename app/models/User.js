// ######################################################
// MODEL: User
// ######################################################

import { NodeeModel } from '../nodee';
import mongoose from 'mongoose';
import md5 from 'md5';
import TableCounter from './TableCounter';
const Schema = mongoose.Schema;

const { PValidator } = NodeeModel.Utils;
const { Const } = NodeeModel.Config;
const { Exception } = NodeeModel.Core;

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
                validator: value => {
                    return new Promise((resolve, reject) => {
                        _model.model(modelName).count({ username: _model.username }, (err, count) => {
                            if (err) {
                                reject(err);
                            }
    
                            resolve(!count);
                        });
                    });
                },
                message: 'username is duplicated'
            },
            {
                validator: value => {
                    return PValidator.length(value, 6, 20);
                },
                message: 'username is allowed to be between 6 - 20 characters'
            }
        ]
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        validate: {
            validator: value => {
                return PValidator.length(value, 6, 20);
            },
            message: 'password is allowed to be between 6 - 20 characters'
        }
    },
    usergroup: {
        type: Number,
        validate: {
            validator: value => {
                if (value != USERGROUP_ADMIN && value != USERGROUP_MOD && value != USERGROUP_USER && value != USERGROUP_GUEST) {
                    return false;
                } else {
                    return true;
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
modelSchema.pre('save', async function (next) {
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

    this.userId = await TableCounter.autoIncrement('userId');

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
modelSchema.methods.findByUsernameAndPassword = async function (username, password) {
    return new Promise((resolve, reject) => {
        if (!username || !password) {
            reject(new Exception('username or password is not defined', 'user_pass_not_defined'));
        }
    
        this.model(modelName).findOne({ username: username, password: md5(password) }, (err, user) => {
            if (err) {
                reject(new Exception(err, 'server_error'));
            }
    
            resolve(user);
        });
    });
};

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;