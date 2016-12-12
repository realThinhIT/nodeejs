// ######################################################
// MODEL: TableCounter
// ######################################################

let mongoose        = global.app.mongoose;
let Schema          = mongoose.Schema;
import md5          from 'md5';
import validator    from '../../core/modules/pvalidator';

// ################################

// model configurations
let modelName   = 'TableCounter';
let timestamps  = true;

// define schema
let modelSchema = new Schema({
    columnId: {
        type: String,
        required: [true, 'column id is required'],
        unique: true,
    },
    counter: Number,

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
modelSchema.statics.autoIncrement = function (columnId, callback) {
    this.model(modelName).findOneAndUpdate({
        columnId: columnId
    }, {
        $inc: { counter: 1 }
    }, { new: true, upsert: true }, function (err, inc) {
        callback(err, inc);
    });
};

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;
