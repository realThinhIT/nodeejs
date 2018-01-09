// ######################################################
// MODEL: User
// ######################################################

import NodeeModel from 'nodee-model';
const { PValidator } = NodeeModel.Utils;
const { Const } = NodeeModel.Config;
const { Exception, MongooseModel } = NodeeModel.Core;

export default MongooseModel.create(class ExampleModel extends MongooseModel {
  shape() {
    return {
      status: Number,
      createdAt: Date,
      updatedAt: Date,
    };
  }

  custom(m, _self) {
    // m.virtual('members', {
    //   ref: 'ForeignModel',
    //   localField: 'thisModelField',
    //   foreignField: 'equalForeignModelField',
    //   justOne: false
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
  }

  // static async findSomething() {
  //   return new Promise((resolve, reject) => {

  //   });
  // };
});