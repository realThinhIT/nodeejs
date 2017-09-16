// ######################################################
// MODEL: TableCounter
// ######################################################

import { NodeeModel } from '../nodee';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const { Const } = NodeeModel.Config;
const { Exception } = NodeeModel.Core;

export default new (class TableCounter extends NodeeModel.Core.Model {
    schema() {
        return {
            columnId: {
                type: String,
                required: [true, 'column id is required'],
                unique: true,
            },
            counter: Number,
        
            status: Number,
            createdAt: Date,
            updatedAt: Date,
        };
    }

    custom(m, _self) {
        m.pre('save', function (next) {
            if (_self.timestamps) {
                let currentDate = new Date();
        
                this.createdAt = currentDate;
                this.updatedAt = currentDate;
            }
        
            if (!this.status) {
                this.status = Const.STATUS_ACTIVE;
            }
        
            next();
        });
        
        m.pre('update', function (next) {
            if (_self.timestamps) {
                this.updatedAt = new Date();
            }
        
            next();
        });
        
        m.statics.autoIncrement = async function (columnId) {
            return new Promise((resolve, reject) => {
                _self.collection().findOneAndUpdate({
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
    }
})().create();