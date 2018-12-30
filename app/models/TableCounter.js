// ######################################################
// MODEL: TableCounter
// ######################################################

import NodeeModel from 'nodee/nodee-model';
const { Const, DetailCode } = NodeeModel.Config;
const { Exception, MongooseModel } = NodeeModel.Core;

export default NodeeModel.Core.MongooseModel.create(class TableCounter extends MongooseModel {
  get shape() {
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
        _self.instance().findOneAndUpdate({
          columnId: columnId
        }, {
          updatedAt: new Date(),
          $inc: { counter: 1 }
        }, { new: true, upsert: true }, (err, inc) => {
          if (err) {
            reject(new Exception(err, DetailCode.common.SERVER_ERROR));
          }
      
          resolve(inc.counter);
        });
      });
    };
  }
});