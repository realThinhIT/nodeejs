// ######################################################
// MODEL: LoginToken
// ######################################################

import { NodeeModel } from '../nodee';
import mongoose from 'mongoose';
import User from './User';
const Schema = mongoose.Schema;

const { PRandom, PDate } = NodeeModel.Utils;
const { Const, GlobalConfig } = NodeeModel.Config;
const { Exception } = NodeeModel.Core;

// ################################
// model configurations
// ################################
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
modelSchema.methods.findUserByLoginToken = async function (loginToken) {
    return new Promise((resolve, reject) => {
        this.model(modelName).findOne({ loginToken: loginToken }, (err, token) => {
            if (err || !token) {
                reject(new Exception(err, 'server_error'));
            }
    
            if (token.expiredAt < new Date()) {
                reject(new Exception('token has expired', 'token_expired'));
            }
    
            if (token.status === Const.STATUS_DEACTIVATED) {
                reject(new Exception('token has been disabled', 'token_disabled'));
            }
    
            User.findOne({ userId: token.userId }, (err, user) => {
                if (err || !user) {
                    reject(new Exception('user not found', 'user_not_found'));
                }
    
                if (user.status === Const.STATUS_DEACTIVATED) {
                    reject(new Exception('user is disabled by administrator', 'user_disabled'));
                }
    
                resolve(user);
            });
        });
    });
};

modelSchema.methods.generateNewToken = () => PRandom.string(GlobalConfig.LOGIN_TOKEN_LENGTH);

modelSchema.methods.saveNewToken = async function (userId, userAgent, deviceId, rememberMe) {
    return new Promise((resolve, reject) => {
        let now = new Date();
        
        this.model(modelName).findOne({
            userId: userId,
            userAgent: userAgent,
            deviceId: deviceId
        }, (err, token) => {
            if (err) {
                reject(new Exception(err, 'server_error'));
            }
    
            // _model means if the token bind to _model userAgent and deviceId exists
            if (token !== null && token._id) {
                this.model(modelName).findOneAndUpdate({ _id: token._id }, {
                    $set: {
                        loginToken: this.model(modelName).schema.methods.generateNewToken(),
                        expiredAt: PDate.addDays(now, ( 
                            (rememberMe === true) ? 
                                GlobalConfig.LOGIN_TOKEN_EXPIRED_LONG : GlobalConfig.LOGIN_TOKEN_EXPIRED_SHORT ) 
                            ),
                        updatedAt: now,
                    }
                }, { new: true }, (err, token) => {
                    if (err) {
                        reject(new Exception(err, 'server_error'));
                    }
    
                    resolve(token);
                });
    
            // or it doesn't exist
            } else {
                new (this.model(modelName))({
                    userId: userId,
                    loginToken: this.generateNewToken(),
                    userAgent: userAgent,
                    deviceId: deviceId,
                    expiredAt: PDate.addDays(now, ( (rememberMe === true) ? GlobalConfig.LOGIN_TOKEN_EXPIRED_LONG : GlobalConfig.LOGIN_TOKEN_EXPIRED_SHORT ) ),
                    status: Const.STATUS_ACTIVE
                }).save((err, token) => {
                    if (err) {
                        reject(new Exception(err, 'server_error'));
                    }
    
                    resolve(token);
                });
            }
        });
    });
};

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;
