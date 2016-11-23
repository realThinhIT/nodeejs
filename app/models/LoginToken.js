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
});

// ################################
// PRE-EXECUTIONS
// ################################
modelSchema.pre('save', next => {
    if (timestamps) {
        let currentDate = new Date();

        this.createdAt = currentDate;
        this.updatedAt = currentDate;
    }

    next();
});

modelSchema.pre('update', next => {
    if (timestamps) {
        this.updatedAt = new Date();
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
modelSchema.methods.findUserByLoginToken = (loginToken, callback) => {
    _model.findOne({ loginToken }, (err, token) => {
        if (err || !token) {
            return callback(err, false);
        }

        if (token.expiredAt < new Date()) {
            return callback(new Error('token has expired'), false);
        }

        if (token.status === 0) {
            return callback(new Error('token has been disabled'), false);
        }

        global.model.User.findOne({ _id: token.userId }, (err, user) => {
            if (err || !user) return callback(new Error('user not found'), false);

            return callback(err, true, user);
        });
    });
};

modelSchema.methods.generateNewToken = () => random.string(global.app.apiConfig.LOGIN_TOKEN_LENGTH);

modelSchema.methods.saveNewToken = (userId, userAgent, deviceId, rememberMe, callback) => {
    let self = _model;
    let now = new Date();

    _model.findOne({
        userId,
        userAgent,
        deviceId
    }, (err, token) => {
        if (err) {
            return callback(err);
        }

        // this means if the token bind to this userAgent and deviceId exists
        if (token !== null && token._id) {
            self.model(modelName).findOneAndUpdate({ _id: token._id }, {
                $set: {
                    loginToken: self.model(modelName).schema.methods.generateNewToken(),
                    expiredAt: dates.addDays(now, ( (rememberMe === true) ? global.app.apiConfig.LOGIN_TOKEN_EXPIRED_LONG : global.app.apiConfig.LOGIN_TOKEN_EXPIRED_SHORT ) ),
                    updatedAt: now,
                }
            }, { new: true }, (err, token) => callback(err, token));

        // or it doesn't exist
        } else {
            let newToken = new (self.model(modelName))({
                userId,
                loginToken: self.model(modelName).schema.methods.generateNewToken(),
                userAgent,
                deviceId,
                expiredAt: dates.addDays(now, ( (rememberMe === true) ? global.app.apiConfig.LOGIN_TOKEN_EXPIRED_LONG : global.app.apiConfig.LOGIN_TOKEN_EXPIRED_SHORT ) ),
                status: 1
            }).save((err, token) => callback(err, token));
        }
    });
};

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;
