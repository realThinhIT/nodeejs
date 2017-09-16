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

const USERGROUP_ADMIN   = 1;
const USERGROUP_MOD     = 2;
const USERGROUP_USER    = 3;
const USERGROUP_GUEST   = 4;

export default new (class User extends NodeeModel.Core.Model {
    schema() {
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
                                this.collection().count({ username: this.instance().username }, (err, count) => {
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
                        if (value != USERGROUP_ADMIN && value != USERGROUP_MOD && value != USERGROUP_USER && value != USERGROUP_GUEST) {
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
                this.usergroup = USERGROUP_USER;
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
                    reject(new Exception('username or password is not defined', 'user_pass_not_defined'));
                }
            
                _self.collection().findOne({ username: username, password: md5(password) }, (err, user) => {
                    if (err) {
                        reject(new Exception(err, 'server_error'));
                    }
            
                    resolve(user);
                });
            });
        };
    }
})().create();