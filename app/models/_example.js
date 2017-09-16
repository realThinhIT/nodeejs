// ######################################################
// MODEL: User
// ######################################################

import { NodeeModel } from '../nodee';
import mongoose from 'mongoose';
import md5 from 'md5';
import TableCounter from './TableCounter';
const Schema = mongoose.Schema;

const { PValidator } = NodeeModel.Utils;
const { Const } = NodeeModel.Config;
const { Exception } = NodeeModel.Core;

export default new (class ExampleModel extends NodeeModel.Core.Model {
    schema() {
        return {
            status: Number,
            createdAt: Date,
            updatedAt: Date,
        };
    }

    custom(m, _self) {
        // modelSchema.virtual('members', {
        //     ref: 'ForeignModel',
        //     localField: 'thisModelField',
        //     foreignField: 'equalForeignModelField',
        //     justOne: false
        // });

        m.pre('save', function (next) {
            if (_self.timestamps) {
                let currentDate = new Date();
        
                this.createdAt = currentDate;
                this.updatedAt = currentDate;
            }
        
            next();
        });
        
        m.pre('update', function (next) {
            if (_self.timestamps) {
                this.updatedAt = new Date();
            }
        
            next();
        });

        // modelSchema.methods.findSomething = async function () {
        //     return new Promise((resolve, reject) => {
        // 
        //     });
        // };
    }
})().create();