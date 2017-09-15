// ######################################################
// CONTROLLER: users
// ######################################################

import Nodee from '../../../nodee';
import md5 from 'md5';
const { User } = Nodee.Models;
const { PMongooserr, PObject } = Nodee.Utils;
const { ErrorCode, DetailCode } = Nodee.Config;

export default class UsersController extends Nodee.Core.Controller {
    middlewares() {
        return ['api-key', 'auth/this.require-admin-login', 'pagination'];
    }

    readAll() {
        User.count(this.middleware.pagination.search(['username']), (err, count) => {
            User.find(this.middleware.pagination.search(['username']), null, this.middleware.pagination.select, 
                (err, data) => {
                    return this.send.success(data, 'users retrieved successfully', null, null, {
                        totalItems: count
                    });
            });
        });
    }

    readOne() {
        User.find({ userId: this.req.params.id }, (err, data) => {
            if (err) {
                return this.send.fail('this user does not exist');
            }
    
            return this.send.success(data, 'user retrieved successfully');
        });
    }

    update() {
        let updateValues = PObject.selectKeys(this.req.body, [
            'username',
            'password'
        ]);
    
        if (updateValues.password != null) {
            updateValues.password = md5(updateValues.password);
        }
    
        User.findOneAndUpdate({ userId: this.req.params.id }, {
            $set: updateValues
        }, { new: true }, (err, data) => {
            if (err || data.length === 0) {
                return this.send.fail('cannot update this user');
            }
    
            return this.send.success(data, 'user updated successfully');
        });
    }

    create() {
        User.count({ username: this.req.body.username }, (err, count) => {
            if (count > 0) {
                return this.send.fail('username is duplicated!', ErrorCode.http.BAD_this.reqUEST, DetailCode.user.DUPLICATED_USERNAME);
            }
    
            let user = new User(this.req.body);
    
            user.save((err, data) => {
                if (err) {
                    return this.send.fail('cannot create new user', ErrorCode.http.INTERNAL_SERVER_ERROR, null, PMongooserr(err));
                }
    
                return this.send.success(data, 'user created successfully');
            });
        });
    }

    delete() {
        User.remove({ userId: this.req.params.id }, (err) => {
            if (err) {
                return this.send.fail('cannot delete this user', ErrorCode.http.INTERNAL_SERVER_ERROR);
            }
    
            return this.send.success(null, 'user deleted successfully');
        });
    }
}