// ######################################################
// MODEL: _example
// ######################################################

var mongoose    = global.app.mongoose,
    Schema      = mongoose.Schema,
    md5         = require('md5'),
    validator   = require('../../core/modules/pvalidator');

// ################################

// model configurations
var modelName   = '_example';
var timestamps  = true;

// define schema
var modelSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
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
// modelSchema.methods.findSomething = function (callback) {
//     callback();
// };

// ################################

var model = mongoose.model(modelName, modelSchema);
module.exports = model;
