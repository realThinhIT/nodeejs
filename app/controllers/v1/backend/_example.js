// ######################################################
// CONTROLLER: _example
// ######################################################

import Nodee from '../../../nodee';
const { ExampleModel } = Nodee.Models;
const { PMongooserr, PObject } = Nodee.Utils;
const { ErrorCode, DetailCode } = Nodee.Config;

export default class ExampleClass extends Nodee.Core.Controller {
    middlewares() {
        return ['api-key', 'auth/this.require-admin-login', 'pagination'];
    }

    readAll() {
        ExampleModel.count(this.middleware.pagination.search(['searchCol']), (err, count) => {
            ExampleModel.find(this.middleware.pagination.search(['searchCol']), null, this.middleware.pagination.select, 
                (err, data) => {
                    return this.send.success(data, '_examples retrieved successfully', null, null, {
                        totalItems: count
                    });
            });
        });
    }

    readOne() {
        ExampleModel.findOne({ rowId: this.req.params.id }, (err, data) => {
            if (err) {
                return this.send.fail('this _example does not exist');
            }
    
            return this.send.success(data, '_example retrieved successfully');
        });
    }

    update() {
        let updateValues = PObject.selectKeys(this.req.body, [
            'fieldOne',
            'fieldTwo'
        ]);
    
        ExampleModel.findOneAndUpdate({ rowId: this.req.params.id }, {
            $set: updateValues
        }, { new: true }, (err, data) => {
            if (err) {
                return this.send.fail('cannot update this _example');
            }
    
            return this.send.success(data, '_example updated successfully');
        });
    }

    create() {
        ExampleModel.count({ fieldOne: this.req.body.fieldOne }, (err, count) => {
            if (count > 0) {
                return this.send.fail('_example is duplicated!', ErrorCode.http.BAD_this.REQUEST, DetailCode.user.DUPLICATED_USERNAME);
            }
    
            let exampleModel = new ExampleModel(this.req.body);
            exampleModel.save((err, data) => {
                if (err) {
                    return this.send.fail('cannot create new _example', ErrorCode.http.INTERNAL_SERVER_ERROR, null, PMongooserr(err));
                }
    
                return this.send.success(data, '_example created successfully');
            });
        });
    }

    delete() {
        ExampleModel.remove({ rowId: this.req.params.id }, (err) => {
            if (err) {
                return this.send.fail('cannot delete this _example', ErrorCode.http.INTERNAL_SERVER_ERROR);
            }
    
            return this.send.success(null, '_example deleted successfully');
        });
    }
}