// ######################################################
// MODEL: User
// ######################################################

import NodeeModel from 'nodee/nodee-model';
import TableCounter from './TableCounter';
import md5 from 'md5';

const { PValidator } = NodeeModel.Utils;
const { Const, DetailCode } = NodeeModel.Config;
const { Exception, MongooseModel } = NodeeModel.Core;

export default MongooseModel.create(class User extends MongooseModel {
  get shape() {
    return {
      userId: Number,
      username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
    
        validate: [
          {
            validator: value => {
              return new Promise((resolve, reject) => {
                this.collection().count({ username: value }, (err, count) => {
                  if (err) {
                    reject(err);
                  }

                  resolve(!count);
                });
              });
            },
            message: 'username is duplicated'
          },
          {
            validator: value => {
              return PValidator.length(value, 6, 20);
            },
            message: 'username is allowed to be between 6 - 20 characters'
          }
        ]
      },
      password: {
        type: String,
        required: [true, 'password is required'],
        validate: {
          validator: value => {
            return PValidator.length(value, 6, 20);
          },
          message: 'password is allowed to be between 6 - 20 characters'
        }
      },
      usergroup: {
        type: Number,
        validate: {
          validator: value => {
            if (
              value != Const.USERGROUP_ADMIN && 
              value != Const.USERGROUP_MOD &&
              value != Const.USERGROUP_USER && 
              value != Const.USERGROUP_GUEST
            ) {
              return false;
            } else {
              return true;
            }
          },
          message: 'usergroup is invalid'
        }
      },
    
      status: Number,
      createdAt: Date,
      updatedAt: Date,
    };
  }

  custom(m, _self) {
    m.pre('save', async function (next) {
      if (_self.timestamps) {
        let currentDate = new Date();
    
        this.createdAt = currentDate;
        this.updatedAt = currentDate;
      }
    
      if (!this.usergroup) {
        this.usergroup = Const.USERGROUP_USER;
      }
    
      if (!this.status) {
        this.status = Const.STATUS_ACTIVE;
      }
    
      this.password = md5(this.password);
    
      this.userId = await TableCounter.autoIncrement('userId');
    
      next();
    });
    
    m.pre('update', function (next) {
      if (_self.timestamps) {
        this.updatedAt = new Date();
      }
    
      next();
    });

    m.methods.findByUsernameAndPassword = async function (username, password) {
      return new Promise((resolve, reject) => {
        if (!username || !password) {
          reject(new Exception('username or password is not defined', DetailCode.user.USERNAME_PASSWORD_NOT_DEFINED));
        }
      
        _self.collection().findOne({ username: username, password: md5(password) }, (err, user) => {
          if (err) {
            reject(new Exception(err, DetailCode.common.SERVER_ERROR));
          }
      
          resolve(user);
        });
      });
    };
  }
});