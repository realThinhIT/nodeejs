// ######################################################
// CONTROLLER: users
// ######################################################

import Nodee from 'nodee';
import md5 from 'md5';
const { User } = Nodee.Models;
const { PMongooserr, PObject } = Nodee.Utils;
const { ErrorCode, DetailCode } = Nodee.Config;

export default class UsersController extends Nodee.Core.Controller {
  middlewares() {
    return ['api-key', 'auth/this.require-admin-login', 'pagination'];
  }

  async readAll() {
    let count = await User.count(this.middleware.pagination.search(['username']));
    let users = await User.find(
      this.middleware.pagination.search(['username']), 
      null, 
      this.middleware.pagination.select
    );

    return this.send.success(users, 'users retrieved successfully', null, null, {
        totalItems: count
      }
    );
  }

  async readOne() {
    let user;
    try {
      user = await User.find({ userId: this.req.params.id });

      if (!user) {
        throw new Error();
      }
    } catch (e) {
      return this.send.fail('this user does not exist');
    }

    return this.send.success(user, 'user retrieved successfully');
  }

  async update() {
    let updateValues = PObject.selectKeys(this.req.body, [
      'username',
      'password'
    ]);
  
    if (updateValues.password != null) {
      updateValues.password = md5(updateValues.password);
    }
  
    let user;
    try {
      user = await User.findOneAndUpdate({ userId: this.req.params.id }, {
        $set: updateValues
      }, { new: true });
    } catch (e) {
      return this.send.fail('cannot update this user');
    }

    return this.send.success(user, 'user updated successfully');
  }

  async create() {
    let count = await User.count({ username: this.req.body.username });
    if (count > 0) {
      return this.send.fail(
        'username is duplicated!', 
        ErrorCode.http.BAD_REQUEST, 
        DetailCode.user.DUPLICATED_USERNAME
      );
    }

    let user;
    try {
      user = await user.save();
    } catch (e) {
      return this.send.fail(
        'cannot create new user', 
        ErrorCode.http.INTERNAL_SERVER_ERROR, 
        null, 
        PMongooserr(e)
      );
    }

    return this.send.success(user, 'user created successfully');
  }

  async delete() {
    try {
      await User.remove({ userId: this.req.params.id });
    } catch (e) {
      return this.send.fail(
        'cannot delete this user', 
        ErrorCode.http.INTERNAL_SERVER_ERROR
      );
    }

    return this.send.success(null, 'user deleted successfully');
  }
}