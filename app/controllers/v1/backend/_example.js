// ######################################################
// CONTROLLER: _example
// ######################################################

let controller = {};
import {ExampleModel} from '../../../models';
import {PMongooserr, PObject} from '../../../modules/nodee';
import {ErrorCode, DetailCode} from '../../../config';

// ################################
// MODIFY THIS!
// ################################

controller.name     = '_example';
controller.middlewares = [
    'api-key', 'auth/require-admin-login', 'pagination'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.readAll = (req, [res, pres], middleware) => {
    ExampleModel.count(middleware.pagination.search(['searchCol']), (err, count) => {
        ExampleModel.find(middleware.pagination.search(['searchCol']), null, middleware.pagination.select, (err, data) => {
            return pres.success(data, '_examples retrieved successfully', null, null, {
                totalItems: count
            });
        });
    });
};

controller.readOne = (req, [res, pres], middleware) => {
    ExampleModel.findOne({ rowId: req.params.id }, (err, data) => {
        if (err) {
            return pres.fail('this _example does not exist');
        }

        return pres.success(data, '_example retrieved successfully');
    });
};

controller.update = (req, [res, pres], middleware) => {
    let updateValues = PObject.selectKeys(req.body, [
        "fieldOne",
        "fieldTwo"
    ]);

    ExampleModel.findOneAndUpdate({ rowId: req.params.id }, {
        $set: updateValues
    }, { new: true }, (err, data) => {
        if (err) {
            return pres.fail('cannot update this _example');
        }

        return pres.success(data, '_example updated successfully');
    });
};

controller.create = (req, [res, pres], middleware) => {
    ExampleModel.count({ fieldOne: req.body.fieldOne }, (err, count) => {
        if (count > 0) {
            return pres.fail('_example is duplicated!', ErrorCode.http.BAD_REQUEST, DetailCode.user.DUPLICATED_USERNAME);
        }

        let exampleModel = new ExampleModel(req.body);
        exampleModel.save((err, data) => {
            if (err) {
                return pres.fail('cannot create new _example', ErrorCode.http.INTERNAL_SERVER_ERROR, null, PMongooserr(err));
            }

            return pres.success(data, '_example created successfully');
        });
    });
};

controller.delete = (req, [res, pres], middleware) => {
    ExampleModel.remove({ rowId: req.params.id }, function (err) {
        if (err) {
            return pres.fail('cannot delete this _example', ErrorCode.http.INTERNAL_SERVER_ERROR);
        }

        return pres.success(null, '_example deleted successfully');
    });
};

// ################################

export default controller;
