// ######################################################
// MODEL: LoginToken
// ######################################################

import NodeeModel from 'nodee/nodee-model';
import User from './User';

const { PRandom, PDate } = NodeeModel.Utils;
const { Const, GlobalConfig, DetailCode } = NodeeModel.Config;
const { Exception, MongooseModel } = NodeeModel.Core;

export default NodeeModel.Core.MongooseModel.create(class LoginToken extends MongooseModel {
  get shape() {
    return {
      userId: Number,
      loginToken: {
        type: String,
        required: true,
        unique: true
      },
      expiredAt: {
        type: Date,
        required: true,
      },
      userAgent: String,
      deviceId: String,
      ip: String,
    
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

    m.methods.findUserByLoginToken = async function (loginToken) {
      return new Promise((resolve, reject) => {
        _self.instance().findOne({ loginToken: loginToken }, (err, token) => {
          if (err || !token) {
            reject(new Exception(err, DetailCode.common.SERVER_ERROR));
          }
      
          if (token.expiredAt < new Date()) {
            reject(new Exception('token has expired', DetailCode.loginToken.TOKEN_EXPIRED));
          }
      
          if (token.status === Const.STATUS_DEACTIVATED) {
            reject(new Exception('token has been disabled', DetailCode.loginToken.TOKEN_DISABLED));
          }
      
          User.findOne({ userId: token.userId }, (err, user) => {
            if (err || !user) {
              reject(new Exception('user not found', DetailCode.user.USER_NOT_FOUND));
            }
      
            if (user.status === Const.STATUS_DEACTIVATED) {
              reject(new Exception('user is disabled by administrator', DetailCode.user.USER_DISABLED));
            }
      
            resolve(user);
          });
        });
      });
    };
    
    m.methods.generateNewToken = () => PRandom.string(GlobalConfig.LOGIN_TOKEN_LENGTH);
    
    m.methods.saveNewToken = async function (userId, userAgent, deviceId, rememberMe) {
      return new Promise((resolve, reject) => {
        let now = new Date();
        
        _self.instance().findOne({
          userId: userId,
          userAgent: userAgent,
          deviceId: deviceId
        }, (err, token) => {
          if (err) {
            reject(new Exception(err, DetailCode.common.SERVER_ERROR));
          }
      
          // _model means if the token bind to _model userAgent and deviceId exists
          if (token !== null && token._id) {
            _self.instance().findOneAndUpdate({ _id: token._id }, {
              $set: {
                loginToken: _self.instance().schema.methods.generateNewToken(),
                expiredAt: PDate.addDays(now, ( 
                  (rememberMe === true) ? 
                    GlobalConfig.LOGIN_TOKEN_EXPIRED_LONG : GlobalConfig.LOGIN_TOKEN_EXPIRED_SHORT ) 
                  ),
                updatedAt: now,
              }
            }, { new: true }, (err, token) => {
              if (err) {
                reject(new Exception(err, DetailCode.common.SERVER_ERROR));
              }
      
              resolve(token);
            });
      
          // or it doesn't exist
          } else {
            new (_self.instance())({
              userId: userId,
              loginToken: this.generateNewToken(),
              userAgent: userAgent,
              deviceId: deviceId,
              expiredAt: PDate.addDays(now, ( (rememberMe === true) ? GlobalConfig.LOGIN_TOKEN_EXPIRED_LONG : GlobalConfig.LOGIN_TOKEN_EXPIRED_SHORT ) ),
              status: Const.STATUS_ACTIVE
            }).save((err, token) => {
              if (err) {
                reject(new Exception(err, DetailCode.common.SERVER_ERROR));
              }
      
              resolve(token);
            });
          }
        });
      });
    };
  }
});