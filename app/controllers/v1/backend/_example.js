// ######################################################
// CONTROLLER: _example
// ######################################################

import $            from '../../../../core/$';
let controller      = {};
const User          = $.model.User;
const LoginToken    = $.model.LoginToken;
const mge           = $.module.pmongooserr;
const obj           = $.module.pobject;
import md5          from 'md5';

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

controller.readAll = (req, res, middleware) => {
    // insert controller logic here

    ExampleModel.count(middleware.pagination.search(['searchCol']), (err, count) => {
        ExampleModel.find(middleware.pagination.search(['searchCol']), null, middleware.pagination.select, (err, data) => {
            return res.success(data, '_examples retrieved successfully', null, null, {
                totalItems: count
            });
        });
    });
};

controller.readOne = (req, res, middleware) => {
    ExampleModel.find({ rowId: req.params.id }, (err, data) => {
        if (err || data.length === 0) {
            return res.fail('this _example does not exist');
        }

        return res.success(data, '_example retrieved successfully');
    });
};

controller.update = (req, res, middleware) => {
    let updateValues = obj.selectKeys(req.body, [
        "fieldOne",
        "fieldTwo"
    ]);

    ExampleModel.findOneAndUpdate({ rowId: req.params.id }, {
        $set: updateValues
    }, { new: true }, (err, data) => {
        if (err || data.length === 0) {
            return res.fail('cannot update this _example');
        }

        return res.success(data, '_example updated successfully');
    });
};

controller.create = (req, res, middleware) => {
    ExampleModel.count({ fieldOne: req.body.fieldOne }, (err, count) => {
        if (count > 0) {
            return res.fail('_example is duplicated!', $.param.error.http.BAD_REQUEST, $.param.detail.user.DUPLICATED_USERNAME);
        }
    });

    let exampleModel = new ExampleModel(req.body);

    exampleModel.save((err, data) => {
        if (err) {
            return res.fail('cannot create new _example', $.param.error.http.INTERNAL_SERVER_ERROR, null, mge(err));
        }

        return res.success(data, '_example created successfully');
    });
};

controller.delete = (req, res, middleware) => {
    ExampleModel.remove({ rowId: req.params.id }, function (err) {
        if (err) {
            return res.fail('cannot delete this _example', $.param.error.http.INTERNAL_SERVER_ERROR);
        }

        return res.success(null, '_example deleted successfully');
    });
};

// ################################

export default controller;
