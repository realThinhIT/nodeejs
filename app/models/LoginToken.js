// ######################################################
// MODEL: _example
// ######################################################

var mongoose    = global.app.mongoose,
    Schema      = mongoose.Schema,
    md5         = require('md5'),
    validator   = require('../../core/modules/pvalidator'),
    dates       = require('../../core/modules/pdate'),
    random      = require('../../core/modules/prandom');

// ################################

// model configurations
var modelName   = 'LoginToken';
var timestamps  = true;

// define schema
var modelSchema = new Schema({
    user: {
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
    ip: String
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

    next();
});

modelSchema.pre('update', function (next) {

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
    this.model(modelName).findOne({ loginToken: loginToken }, function (err, token) {
        if (err) {
            return callback(err, false);
        }

        if (token.expiredAt < new Date()) {
            return callback(Error('token has expired'), false);
        }

        global.model.User.findOne({ _id: token._id }, function (err, user) {
            return callback(err, true, user);
        });
    });
};

modelSchema.methods.generateNewToken = function () {
    return random.string(global.app.apiConfig.LOGIN_TOKEN_LENGTH);
};

modelSchema.methods.saveNewToken = function (userId, userAgent, deviceId, remember, callback) {
    var self = this;

    this.model(modelName).findOne({
        user: userId,
        userAgent: userAgent,
        deviceId: deviceId
    }, function (err, token) {
        if (err) {
            return callback(err);
        }

        // this means if the token bind to this userAgent and deviceId exists
        if (token !== null && token._id) {
            self.model(modelName).findOneAndUpdate({ _id: token._id }, {
                $set: {
                    loginToken: self.model(modelName).schema.methods.generateNewToken(),
                    expiredAt: dates.addDays(new Date(), ( (rememberMe === true) ? global.app.apiConfig.LOGIN_TOKEN_EXPIRED_LONG : global.app.apiConfig.LOGIN_TOKEN_EXPIRED_SHORT ) )
                }
            }, { new: true }, function (err, token) {
                return callback(err, token);
            });

        // or it doesn't exist
        } else {
            var newToken = new (self.model(modelName))({
                user: userId,
                loginToken: self.model(modelName).schema.methods.generateNewToken(),
                userAgent: userAgent,
                deviceId: deviceId,
                expiredAt: dates.addDays(new Date(), ( (rememberMe === true) ? global.app.apiConfig.LOGIN_TOKEN_EXPIRED_LONG : global.app.apiConfig.LOGIN_TOKEN_EXPIRED_SHORT ) )
            }).save(function (err, token) {
                return callback(err, token);
            });
        }
    });
};

// ################################

var model = mongoose.model(modelName, modelSchema);
module.exports = model;
