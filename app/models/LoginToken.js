// ######################################################
// MODEL: _example
// ######################################################

let mongoose        = global.app.mongoose;
let Schema          = mongoose.Schema;
import md5          from 'md5';
import validator    from '../../core/modules/pvalidator';
import dates        from '../../core/modules/pdate';
import random       from '../../core/modules/prandom';

// ################################

// model configurations
let modelName   = 'LoginToken';
let timestamps  = true;

// define schema
let modelSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
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

        if (token.status === global.consts.STATUS_DEACTIVATED) {
            return callback(new Error('token has been disabled'), false);
        }

        global.model.User.findOne({ _id: token.userId }, (err, user) => {
            if (err || !user) return callback(new Error('user not found'), false);

            if (user.status === global.consts.STATUS_DEACTIVATED) {
                return callback(new Error('user is disabled by administrator'), false);
            }

            return callback(err, true, user);
        });
    });
};

modelSchema.methods.generateNewToken = () => random.string(global.app.apiConfig.LOGIN_TOKEN_LENGTH);

modelSchema.methods.saveNewToken = function (userId, userAgent, deviceId, rememberMe, callback) {
    let now = new Date();

    this.model(modelName).findOne({
        userId,
        userAgent,
        deviceId
    }, (err, token) => {
        if (err) {
            return callback(err);
        }

        // _model means if the token bind to _model userAgent and deviceId exists
        if (token !== null && token._id) {
            this.model(modelName).findOneAndUpdate({ _id: token._id }, {
                $set: {
                    loginToken: this.model(modelName).schema.methods.generateNewToken(),
                    expiredAt: dates.addDays(now, ( (rememberMe === true) ? global.app.apiConfig.LOGIN_TOKEN_EXPIRED_LONG : global.app.apiConfig.LOGIN_TOKEN_EXPIRED_SHORT ) ),
                    updatedAt: now,
                }
            }, { new: true }, (err, token) => callback(err, token));

        // or it doesn't exist
        } else {
            let newToken = new (this.model(modelName))({
                userId,
                loginToken: this.generateNewToken(),
                userAgent,
                deviceId,
                expiredAt: dates.addDays(now, ( (rememberMe === true) ? global.app.apiConfig.LOGIN_TOKEN_EXPIRED_LONG : global.app.apiConfig.LOGIN_TOKEN_EXPIRED_SHORT ) ),
                status: global.consts.STATUS_ACTIVE
            }).save((err, token) => callback(err, token));
        }
    });
};

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;
