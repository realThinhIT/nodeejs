// ######################################################
// MODEL: _example
// ######################################################

let mongoose        = global.app.mongoose;
let Schema          = mongoose.Schema;
import md5          from 'md5';
import validator    from '../../core/modules/pvalidator';

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
// modelSchema.methods.findSomething = function (callback) {
//     callback();
// };

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;
