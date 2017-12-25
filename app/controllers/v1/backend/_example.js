// ######################################################
// CONTROLLER: examples
// ######################################################

import Nodee from '../../../nodee';
import md5 from 'md5';
const { ExampleModel } = Nodee.Models;
const { PMongooserr, PObject } = Nodee.Utils;
const { ErrorCode, DetailCode } = Nodee.Config;

export default class ExampleController extends Nodee.Core.Controller {
  middlewares() {
    return ['api-key', 'auth/this.require-admin-login', 'pagination'];
  }

  async readAll() {
    let count = await ExampleModel.count(this.middleware.pagination.search(['searchColumn']));
    let examples = await ExampleModel.find(
      this.middleware.pagination.search(['searchColumn']), 
      null, 
      this.middleware.pagination.select
    );

    return this.send.success(examples, 'examples retrieved successfully', null, null, {
        totalItems: count
      }
    );
  }

  async readOne() {
    let example;
    try {
      example = await ExampleModel.find({ exampleId: this.req.params.id });

      if (!example) {
        throw new Error();
      }
    } catch (e) {
      return this.send.fail('this example does not exist');
    }

    return this.send.success(example, 'example retrieved successfully');
  }

  async update() {
    let updateValues = PObject.selectKeys(this.req.body, [
      'username',
      'password'
    ]);
  
    if (updateValues.password != null) {
      updateValues.password = md5(updateValues.password);
    }
  
    let example;
    try {
      example = await ExampleModel.findOneAndUpdate({ exampleId: this.req.params.id }, {
        $set: updateValues
      }, { new: true });
    } catch (e) {
      return this.send.fail('cannot update this example');
    }

    return this.send.success(example, 'example updated successfully');
  }

  async create() {
    let count = await ExampleModel.count({ username: this.req.body.username });
    if (count > 0) {
      return this.send.fail(
        'username is duplicated!', 
        ErrorCode.http.BAD_REQUEST, 
        DetailCode.example.DUPLICATED_USERNAME
      );
    }

    let example;
    try {
      example = await example.save();
    } catch (e) {
      return this.send.fail(
        'cannot create new example', 
        ErrorCode.http.INTERNAL_SERVER_ERROR, 
        null, 
        PMongooserr(e)
      );
    }

    return this.send.success(example, 'example created successfully');
  }

  async delete() {
    try {
      await ExampleModel.remove({ exampleId: this.req.params.id });
    } catch (e) {
      return this.send.fail(
        'cannot delete this example', 
        ErrorCode.http.INTERNAL_SERVER_ERROR
      );
    }

    return this.send.success(null, 'example deleted successfully');
  }
}