// ######################################################
// MODEL: _example
// ######################################################

import Nodee from '../Nodee';
let mongoose = Nodee.module.mongoose;
let Schema = mongoose.Schema;

// ################################

// model configurations
let modelName   = '_example';
let timestamps  = true;

// define schema
let modelSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
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

let _model = mongoose.model(modelName, modelSchema);
export default _model;
