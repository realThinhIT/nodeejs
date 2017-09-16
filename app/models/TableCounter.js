// ######################################################
// MODEL: TableCounter
// ######################################################

import { NodeeModel } from '../nodee';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const { Const } = NodeeModel.Config;
const { Exception } = NodeeModel.Core;

// ################################
// model configurations
// ################################
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
modelSchema.statics.autoIncrement = async function (columnId) {
    return new Promise((resolve, reject) => {
        this.model(modelName).findOneAndUpdate({
            columnId: columnId
        }, {
            $inc: { counter: 1 }
        }, { new: true, upsert: true }, (err, inc) => {
            if (err) {
                reject(new Exception(err, 'server_error'));
            }
    
            resolve(inc.counter);
        });
    });
};

// ################################

let _model = mongoose.model(modelName, modelSchema);
export default _model;
