// ######################################################
// MODEL: LoginToken
// ######################################################

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import User from './User';

import {PRandom, PDate} from '../modules/nodee';
import {Const, GlobalConfig} from '../config';

// ################################

// model configurations
let modelName   = 'LoginToken';
let timestamps  = true;

// define schema
let modelSchema = new Schema({
    userId: Number,
    loginToken: {
        type: String,
        required: true,
        unique: true
    },
    expiredAt: {
        type: Date,
        required: true,
    },
    userAgent: String,
    deviceId: String,
    ip: String,

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

    if (!this.status) {
        this.status = Const.STATUS_ACTIVE;
    }

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
modelSchema.methods.findUserByLoginToken = function (loginToken, callback) {
    this.model(modelName).findOne({ loginToken: loginToken }, (err, token) => {
        if (err || !token) {
            return callback(err, false);
        }

        if (token.expiredAt < new Date()) {
            return callback(new Error('token has expired'), false);
        }

        if (token.status === Const.STATUS_DEACTIVATED) {
            return callback(new Error('token has been disabled'), false);
        }

        User.findOne({ userId: token.userId }, (err, user) => {
            if (err || !user) return callback(new Error('user not found'), false);

            if (user.status === Const.STATUS_DEACTIVATED) {
                return callback(new Error('user is disabled by administrator'), false);
            }

            return callback(err, true, user);
        });
    });
};

modelSchema.methods.generateNewToken = () => PRandom.string(GlobalConfig.LOGIN_TOKEN_LENGTH);

modelSchema.methods.saveNewToken = function (userId, userAgent, deviceId, rememberMe, callback) {
    let now = new Date();

    this.model(modelName).findOne({
        userId: userId,
        userAgent: userAgent,
        deviceId: deviceId
    }, (err, token) => {
        if (err) {
            return callback(err);
        }

        // _model means if the token bind to _model userAgent and deviceId exists
        if (token !== null && token._id) {
            this.model(modelName).findOneAndUpdate({ _id: token._id }, {
                $set: {
                    loginToken: this.model(modelName).schema.methods.generateNewToken(),
                    expiredAt: PDate.addDays(now, ( (rememberMe === true) ? GlobalConfig.LOGIN_TOKEN_EXPIRED_LONG : GlobalConfig.LOGIN_TOKEN_EXPIRED_SHORT ) ),
                    updatedAt: now,
                }
            }, { new: true }, (err, token) => callback(err, token));

        // or it doesn't exist
        } else {
            new (this.model(modelName))({
                userId: userId,
                loginToken: this.generateNewToken(),
                userAgent: userAgent,
                deviceId: deviceId,
                expiredAt: PDate.addDays(now, ( (rememberMe === true) ? GlobalConfig.LOGIN_TOKEN_EXPIRED_LONG : GlobalConfig.LOGIN_TOKEN_EXPIRED_SHORT ) ),
                status: Const.STATUS_ACTIVE
            }).save((err, token) => callback(err, token));
        }
    });
};

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;
